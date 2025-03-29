const Route = require('../models/Route');
const Stop = require('../models/Stop');

// Helper functions for path finding algorithm
const buildStopGraph = (routes) => {
  const graph = new Map();
  
  // Build graph from routes
  routes.forEach(route => {
    const stops = route.stops;
    
    for (let i = 0; i < stops.length; i++) {
      const currentStop = stops[i].stopId;
      
      if (!graph.has(currentStop)) {
        graph.set(currentStop, []);
      }
      
      // Connect to next stop (circular route - last connects to first)
      const nextStop = stops[(i + 1) % stops.length].stopId;
      const travelTime = stops[i].estimatedTimeToNextStop;
      
      graph.get(currentStop).push({
        stopId: nextStop,
        routeNumber: route.routeNumber,
        travelTime,
        requiresTransfer: false
      });
    }
  });
  
  return graph;
};

const findShortestPath = (graph, start, end) => {
  // Set up data structures for Dijkstra's algorithm
  const distances = new Map();
  const previous = new Map();
  const unvisited = new Set();
  
  // Initialize distances
  for (const [stopId] of graph) {
    distances.set(stopId, Infinity);
    previous.set(stopId, null);
    unvisited.add(stopId);
  }
  
  distances.set(start, 0);
  
  while (unvisited.size > 0) {
    // Find the unvisited node with the smallest distance
    let current = null;
    let smallestDistance = Infinity;
    
    for (const stopId of unvisited) {
      if (distances.get(stopId) < smallestDistance) {
        smallestDistance = distances.get(stopId);
        current = stopId;
      }
    }
    
    // If the smallest distance is infinity, there's no path
    if (smallestDistance === Infinity) break;
    
    // Remove current node from unvisited
    unvisited.delete(current);
    
    // If we've reached the end, we're done
    if (current === end) break;
    
    // Check all neighbors of the current node
    const neighbors = graph.get(current) || [];
    
    for (const neighbor of neighbors) {
      if (!unvisited.has(neighbor.stopId)) continue;
      
      const totalDistance = distances.get(current) + neighbor.travelTime;
      
      if (totalDistance < distances.get(neighbor.stopId)) {
        distances.set(neighbor.stopId, totalDistance);
        previous.set(neighbor.stopId, {
          stopId: current,
          routeNumber: neighbor.routeNumber,
          requiresTransfer: neighbor.requiresTransfer
        });
      }
    }
  }
  
  // Build the path
  const path = [];
  let current = end;
  
  if (previous.get(end) === null) {
    return { path: [], totalTime: Infinity }; // No path found
  }
  
  while (current !== start) {
    const prevNode = previous.get(current);
    path.unshift({
      stopId: current,
      routeNumber: prevNode.routeNumber,
      requiresTransfer: prevNode.requiresTransfer
    });
    current = prevNode.stopId;
  }
  
  path.unshift({ stopId: start, routeNumber: null, requiresTransfer: false });
  
  return {
    path,
    totalTime: distances.get(end)
  };
};

// Controller for path finding operations
const pathFinderController = {
  // Find path between two stops
  findPath: async (req, res) => {
    try {
      const { from, to } = req.query;
      
      if (!from || !to) {
        return res.status(400).json({ 
          message: 'Both from and to stop IDs are required' 
        });
      }
      
      if (from === to) {
        return res.status(400).json({ 
          message: 'Starting and destination stops cannot be the same' 
        });
      }

      // Fetch all routes
      const routes = await Route.find();
      
      // Create a graph of stops
      const graph = buildStopGraph(routes);
      
      // Check if stops exist
      if (!graph.has(from)) {
        return res.status(404).json({ message: 'Start stop not found' });
      }
      
      if (!graph.has(to)) {
        return res.status(404).json({ message: 'Destination stop not found' });
      }
      
      // Find the shortest path
      const result = findShortestPath(graph, from, to);
      
      if (result.path.length === 0) {
        return res.status(404).json({ message: 'No path found between the specified stops' });
      }
      
      // Get stop details for the path
      const stopIds = result.path.map(stop => stop.stopId);
      const stops = await Stop.find({ stopId: { $in: stopIds } });
      
      // Map stop details to the path
      const detailedPath = result.path.map(pathStop => {
        const stopDetails = stops.find(s => s.stopId === pathStop.stopId);
        return {
          ...pathStop,
          name: stopDetails ? stopDetails.name : 'Unknown Stop'
        };
      });
      
      res.json({
        path: detailedPath,
        totalTime: result.totalTime,
        numberOfStops: result.path.length - 1,
        numberOfTransfers: result.path.filter(stop => stop.requiresTransfer).length
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = pathFinderController;
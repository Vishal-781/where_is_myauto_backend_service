const redisClient = require('../config/redis');

const subscribeToRouteUpdates = (callback) => {
    redisClient.subscribe('route-updates', (message) => {
        callback(JSON.parse(message));
    });
};

module.exports = { subscribeToRouteUpdates };
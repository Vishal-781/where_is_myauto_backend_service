
const authController ={
    register: async (req, res) => {
        // Register user
        try{
            const {name, email, password} = req.body;
            if(!name || !email || !password){
                return res.status(400).json({msg: "Please enter all fields"});
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({
                name,
                email,
                password: hashedPassword
            });
            await user.save();
            res.status(201).json({msg: "User registered successfully"});
        }
        catch(err){
            res.status(500).json({error: err.message});
        }
    },
    login: async (req, res) => {
        // Login user
        try{
            const {email, password} = req.body;
            if(!email || !password){
                return res.status(400).json({msg: "Please enter all fields"});
            }
            const user = await User.findOne({email});
            if(!user){
                return res.status(400).json({msg: "User does not exist"});
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch){
                return res.status(400).json({msg: "Invalid credentials"});
            }
            const token = jwt.sign({id: user._id,role: user.role}, process.env.JWT_SECRET);
            res.json({
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            });
        }
        catch(err){
            res.status(500).json({error: err.message});
        }
    }
}
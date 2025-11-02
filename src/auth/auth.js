const { dbConnect } = require('../connection/dbConnect');
const Dealer = require('../models/dealer-model/dealerModel');
const User = require('../models/user-models/userModel');
const bcrypt = require('bcryptjs');

const router = require('express').Router();


router.post('/signin-user',async(req,res)=>{
    await dbConnect();
    const {username,password} = req.body;
    // For demonstration, using hardcoded credentials. In production, use a database.
    const userExist=await User.findOne({username,password});
    if(userExist){
        const passwordMatched=await bcrypt.compare(password,userExist.password);
        if(passwordMatched){
            res.status(200).json({ success: true, message: 'Authentication successful' });
        }else{
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    }else{
        res.status(401).json({ success: false, message: 'user does not exist please signup first' });
    }
});

router.post('/signin-dealer',async(req,res)=>{
    await dbConnect();
    const {username,password} = req.body;
    // For demonstration, using hardcoded credentials. In production, use a database.
    const userExist=await Dealer.findOne({username,password});
    if(userExist){
        const passwordMatched=await bcrypt.compare(password,userExist.password);
        if(passwordMatched){
            res.status(200).json({ success: true, message: 'Authentication successful' });
        }else{
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    }else{
        res.status(401).json({ success: false, message: 'user does not exist please signup first' });
    }
})

router.post('/signup-user',async(req,res)=>{
    await dbConnect();
    try {
        const {username,password,email} = req.body;
        const existingUser = await User.findOne({ $or: [ { username }, { email } ] });
        if (existingUser) {
            return  res.status(400).json({ success: false, message: 'Username or email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword, email });
        await newUser.save();
        res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error registering user', error: error.message });
    }
});

router.post('/signup-dealer',async(req,res)=>{
    await dbConnect();
    try {
        const {username,password,email,phone} = req.body;
        const existingUser = await Dealer.findOne({ $or: [ { username }, { email }, { phone } ] });
        if (existingUser) {
            return  res.status(400).json({ success: false, message: 'Username, email or phone already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newDealer = new Dealer({ username, password: hashedPassword, email, phone });
        await newDealer.save();
        res.status(201).json({ success: true, message: 'Dealer registered successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error registering dealer', error: error.message });
    }
});

module.exports = router;
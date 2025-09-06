
const Vendor = require("../models/Vendor");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const vendorRegister = async (req,res) => {
    const {username, email, password} = req.body;

    try{
        const emailExist = await Vendor.findOne({email});
        if(emailExist){
            return res.status(400).json({message: "Email already exists"});
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const newVendor = new Vendor({username, email, password: hashedPassword});
        await newVendor.save();
        res.status(201).json({message: "Vendor registered successfully"});
    } catch(err){
        console.error(err);
        res.status(500).json({error: "Server error"});
    }
}

const venderLogin = async (req,res) => {
    const{email,password} = req.body;

    try{
        const vender = await Vendor.findOne({email});
        if(!vender || !( await bcrypt.compare(password , vender.password))){
            return res.status(400).json({message: "Invalid email or password"});
        }
    const token = jwt.sign({vendorId: vender._id}, process.env.JWT_SECRET, {expiresIn: '1h'});
        res.status(200).json({message: "Login successful", token});
    } catch(err){
        console.error(err);
        res.status(500).json({error: "Server error"});
    }
}


const getAllVendors = async (req, res) => {
         try{
            const vendors = await Vendor.find().populate('firm');
            res.json({vendors})
         } catch(err){  
          console.error(err);
            res.status(500).json({error: "Server error"});
         }
}

const getVendorById = async(req,res) => {
    const vendorId = req.params.id;

    try{
        const vendor = await Vendor.findById(vendorId).populate('firm');
        if(!vendor){
            return res.status(404).json({error: "Vendor not found"});
        }
        res.status(200).json({vendor});

    } catch(err){
        console.error(err);
        res.status(500).json({error: "Server error"});
    }
}

module.exports = {vendorRegister,venderLogin,getAllVendors,getVendorById};
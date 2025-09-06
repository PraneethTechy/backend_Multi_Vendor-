const express = require('express');

const Firm = require('../models/Firm');
const Vendor = require('../models/Vendor');
const multer = require('multer');

  const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, "uploads/"); // folder where images will be stored
        },
        filename: function (req, file, cb) {
            // Rename file to avoid conflicts
            cb(null, Date.now() + path.extname(file.originalname));
        }
    });

    const upload = multer({storage: storage});

const addFirm = async (req, res) => {
     try {
         const { firmName, area, category, region, offer } = req.body;
         const image = req.file ? req.file.filename : undefined;

         // Validate required fields
         if (!firmName || !area) {
             return res.status(400).json({ message: 'firmName and area are required.' });
         }

         const vendor = await Vendor.findById(req.vendorId);
         if (!vendor) {
             return res.status(404).json({ message: 'Vendor not found' });
         }

         // Check for duplicate firmName
         const existingFirm = await Firm.findOne({ firmName });
         if (existingFirm) {
             return res.status(409).json({ message: 'Firm name already exists.' });
         }

         const firm = new Firm({
             firmName,
             area,
             category,
             region,
             offer,
             image,
             vendor: vendor._id
         });

         const savedFirm = await firm.save();
         vendor.firm.push(savedFirm);
         await vendor.save();

         return res.status(200).json({ message: 'Firm added successfully' });
     } catch (error) {
         console.error('Error adding firm:', error);
         // Return more informative error if possible
         if (error.name === 'ValidationError') {
             return res.status(400).json({ message: error.message });
         }
         return res.status(500).json({ message: 'Internal server error' });
     }

}


    const deleteFirmById = async(req,res) => {
        try {
            const firmId = req.params.firmId;
            const deletedProduct = await Product.findByIdAndDelete(firmId);
            if(!deletedProduct){
                return res.status(404).json({ error: 'Product not found' });
            }   
            res.status(200).json({ message: 'Firm deleted successfully' });
        }
        catch (error) {
            console.error('Error deleting product:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

module.exports = {addFirm: [upload.single('image'), addFirm], deleteFirmById};
const { dbConnect } = require('../connection/dbConnect');
const Land = require('../models/plot-model/plotModel');

const router = require('express').Router();



router.get('/protected', (req, res) => {  
 
  res.json({ message: 'This is a protected route' });
})

router.post('/add-plot',async(req,res)=>{
    await dbConnect()
    try {
        const plotData = req.body;
        const newPlot = new Land(plotData);
        await newPlot.save();
        res.status(201).json({ success: true, message: 'Plot added successfully', plot: newPlot });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error adding plot', error: error.message });
    }
})
module.exports = router
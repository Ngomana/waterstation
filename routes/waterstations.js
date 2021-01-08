const express = require('express');
const router = express.Router()
const Waterstation = require('../models/waterstation')

router.get('/', async(req, res) => {
    try {
        const waterstations = await Waterstation.find()
        res.json(waterstations)

    } catch (error)
    {
        res.send('error ' + err)
        
    }
})

//geting id 
router.get('/:id', async(req, res) => {
    try {
        const waterstation = await Waterstation.findById(req.params.id)
        res.json(waterstation)

    } catch (error)
    {
        res.send('error ' + err)
        
    }
})


// for post req
router.post('/', async (req, res)=>{
    const waterstation = new Waterstation({
        location: req.body.location,
        station: req.body.station,
        capacity: req.body.capacity

    })
    try {
        const w1 = await waterstation.save()
        res.send(w1)
    } catch (error)
    {
        res.send('error')
        
    }
})


module.exports = router
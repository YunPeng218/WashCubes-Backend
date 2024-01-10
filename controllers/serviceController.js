
const Service = require('../models/service');

// GET ALL AVAILABLE SERVICES
module.exports.getServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.status(200).json({ services });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
};

// GET DETAILS OF A SPECIFIC SERVICE
module.exports.getServiceDetails = async (req, res) => {
    try {
        const service = await Service.findById(req.params.serviceId);
        res.render('orders/selectOrderItems', { service });
    } catch (error) {
        res.status(500).send('Internal Server Error');
    }
};
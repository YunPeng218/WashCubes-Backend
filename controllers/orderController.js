
const Order = require('../models/order');
const Service = require('../models/service');

// DISPLAY CREATE ORDER FORM
module.exports.renderCreateOrderForm = async (req, res) => {
    const services = await Service.find({});
    res.render('orders/createOrder', { services });
}

// GENERATE ORDER NUMBER
const generateOrderNumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    const orderNumber = `${timestamp}${random}`;
    //console.log(orderNumber);
    return orderNumber;
};

// CREATE A NEW ORDER
module.exports.createOrder = async (req, res) => {
    try {
        const formData = req.body;
        const order = await createOrderObject(formData);
        const newOrder = new Order(order);
        newOrder.orderNumber = generateOrderNumber();
        newOrder.service = formData.service;
        const service = await Service.findById({ _id: formData.service });
        res.render('orders/orderSummary', { order: newOrder, service })
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).send('Internal Server Error');
    }
}

// CREATE ORDER OBJECT FROM FORM DATA
const createOrderObject = async (formData) => {
    const orderItems = [];

    // ADD SELECTED ITEMS INTO ORDER
    for (const [itemId, quantity] of Object.entries(formData.quantity)) {
        if (quantity == 0) continue;
        const item = await findItemById(formData.service, itemId);
        const orderItem = {
            name: item.name,
            unit: item.unit,
            price: item.price,
            quantity: parseInt(quantity, 10) || 0,
            cumPrice: item.price * quantity,
        };
        orderItems.push(orderItem);
    }

    const order = {
        orderItems,
    };
    return order;
}

// GET DETAILS OF A SPECIFIC ITEM WITHIN A SERVICE
const findItemById = async (serviceId, itemId) => {
    try {
        const service = await Service.findById(serviceId);
        if (!service) throw new Error('Service not found');

        const item = service.items.find(item => item._id.toString() === itemId);
        if (!item) throw new Error('Item not found');
        return item;

    } catch (error) {
        console.error('Error finding item by ID:', error);
        throw error;
    }
}




// SAVE ORDER TO DATABASE AFTER USER CONFIRMATION
module.exports.confirmOrder = async (req, res) => {
    try {
        const { order } = req.body;
        const newOrder = new Order(JSON.parse(order));
        console.log(newOrder);
        await newOrder.save();
        res.send('Order saved successfully.')
    } catch (error) {
        console.error('Error confirming order:', error);
        res.status(500).send('Internal Server Error');
    }
}
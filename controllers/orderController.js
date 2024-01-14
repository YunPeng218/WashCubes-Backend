
const Order = require('../models/order');
const Service = require('../models/service');
const Locker = require('../models/locker');
const { getAvailableCompartment } = require('../controllers/lockerController');

// DISPLAY ALL ORDERS ASSOCIATED WITH USER
module.exports.displayOrders = async (req, res) => {
    // AUTH
    const orders = await Order.find({});
}

// CHECK AVAILABILITY FOR SELECTED LOCKER SITE
module.exports.getLockerCompartment = async (req, res) => {
    const { selectedLockerSiteId, selectedSize } = req.body;
    const allocatedCompartment = await getAvailableCompartment(selectedLockerSiteId, selectedSize);
    console.log(allocatedCompartment)
    if (allocatedCompartment) {
        res.status(200).json({ allocatedCompartment });
    } else {
        res.status(404).json({});
    }
}

// CREATE A NEW ORDER
module.exports.createOrder = async (req, res) => {
    try {
        const orderData = req.body;
        const newOrderNumber = generateOrderNumber();
        const order = await createOrderObject(orderData, newOrderNumber);
        const newOrder = new Order(order);
        res.status(200).json({ newOrder });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).send('Internal Server Error');
    }
}

// GENERATE ORDER NUMBER
const generateOrderNumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    const orderNumber = `${timestamp}${random}`;
    return orderNumber;
};

// CREATE ORDER OBJECT FROM FORM DATA
const createOrderObject = async (orderData, orderNumber) => {
    const { serviceId, lockerSiteId, compartmentId, compartmentNumber } = orderData;
    const orderItems = [];
    for (const orderItem of orderData.orderItems) {
        if (orderItem.quantity == 0) continue;
        const item = await findItemById(orderData.serviceId, orderItem.itemId);
        const orderItemDetails = {
            name: item.name,
            unit: item.unit,
            price: item.price,
            quantity: parseInt(orderItem.quantity, 10),
            cumPrice: item.price * orderItem.quantity,
        };
        orderItems.push(orderItemDetails);
    }
    const newOrder = {
        orderNumber,
        locker: {
            lockerSiteId,
            compartmentId,
            compartmentNumber,
        },
        service: serviceId,
        orderItems,
    };
    return newOrder;
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
        const order = req.body;
        const existingOrder = await Order.findOne({ orderNumber: order.orderNumber });
        if (existingOrder) {
            return res.status(500).json({ message: 'Order with same order number exists.' });
        }
        const newOrder = new Order(order);
        await newOrder.save();
        res.status(200).json({ message: 'Order saved successfully' });
    } catch (error) {
        console.error('Error confirming order:', error);
        res.status(500).send('Internal Server Error');
    }
}

// CANCEL ORDER
module.exports.cancelOrderCreation = async (req, res) => {
    const { lockerSiteId, compartmentId } = req.body;
    const locker = await Locker.findById(lockerSiteId).exec();
    let compartment = locker.compartments.find(compartment => compartment._id.toString() === compartmentId);
    if (!compartment) throw new Error('Compartment not found.');
    compartment.isAvailable = true;
    await locker.save();
    res.status(200).json({ message: 'Order Cancelled' });
}
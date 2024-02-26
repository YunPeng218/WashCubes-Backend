
const Job = require('../models/job');
const Order = require('../models/order');
const Locker = require('../models/locker');
const { getAvailableCompartment } = require('../controllers/lockerController');

module.exports.createLockerToLaundrySiteJob = async (orderIds, jobType, lockerSite, rider) => {
    const jobNumber = generateJobNumber();
    const job = new Job();

    job.lockerSite = lockerSite;
    job.rider = rider;
    job.jobNumber = jobNumber;
    job.jobType = jobType;

    for (let id of orderIds) {
        const order = await Order.findById(id);
        if (!order) throw new Error('Order Not Found');
        order.selectedByRider = true;
        await order.save();
        job.orders.push(order);
    }
    console.log(job);
    await job.save();
    return job.jobNumber;
};

module.exports.createLaundrySiteToLockerJob = async (orderIds, lockerSite, rider) => {
    const jobNumber = generateJobNumber();
    const job = new Job();

    job.lockerSite = lockerSite;
    job.rider = rider;
    job.jobNumber = jobNumber;
    job.jobType = 'Laundry Site to Locker';

    for (let id of orderIds) {
        const order = await Order.findById(id);
        if (!order) throw new Error('Order Not Found');
        order.selectedByRider = true;

        // GET COMPARTMENT SIZE USED DURING USER DROP OFF
        const locker = await Locker.findById(order.locker.lockerSiteId);
        if (!locker) throw new Error('Locker Not Found');
        const compartment = locker.compartments.find(compartment => compartment._id.toString() === order.locker.compartmentId);
        if (!compartment) throw new Error('Compartment Not Found');

        // ALLOCATE A COMPARTMENT FOR THE ORDER
        const allocatedCompartment = await getAvailableCompartment(lockerSite, compartment.size);
        if (!allocatedCompartment) throw new Error('No suitable compartment found');

        order.collectionSite.compartmentId = allocatedCompartment._id;
        order.collectionSite.compartmentNumber = allocatedCompartment.compartmentNumber;
        order.collectionSite.compartmentSize = allocatedCompartment.compartmentSize;
        await order.save();
        job.orders.push(order);
    }
    console.log(job);
    await job.save();
    return job.jobNumber;
};

const generateJobNumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    const jobNumber = `J${timestamp}${random}`;
    return jobNumber;
};

module.exports.getRiderActiveJob = async (req, res) => {
    const { riderId } = req.query;
    const job = await Job.findOne({ 'rider': riderId, 'isJobActive': true });
    if (job) {
        const jobLocker = await Locker.findById(job.lockerSite);
        res.status(200).json({ job, jobLocker });
    }
}

module.exports.updateOrderStatus = async (req, res) => {
    try {
        const { jobNumber, nextOrderStage, barcodeID, receiverName, receiverIC } = req.body;
        const job = await Job.findOne({ 'jobNumber': jobNumber }).populate('orders');
        let barcodeIDArray;
        if (barcodeID != undefined) {
            barcodeIDArray = JSON.parse(barcodeID);
        }
        for (let i = 0; i < job.orders.length; i++) {
            const order = job.orders[i];
            if (order.orderStage[nextOrderStage]) {
                order.orderStage[nextOrderStage].status = true;
                order.orderStage[nextOrderStage].dateUpdated = new Date();
            }
            if (barcodeIDArray)
                order.barcodeID = barcodeIDArray[i];
        }
        if ((receiverName != undefined) && (receiverIC != undefined)) {
            job.receiverName = receiverName;
            job.receiverIC = receiverIC;
            job.isJobActive = false;

            for (const order of job.orders) {
                const foundOrder = await Order.findById(order._id);
                if (!foundOrder) throw new Error('Order Not Found');
                foundOrder.selectedByRider = false;
                await foundOrder.save();
            }
        }
        for (const order of job.orders) {
            await Order.findOneAndUpdate(
                { _id: order._id },
                {
                    $set: {
                        'orderStage': order.orderStage,
                        'barcodeID': order.barcodeID,
                    },
                }
            );

            // FREE UP COMPARTMENT USED BY ORDER
            const locker = await Locker.findById(order.locker.lockerSiteId);
            if (!locker) throw new Error('Locker Not Found');

            const compartment = locker.compartments.find(compartment => compartment._id.toString() === order.locker.compartmentId);
            if (!compartment) throw new Error('Compartment Not Found');
            compartment.isAvailable = true;
            await locker.save();
        }
        await job.save();
        res.status(200).json({ message: 'Order stages updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
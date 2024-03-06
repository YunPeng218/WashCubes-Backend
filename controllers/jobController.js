
const Job = require('../models/job');
const Order = require('../models/order');
const Locker = require('../models/locker');
const { getAvailableCompartment } = require('../controllers/lockerController');
const { sendNotification } = require('./notificationController');

module.exports.createLockerToLaundrySiteJob = async (orderIds, jobType, lockerSite, rider) => {
    const jobNumber = generateJobNumber();
    const job = new Job();

    job.lockerSite = lockerSite;
    job.rider = rider;
    job.jobNumber = jobNumber;
    job.jobType = jobType;
    job.createdAt = Date.now();

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
    let unavailableOrders = [];
    const jobNumber = generateJobNumber();
    const job = new Job();

    job.lockerSite = lockerSite;
    job.rider = rider;
    job.jobNumber = jobNumber;
    job.jobType = 'Laundry Site to Locker';
    job.createdAt = Date.now();

    for (let id of orderIds) {
        const order = await Order.findById(id);
        if (!order) throw new Error('Order Not Found');

        // GET COMPARTMENT SIZE USED DURING USER DROP OFF
        const locker = await Locker.findById(order.locker.lockerSiteId);
        if (!locker) throw new Error('Locker Not Found');
        const compartment = locker.compartments.find(compartment => compartment._id.toString() === order.locker.compartmentId);
        if (!compartment) throw new Error('Compartment Not Found');

        // ALLOCATE A COMPARTMENT FOR THE ORDER
        const allocatedCompartment = await getAvailableCompartment(lockerSite, compartment.size);
        if (!allocatedCompartment) {
            unavailableOrders.push(order.orderNumber);
        } else {
            order.selectedByRider = true;
            order.collectionSite.compartmentId = allocatedCompartment._id;
            order.collectionSite.compartmentNumber = allocatedCompartment.compartmentNumber;
            order.collectionSite.compartmentSize = allocatedCompartment.compartmentSize;
            await order.save();
            job.orders.push(order);
        }
    }
    if (job.orders.length === 0) return { jobNumber: 'Unavailable', unavailableOrders };
    console.log(job);
    await job.save();
    return { jobNumber: job.jobNumber, unavailableOrders };
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

module.exports.getRiderJobHistory = async (req, res) => {
    const { riderId } = req.query;
    const jobs = await Job.find({ 'rider': riderId });
    if (jobs.length > 0) {
        const jobsWithLockerDetails = [];
        for (const job of jobs) {
            const jobLocker = await Locker.findById(job.lockerSite);
            jobsWithLockerDetails.push({ job, jobLocker });
        }
        res.status(200).json({ jobs: jobsWithLockerDetails });
    } else {
        res.status(404).json({ message: 'No jobs found.' });
    }
}

module.exports.updateOrderStatus = async (req, res) => {
    try {
        const { jobNumber, nextOrderStage, barcodeID, receiverName, receiverIC, proofPicUrl } = req.body;
        const job = await Job.findOne({ 'jobNumber': jobNumber }).populate('orders');
        job.pickedUpStatus = true;

        let barcodeIDArray;
        let proofPicUrlArray;
        // Convert the barcodeID from string to array (will only be executed during locker pick up)
        if (barcodeID != undefined) {
            barcodeIDArray = JSON.parse(barcodeID);
        }
        // Convert the proofPicUrl from string to array (will only be executed during locker drop off)
        if (proofPicUrl != undefined) {
            proofPicUrlArray = JSON.parse(proofPicUrl);
        }
        for (let i = 0; i < job.orders.length; i++) {
            const order = job.orders[i];
            // Update the next order stage to true 
            if (order.orderStage[nextOrderStage]) {
                order.orderStage[nextOrderStage].status = true;
                order.orderStage[nextOrderStage].dateUpdated = new Date();
            }
            // Send push notification to users about their order status update
            const userId = (order.user.userId).toString();
            const orderNumber = (order.orderNumber).toString();
            req.body = {
                userId,
                orderStatus: nextOrderStage,
                orderId: orderNumber
            };
            sendNotification(req);
            // Push barcodeID into each order (will only be executed during locker pick up)
            if (barcodeIDArray)
                order.barcodeID = barcodeIDArray[i];
            // Push proofPicUrl into each order (will only be executed during locker drop off)
            if (proofPicUrlArray)
                order.proofPicUrl = proofPicUrlArray[i];
        }
        // Push receiver name and ic into each job (will only be executed during laundry site drop off)
        if ((receiverName != undefined) && (receiverIC != undefined)) {
            job.receiverName = receiverName;
            job.receiverIC = receiverIC;
            job.isJobActive = false;
            job.dropOffStatus = true;

            for (const order of job.orders) {
                const foundOrder = await Order.findById(order._id);
                if (!foundOrder) throw new Error('Order Not Found');
                foundOrder.selectedByRider = false;
                await foundOrder.save();
            }
        }
        // Push proofPicUrl into each job (will only be executed during locker drop off)
        if (proofPicUrlArray) {
            job.isJobActive = false;
            job.dropOffStatus = true;

            for (const order of job.orders) {
                const foundOrder = await Order.findById(order._id);
                if (!foundOrder) throw new Error('Order Not Found');
                foundOrder.selectedByRider = false;
                await foundOrder.save();
            }
        }
        // Save the changes in order collection
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
            if (proofPicUrlArray) {
                await Order.findOneAndUpdate(
                    { _id: order._id },
                    {
                        $set: {
                            'proofPicUrl': order.proofPicUrl,
                        },
                    }
                );
            }

            // FREE UP COMPARTMENT IF THE CURRENT ORDER HAS BEEN PICKED UP FROM LOCKER
            if (nextOrderStage == "collectedByRider") {
                const locker = await Locker.findById(order.locker.lockerSiteId);
                if (!locker) throw new Error('Locker Not Found');

                const compartment = locker.compartments.find(compartment => compartment._id.toString() === order.locker.compartmentId);
                if (!compartment) throw new Error('Compartment Not Found');
                compartment.isAvailable = true;
                await locker.save();
            }
        }
        await job.save();
        res.status(200).json({ message: 'Order stages updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
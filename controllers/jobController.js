
const Job = require('../models/job');
const Order = require('../models/order');
const Locker = require('../models/locker');

module.exports.createJob = async (orderIds, jobType, lockerSite, rider) => {
    const jobNumber = generateJobNumber();

    console.log(orderIds);
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
        const { jobNumber, nextOrderStage } = req.body;
        const job = await Job.findOne({ 'jobNumber': jobNumber }).populate('orders');
        // Update the status of next order stage to true
        for (const order of job.orders) {
            if (order.orderStage[nextOrderStage]) {
                order.orderStage[nextOrderStage].status = true;
                order.orderStage[nextOrderStage].dateUpdated = new Date();
            }
        }
        for (const order of job.orders) {
            await Order.findOneAndUpdate(
                { _id: order._id },
                {
                    $set: {
                        'orderStage': order.orderStage,
                    },
                }
            );
        }
        await job.save();
        res.status(200).json({ message: 'Order stages updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
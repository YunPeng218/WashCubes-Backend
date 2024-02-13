
const { response } = require('express');
const Locker = require('../models/locker');

// GET LOCKERS
module.exports.getLockers = async (req, res) => {
    const lockers = await Locker.find({});
    res.status(200).json({ lockers });
}

// GET DROP-OFF AND COLLECTION SITE
module.exports.getDropAndCollectionSite = async (req, res) => {
    console.log('GET DROP OFF AND COLLECTION SITE');
    const { dropOffSiteId, collectionSiteId } = req.query;
    console.log(dropOffSiteId);
    console.log(collectionSiteId);

    const dropOffLocker = await Locker.findById(dropOffSiteId);
    const collectionLocker = await Locker.findById(collectionSiteId);

    if (!dropOffLocker) throw new Error('Drop Off Locker site not found.');
    if (!collectionLocker) throw new Error('Collection Locker site not found.');

    res.status(200).json({
        dropOffLocker,
        collectionLocker,
    });
}

// ALLOCATE A COMPARTMENT
module.exports.getAvailableCompartment = async (selectedLockerSiteId, selectedSize) => {
    const locker = await Locker.findById(selectedLockerSiteId);
    if (!locker) throw new Error('Locker site not found.');

    let selectedCompartment = locker.compartments.find(compartment => compartment.size === selectedSize && compartment.isAvailable);
    if (selectedCompartment) {
        selectedCompartment.isAvailable = false;
        await locker.save();
    } else {
        const sizes = ['Medium', 'Large', 'Extra Large']; // Customize this array based on your size hierarchy
        for (const size of sizes) {
            selectedCompartment = locker.compartments.find(compartment => compartment.size === size && compartment.isAvailable);
            if (selectedCompartment) {
                if (sizes.indexOf(selectedCompartment.size) >= sizes.indexOf(selectedSize)) {
                    selectedCompartment.isAvailable = false;
                    await locker.save();
                    break;
                } else {
                    // The found compartment is smaller than the desired size, continue searching
                    selectedCompartment = null;
                }
            }
        }
    }

    console.log(selectedCompartment)
    return selectedCompartment;
}

// GET AVAILABLE COMPARTMENTS
module.exports.getAvailableCompartments = async (req, res) => {
    try {
        const lockerSiteId = req.query.lockerSiteId;
        const locker = await Locker.findById(lockerSiteId);
        if (!locker) return;

        // Group compartments by size and count available compartments for each size
        const availableCompartmentsBySize = locker.compartments.reduce((acc, compartment) => {
            if (compartment.isAvailable) {
                if (!acc[compartment.size]) {
                    acc[compartment.size] = 1;
                } else {
                    acc[compartment.size]++;
                }
            }
            return acc;
        }, {});


        const availableCompartments = {
            lockerId: locker._id,
            lockerName: locker.name,
            availableCompartmentsBySize,
        };

        console.log(availableCompartments);

        res.status(200).json({ availableCompartments });
    } catch (error) {
        console.error(error);
    }
};

// FREE UP COMPARTMENT
module.exports.freeCompartment = async (req, res) => {
    try {
        console.log('FREE LOCKERS');
        const { lockerSiteId, compartmentId } = req.body;
        const locker = await Locker.findById(lockerSiteId);
        if (!locker) throw new Error('Locker site not found.');

        console.log(compartmentId);
        const compartment = locker.compartments.find(compartment => compartment._id.toString() === compartmentId);
        console.log(compartment);
        if (!compartment) throw new Error('Compartment not found.');

        compartment.isAvailable = true;
        await locker.save();

        res.status(200).json({ message: 'Successfully freed up compartment' });
    } catch (error) {
        console.error(error);
        res.status(500);
    }
}

module.exports.handleLockerQRScan = async (req, res) => {
    try {
        const { lockerSiteId } = req.query;
        const locker = await Locker.findById(lockerSiteId);
        if (!locker) throw new Error('Locker site not found.');
        res.status(200).json({ locker });
    } catch (error) {
        console.error(error);
        res.status(500);
    }
}





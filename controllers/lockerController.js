
const Locker = require('../models/locker');

// GET LOCKERS
module.exports.getLockers = async (req, res) => {
    const lockers = await Locker.find({});
    res.status(200).json({ lockers });
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
module.exports.getAvailableCompartments = async (lockerSiteId) => {
    try {
        const locker = await Locker.findById(lockerSiteId);
        if (!locker) return;
        const compartments = locker.compartments.filter(compartment => compartment.isAvailable);
        const response = {
            lockerId: locker._id,
            lockerName: locker.name,
            compartments
        }
        return response;
    } catch (error) {
        console.error(error);
    }
}





const mongoose = require('mongoose');
require('dotenv').config();
const Locker = require('../models/locker');

// DATABASE CONNECTION
mongoose.connect(process.env.DB_CONNECT);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB Atlas connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB Atlas.');
});

// LOCKER SITES
const lockerSites = [
    {
        name: 'Taylor’s University',
        location: {
            type: 'Point',
            coordinates: [101.61687447279495, 3.064830532141036],
        },
        address: '1, Jln Taylors, 47500 Subang Jaya, Selangor',
    },
    {
        name: 'Sunway Geo Residences',
        location: {
            type: 'Point',
            coordinates: [101.60980581528996, 3.063661692311628],
        },
        address:
            'Persiaran Tasik Timur, Sunway South Quay, Bandar Sunway, 47500 Subang Jaya, Selangor',
    },
    {
        name: 'Tropicana City Office Tower',
        location: {
            type: 'Point',
            coordinates: [101.6381, 3.1339],
        },
        address: 'Ground Floor, Damansara Intan, 40150 Petaling Jaya, Selangor',
    },
    {
        name: 'Garden Plaza',
        location: {
            type: 'Point',
            coordinates: [101.6597, 2.9254],
        },
        address: 'Persiaran Harmoni, Cyber 3, 62000 Cyberjaya, Selangor',
    },
];

const compartments = [
    { compartmentNumber: 'L01', size: 'Small', isAvailable: true },
    { compartmentNumber: 'L02', size: 'Small', isAvailable: true },
    { compartmentNumber: 'L03', size: 'Small', isAvailable: true },
    { compartmentNumber: 'L04', size: 'Small', isAvailable: true },
    { compartmentNumber: 'L05', size: 'Small', isAvailable: true },
    { compartmentNumber: 'L06', size: 'Small', isAvailable: true },
    { compartmentNumber: 'L07', size: 'Small', isAvailable: true },
    { compartmentNumber: 'L08', size: 'Small', isAvailable: true },
    { compartmentNumber: 'L09', size: 'Small', isAvailable: true },
    { compartmentNumber: 'L10', size: 'Medium', isAvailable: true },
    { compartmentNumber: 'L11', size: 'Medium', isAvailable: true },
    { compartmentNumber: 'L12', size: 'Medium', isAvailable: true },
    { compartmentNumber: 'L13', size: 'Medium', isAvailable: true },
    { compartmentNumber: 'L14', size: 'Large', isAvailable: true },
    { compartmentNumber: 'L15', size: 'Large', isAvailable: true },
    { compartmentNumber: 'L16', size: 'Large', isAvailable: true },
    { compartmentNumber: 'L17', size: 'Extra Large', isAvailable: true },
    { compartmentNumber: 'L18', size: 'Extra Large', isAvailable: true },
    { compartmentNumber: 'L19', size: 'Extra Large', isAvailable: true },
];

const seedLockers = async () => {
    try {
        for (const locker of lockerSites) {
            const existingLocker = await Locker.findOne({ 'name': locker.name });
            if (existingLocker) {
                existingLocker.location = locker.location;
                existingLocker.address = locker.address;
                existingLocker.compartments = compartments;
                await existingLocker.save();
            } else {
                const lockerSite = new Locker(locker);
                lockerSite.compartments = compartments;
                await lockerSite.save();
            }
        }
    } catch (error) {
        console.error(error);
    } finally {
        mongoose.connection.close();
    }
}

seedLockers();


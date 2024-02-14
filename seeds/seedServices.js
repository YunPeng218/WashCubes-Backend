const mongoose = require('mongoose');
require('dotenv').config();
const Service = require('../models/service');

// DATABASE CONNECTION
mongoose.connect(process.env.DB_CONNECT);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB Atlas connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB Atlas.');
});

// SEED SERVICES FUNCTION
const seedServices = async () => {
    try {
        // DEFINE SERVICES AND ITEMS
        const services = [
            {
                // BASIC LAUNDRY
                name: 'Wash & Fold',
                items: [
                    { name: 'All Garments', unit: 'kg', price: 6 },
                    { name: 'Floor Mat', unit: 'kg', price: 8 },
                    { name: 'Curtain', unit: 'kg', price: 8 },
                    { name: 'Bedsheet', unit: 'kg', price: 6 },
                    { name: 'Quilt/Comforter', unit: 'kg', price: 6 },
                ]
            },
            {
                // DRY CLEANING
                name: 'Dry Cleaning',
                items: [
                    { name: 'Top', unit: 'pcs', price: 7 },
                    { name: 'Bottom', unit: 'pcs', price: 7 },
                    { name: 'Winter Jacket', unit: 'pcs', price: 25 },
                    { name: 'Baju Kurung', unit: 'set', price: 20 },
                    { name: 'Evening Gown', unit: 'pcs', price: 50 },
                    { name: 'Wedding Gown', unit: 'pcs', price: 150 },
                    { name: 'Dress', unit: 'pcs', price: 18 },
                    { name: 'Saree/Punjabi Dress', unit: 'set', price: 30 },
                    { name: 'Hijab/Scarf', unit: 'pcs', price: 6 },
                    { name: 'Cap/Hat/Glove', unit: 'pcs', price: 6 },
                    { name: 'Curtain', unit: 'kg', price: 18 },
                ],
            },
            {
                // HANDWASH
                name: 'Handwash',
                items: [
                    { name: 'Top', unit: 'pcs', price: 7 },
                    { name: 'Bottom', unit: 'pcs', price: 7 },
                    { name: 'Winter Jacket', unit: 'pcs', price: 25 },
                    { name: 'Baju Kurung', unit: 'set', price: 20 },
                    { name: 'Evening Gown', unit: 'pcs', price: 50 },
                    { name: 'Wedding Gown', unit: 'pcs', price: 150 },
                    { name: 'Dress', unit: 'pcs', price: 18 },
                    { name: 'Saree/Punjabi Dress', unit: 'set', price: 30 },
                    { name: 'Hijab/Scarf', unit: 'pcs', price: 6 },
                    { name: 'Cap/Hat/Glove', unit: 'pcs', price: 6 },
                    { name: 'Curtain', unit: 'kg', price: 18 },
                ],
            },
            {
                // LAUNDRY & IRONING
                name: 'Laundry & Iron',
                items: [
                    { name: 'Top', unit: 'pcs', price: 3 },
                    { name: 'Bottom', unit: 'pcs', price: 3 },
                    { name: 'Baju Kurung', unit: 'set', price: 6 },
                    { name: 'Curtain', unit: 'kg', price: 12 },
                    { name: 'Bedsheet', unit: 'pcs', price: 10 },
                    { name: 'Quilt/Comforter', unit: 'pcs', price: 18 },
                ]
            },
            {
                // IRONING ONLY
                name: 'Ironing',
                items: [
                    { name: 'Top', unit: 'pcs', price: 2 },
                    { name: 'Bottom', unit: 'pcs', price: 2 },
                    { name: 'Baju Kurung', unit: 'set', price: 4 },
                    { name: 'Bedsheet', unit: 'pcs', price: 6 },
                ]
            }
        ];

        // UPDATE SERVICE COLLECTION
        for (const service of services) {

            // Check if service already exists
            const existingService = await Service.findOne({ name: service.name });

            if (existingService) {
                // Update the existing service with new details
                existingService.items = service.items;
                await existingService.save();
                console.log(`Service '${service.name}' updated successfully.`);
            } else {
                // Insert new service into the database
                const newService = new Service(service);
                await newService.save();
                console.log(`Service '${service.name}' added successfully`);
            }
        }

        console.log('Service seeding complete.');

    } catch (error) {
        console.error(error);
    } finally {
        mongoose.connection.close();
    }
};

// RUN THE SEED SCRIPT
seedServices();

const lockerLocations = [
    {
        name: "Taylor’s University",
        latitude: 3.0698,
        longitude: 101.5986,
        isAvailable: true,
        address: "1, Jln Taylors, 47500 Subang Jaya, Selangor",
    },
    {
        name: "Sunway Geo Residences",
        latitude: 3.0731,
        longitude: 101.6077,
        isAvailable: false,
        address:
            "Persiaran Tasik Timur, Sunway South Quay, Bandar Sunway, 47500 Subang Jaya, Selangor",
    },
    {
        name: "Tropicana City Office Tower",
        latitude: 3.1339,
        longitude: 101.6381,
        isAvailable: true,
        address: "Ground Floor, Damansara Intan, 40150 Petaling Jaya, Selangor",
    },
    {
        name: "Garden Plaza",
        latitude: 2.9254,
        longitude: 101.6597,
        isAvailable: false,
        address: "Persiaran Harmoni, Cyber 3, 62000 Cyberjaya, Selangor",
    },
];
require('dotenv').config();
const mongoose = require('mongoose');
const EventRating = require('../src/events/eventRating.model');

async function migrate() {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log('Connected to DB');

        const collection = mongoose.connection.collection('eventratings');
        const indexes = await collection.indexes();

        console.log('Current indexes:', indexes.map(i => i.name));

        const oldIndexName = 'booking_1';
        if (indexes.find(i => i.name === oldIndexName)) {
            console.log(`Dropping old index: ${oldIndexName}`);
            await collection.dropIndex(oldIndexName);
            console.log('Old index dropped.');
        } else {
            console.log('Old index not found, skipping drop.');
        }

        // The new index will be created automatically by Mongoose when the app starts, 
        // or we can force it here:
        console.log('Creating new compound index...');
        await EventRating.syncIndexes();
        console.log('Indexes synced.');

        const newIndexes = await collection.indexes();
        console.log('New indexes:', newIndexes.map(i => i.name));

        console.log('Migration complete.');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await mongoose.disconnect();
    }
}

migrate();

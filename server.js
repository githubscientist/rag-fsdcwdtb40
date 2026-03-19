const app = require('./app');
const { PORT, MONGODB_URI } = require('./utils/config');
const mongoose = require('mongoose');

mongoose
    .connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
    });
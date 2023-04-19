// Import the 'mongoose' module.
const mongoose = require('mongoose');

// Get the 'DATABASE' environment variable.
const DB = process.env.DATABASE;

// Connect to the MongoDB database using the 'mongoose.connect()' method.
// The 'useNewUrlParser' and 'useUnifiedTopology' options are set to 'true' to avoid deprecation warnings.
mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connection is done'); // Log a success message to the console if the connection is successful.
    })
    .catch((err) => {
        console.log(err); // Log any errors to the console.
    });

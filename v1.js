const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000; // You can use any port you prefer

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Use middleware to parse JSON and urlencoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle POST requests to save reviews
app.post('/saveReview', (req, res) => {
    const review = req.body.review;

    // Append the review to the 'w.txt' file
    fs.appendFile(path.join(__dirname, 'w.txt'), review + '\n', (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            res.status(500).send('Error saving review');
        } else {
            console.log('Review saved:', review);
            res.status(200).send('Review saved successfully');
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const dotenv = require('dotenv');
dotenv.config(); // <-- Add this line at the very top

const express = require('express');
const dbConnect = require('./config/dbConnect');

dbConnect();

const app = express();

//middleware
app.use(express.json());

//routs 

//start server
const PORT = process.env.PORT || 7002;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
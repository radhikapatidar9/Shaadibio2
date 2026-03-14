
const mongoose = require('mongoose');
require('dotenv').config();

const dbConnect = () => {
    return mongoose.connect(process.env.DATABASE_URL, {})
    .then(() => console.log("DB connection established successfully!"))
    .catch((err) => console.log("Something went wrong while connecting to DB",err))
}
module.exports = dbConnect
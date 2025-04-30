const mongoose = require('mongoose');

const connectDB = async () => {
mongoose.connect(
    "mongodb+srv://sharmariya0163:cCs1vGvrqETO7ALi@namastenode.dn88piy.mongodb.net/DevTinder"
);
}

module.exports = connectDB;

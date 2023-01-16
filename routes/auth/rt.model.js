const mongoose = require('mongoose');

const rtSchema = mongoose.Schema({
    rt: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    token: {
        type: String,
        required: true,
        trim: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('RefreshToken', rtSchema);


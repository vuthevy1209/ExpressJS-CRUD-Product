const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const refreshTokenSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    refreshtoken: { type: String, required: true },
    expires: { type: Date, required: true },
}, { timestamps: true });

refreshTokenSchema.virtual('isExpired').get(function () {
    return Date.now() >= this.expires;
});

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
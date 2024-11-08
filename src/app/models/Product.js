const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

const Schema = mongoose.Schema;

mongoose.plugin(slug);

const Product = new Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    name: { type: String, required: true, maxLength: 255 },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, maxLength: 600 },
    slug: { type: String, slug: 'name', unique: true },
    brand: { type: String, maxLength: 255 },
    category: { type: String, maxLength: 255 },
    inventory_quantity: { type: Number, required: true },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Product', Product);
const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  assetName: {
    type: String,
    required: true
  },
  assetType: {
    type: String,
    required: true,
    enum: ['Laptop', 'Monitor', 'License', 'Peripheral', 'Other']
  },
  serialNumber: {
    type: String,
    required: true,
    unique: true
  },
  purchaseDate: {
    type: Date,
    required: true
  },
  purchasePrice: {
    type: Number
  },
  status: {
    type: String,
    enum: ['Available', 'In Use', 'Damaged', 'Maintenance', 'Retired'],
    default: 'Available'
  },
  condition: {
    type: String,
    enum: ['New', 'Good', 'Fair', 'Poor'],
    default: 'Good'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    default: null
  },
  warrantyDate: {
    type: Date
  },
  description: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Asset', assetSchema);
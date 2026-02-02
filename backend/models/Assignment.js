const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  asset: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset',
    required: true
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  assignDate: {
    type: Date,
    required: true
  },
  returnDate: {
    type: Date,
    default: null
  },
  expectedReturn: {
    type: Date,
    default: null
  },
  notes: {
    type: String
  },
  status: {
    type: String,
    enum: ['Active', 'Returned'],
    default: 'Active'
  }
});

module.exports = mongoose.model('Assignment', assignmentSchema);
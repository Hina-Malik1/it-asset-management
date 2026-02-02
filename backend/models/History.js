const mongoose = require('mongoose');

// This model saves a record every time something happens to an asset
// Like a diary for your entire system — create, assign, return, update, delete
const historySchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    // These are the only allowed action types
    enum: ['ASSET_CREATED', 'ASSET_ASSIGNED', 'ASSET_RETURNED', 'ASSET_UPDATED', 'ASSET_DELETED', 'STATUS_CHANGED']
  },
  asset: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset'                  // links to the Asset model
  },
  assetName: {
    type: String                  // we store the name separately so it still shows even if asset is deleted
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee'               // links to Employee if the action involved one
  },
  performedBy: {
    type: String,
    default: 'Admin'              // who did the action
  },
  details: {
    type: String                  // a short description of what happened
  },
  createdAt: {
    type: Date,
    default: Date.now             // automatically stamps the date+time when the record is created
  }
});

module.exports = mongoose.model('History', historySchema);
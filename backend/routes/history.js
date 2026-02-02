const express = require('express');
const router = express.Router();
const History = require('../models/History');

// ─── GET /api/history ─── Get all history records
// This is what the AssetHistoryPage fetches to show the audit trail
router.get('/', async (req, res) => {
  try {
    // Find all history records, sorted by newest first (createdAt: -1 means descending)
    // .populate() fills in the actual asset and employee names instead of just IDs
    const history = await History.find()
      .populate('asset', 'assetName assetType')
      .populate('employee', 'name department')
      .sort({ createdAt: -1 });

    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const Asset = require('../models/Asset');
const History = require('../models/History');

// Get all ACTIVE assets (not deleted)
// $ne: true catches both isDeleted: false AND assets that existed before this field was added
router.get('/', async (req, res) => {
  try {
    const assets = await Asset.find({ isDeleted: { $ne: true } }).populate('assignedTo');
    res.json(assets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ NEW — Get all DELETED (previous) assets
router.get('/deleted', async (req, res) => {
  try {
    const assets = await Asset.find({ isDeleted: true }).populate('assignedTo');
    res.json(assets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single asset
router.get('/:id', async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id).populate('assignedTo');
    res.json(asset);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create asset
router.post('/', async (req, res) => {
  const asset = new Asset(req.body);
  try {
    const newAsset = await asset.save();
    const historyEntry = new History({
      action: 'ASSET_CREATED',
      asset: newAsset._id,
      assetName: newAsset.assetName,
      performedBy: 'Admin',
      details: `New ${newAsset.assetType} added to inventory (Serial: ${newAsset.serialNumber})`
    });
    await historyEntry.save();
    res.status(201).json(newAsset);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ NEW — Restore a previously deleted asset
router.put('/restore/:id', async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) return res.status(404).json({ message: 'Asset not found' });

    await Asset.findByIdAndUpdate(req.params.id, {
      isDeleted: false,
      deletedAt: null
    });

    const historyEntry = new History({
      action: 'ASSET_CREATED',
      asset: asset._id,
      assetName: asset.assetName,
      performedBy: 'Admin',
      details: `${asset.assetType} restored back to active inventory (Serial: ${asset.serialNumber})`
    });
    await historyEntry.save();

    res.json({ message: 'Asset restored successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update asset
router.put('/:id', async (req, res) => {
  try {
    const updatedAsset = await Asset.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedAsset);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ UPDATED — Soft delete (marks as deleted, keeps in database)
router.delete('/:id', async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) return res.status(404).json({ message: 'Asset not found' });

    // Log to history first
    const historyEntry = new History({
      action: 'ASSET_DELETED',
      asset: asset._id,
      assetName: asset.assetName,
      performedBy: 'Admin',
      details: `${asset.assetType} removed from inventory (Serial: ${asset.serialNumber})`
    });
    await historyEntry.save();

    // Mark as deleted instead of removing from database
    await Asset.findByIdAndUpdate(req.params.id, {
      isDeleted: true,
      deletedAt: new Date()
    });

    res.json({ message: 'Asset archived successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const Asset = require('../models/Asset');
const History = require('../models/History');  // NEW — needed to log actions

// Get all assets
router.get('/', async (req, res) => {
  try {
    const assets = await Asset.find().populate('assignedTo');
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

// Create asset — NOW LOGS TO HISTORY
router.post('/', async (req, res) => {
  const asset = new Asset(req.body);
  try {
    const newAsset = await asset.save();

    // Log this creation to the History (audit trail)
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

// Update asset
router.put('/:id', async (req, res) => {
  try {
    const updatedAsset = await Asset.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedAsset);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete asset — NOW LOGS TO HISTORY
router.delete('/:id', async (req, res) => {
  try {
    // We need to find the asset FIRST so we can grab its name before deleting it
    const asset = await Asset.findById(req.params.id);
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    // Log this deletion to History BEFORE we delete it (so we still have the name)
    const historyEntry = new History({
      action: 'ASSET_DELETED',
      asset: asset._id,
      assetName: asset.assetName,
      performedBy: 'Admin',
      details: `${asset.assetType} removed from inventory (Serial: ${asset.serialNumber})`
    });
    await historyEntry.save();

    // Now actually delete the asset
    await Asset.findByIdAndDelete(req.params.id);
    res.json({ message: 'Asset deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
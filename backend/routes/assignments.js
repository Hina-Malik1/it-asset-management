const express = require('express');
const router = express.Router();
const Assignment = require('../models/Assignment');
const Asset = require('../models/Asset');
const Employee = require('../models/Employee');
const History = require('../models/History');

// ─── POST /api/assignments ─── Create a new assignment
// This runs when the frontend submits the Assign Asset form
router.post('/', async (req, res) => {
  try {
    const { asset, employee, assignDate, expectedReturn, notes } = req.body;

    // Step 1: Find the asset in the database to make sure it exists
    const assetDoc = await Asset.findById(asset);
    if (!assetDoc) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    // Step 2: Find the employee in the database to make sure they exist
    const employeeDoc = await Employee.findById(employee);
    if (!employeeDoc) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Step 3: Create the assignment record
    const assignment = new Assignment({
      asset: asset,
      employee: employee,
      assignDate: assignDate,
      expectedReturn: expectedReturn || null,
      notes: notes,
      status: 'Active'
    });
    await assignment.save();

    // Step 4: Update the asset's status to "In Use" and link it to the employee
    assetDoc.status = 'In Use';
    assetDoc.assignedTo = employee;
    await assetDoc.save();

    // Step 5: Log this action to the History (audit trail)
    const historyEntry = new History({
      action: 'ASSET_ASSIGNED',
      asset: asset,
      assetName: assetDoc.assetName,
      employee: employee,
      performedBy: 'Admin',
      details: `Assigned to ${employeeDoc.name} (${employeeDoc.department})`
    });
    await historyEntry.save();

    res.status(201).json({ message: 'Assignment created successfully', assignment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── GET /api/assignments ─── Get all assignments
router.get('/', async (req, res) => {
  try {
    // .populate() fills in the actual asset and employee data instead of just IDs
    const assignments = await Assignment.find()
      .populate('asset', 'assetName assetType serialNumber')
      .populate('employee', 'name department email');
    res.json(assignments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── PUT /api/assignments/return/:id ─── Return an asset
// This runs when someone marks an asset as returned
router.put('/return/:id', async (req, res) => {
  try {
    // Step 1: Find the assignment
    const assignment = await Assignment.findById(req.params.id)
      .populate('asset')
      .populate('employee');

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Step 2: Update the assignment record
    assignment.status = 'Returned';
    assignment.returnDate = new Date();
    await assignment.save();

    // Step 3: Set the asset back to "Available" and remove the employee link
    const asset = assignment.asset;
    asset.status = 'Available';
    asset.assignedTo = null;
    await asset.save();

    // Step 4: Log this return to the History
    const historyEntry = new History({
      action: 'ASSET_RETURNED',
      asset: asset._id,
      assetName: asset.assetName,
      employee: assignment.employee._id,
      performedBy: 'Admin',
      details: `Returned by ${assignment.employee.name}`
    });
    await historyEntry.save();

    res.json({ message: 'Asset returned successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
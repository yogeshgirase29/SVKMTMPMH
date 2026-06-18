const Stats = require('../models/Stats');
const { statsJoiSchema } = require('../validations/schemas');

// Get current hospital statistics (Public/Admin)
const getStats = async (req, res, next) => {
  try {
    let stats = await Stats.findOne({});
    if (!stats) {
      // Initialize with default values if empty
      stats = new Stats({
        beds: 150,
        doctors: 45,
        campusArea: '3 Acres',
        emergencyStatus: 'Active'
      });
      await stats.save();
    }
    return res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    next(error);
  }
};

// Update hospital statistics (Admin)
const updateStats = async (req, res, next) => {
  try {
    const { error } = statsJoiSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    const { beds, doctors, campusArea, emergencyStatus } = req.body;

    let stats = await Stats.findOne({});
    if (!stats) {
      stats = new Stats();
    }

    stats.beds = beds;
    stats.doctors = doctors;
    stats.campusArea = campusArea;
    stats.emergencyStatus = emergencyStatus;

    await stats.save();

    return res.status(200).json({
      success: true,
      message: 'Statistics updated successfully',
      stats
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats,
  updateStats
};

const mongoose = require('mongoose');

// schema of log table
const logSchema = new mongoose.Schema({
  data_hora: { type: Date, default: Date.now },
  car_id: { type: String, required: true },
});

// model for logs table
const Log = mongoose.model('Log', logSchema);

module.exports = Log;

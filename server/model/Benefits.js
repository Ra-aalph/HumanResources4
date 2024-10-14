
const mongoose = require('mongoose');

const BenefitsSchema = new mongoose.Schema({
  employeeName: { type: String, required: true },
  employeePosition: { type: String, required: true },
  sss: { type: Boolean, default: false },
  pagIbig: { type: Boolean, default: false },
  philHealth: { type: Boolean, default: false },
  retirement: { type: Boolean, default: false },
  thirteenthMonth: { type: Boolean, default: false },
});

const Benefits = mongoose.model('Benefits', BenefitsSchema);
module.exports = Benefits;

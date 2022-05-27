const mongoose = require('mongoose')
const counterSchema = mongoose.Schema({
  _id: String,
  sequence_val: Number
})

module.exports = mongoose.model('counter', counterSchema, 'counters')
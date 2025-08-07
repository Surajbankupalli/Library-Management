const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  cover: {
    type: String,
    required: true,
    trim: true
  },
  count: {
    type: Number,
    required: true,
    default: 0
  },
  status: {
    type: String,
    enum: ['available', 'not available'],
    default: 'not available'
  },
  createdAt: { type: Date, default: Date.now }
});

bookSchema.pre('save', function(next) {
  this.status = this.count > 0 ? 'available' : 'not available';
  next();
});

bookSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update.$set && update.$set.count !== undefined) {
    update.$set.status = update.$set.count > 0 ? 'available' : 'not available';
  }
  next();
});

module.exports = mongoose.model('Book', bookSchema);

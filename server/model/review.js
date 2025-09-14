const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: String, default: "Anonymous" },
  movieId: { type: String, required: true }, // <-- change from ObjectId to String
  text: { type: String, required: true },
  rating: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);


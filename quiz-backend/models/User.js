const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    correctAnswer: { type: Number, default: 0 }, // ✅ Ensuring it's a Number
    hasTakenQuiz: { type: Boolean, default: false } // ✅ Track if they have taken any quiz
});

module.exports = mongoose.model("User", userSchema);

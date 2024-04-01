
const mongoose = require('mongoose');
const User=require('../models/dburl')

const quizScoreSchema = new mongoose.Schema({
    id: { type: String, required: true, ref:'User' },
    date: { type: Date, required: true, default: Date.now }, // Date of the test attempt
    score: { type: Number, required: true },
});

const QuizScore = mongoose.model('QuizScore', quizScoreSchema);

module.exports = QuizScore;

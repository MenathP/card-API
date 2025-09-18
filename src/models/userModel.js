const mongoose = require('mongoose');
const { use } = require('react');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, enum: ['s_admin', 'admin', 'user']},
});
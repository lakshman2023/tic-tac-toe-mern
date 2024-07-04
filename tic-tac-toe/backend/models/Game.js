const mongoose = require('mongoose');
const { type } = require('os');

const GameSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
    },
    match : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Match',
        required : true
    },
    board : {
        type : [[String]],
        required : true
    },
    currentPlayer : {
        type : String,
        default : 'X'
    },
    winner : {
        type : String,
        default : null
    }
});

module.exports = mongoose.model('Game', GameSchema);
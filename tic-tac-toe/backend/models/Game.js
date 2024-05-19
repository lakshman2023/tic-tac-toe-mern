const mongoose = require('mongoose');
const { type } = require('os');

const GameSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
    },
    board : {
        type : [[String]],
        default : [['','',''],['','',''],['','','']]
    },
    currentPlayer : {
        type : String,
        default : 'O'
    },
    winner : {
        type : String,
        default : ''
    }
});

module.exports = mongoose.model('Game', GameSchema);
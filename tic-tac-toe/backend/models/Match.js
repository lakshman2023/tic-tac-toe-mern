const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema({
    player1 : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    player2 : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    games : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'Game'
        }
    ],
    scorePlayer1 : {
        type : Number,
        default : 0
    },
    scorePlayer2 :{
        type: Number,
        default : 0
    },
    totalGames:{
        type: Number,
        required: true
    },
    boardSize :{
        type: Number,
        required: true,
        default: 3
    },
    winningLength :{
        type: Number,
        required: true,
        default: 3
    }
});

module.exports = mongoose.model('Match', MatchSchema);
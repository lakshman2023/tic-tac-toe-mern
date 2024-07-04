const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username :{
        type : String,
        required : true,
        unique : true
    },
    email : {
        type: String,
        unique: true
    },
    password : {
        type : String,
        required : true
    },
    gamesWon : {
        type : Number,
        default : 0
    },
    gamesLost : {
        type : Number,
        default : 0
    },
    gamesDrawn : {
        type : Number,
        default : 0
    },
    rating : {
        type : Number,
        default : 1000
    }
});

UserSchema.methods.updateRating = function(opponentRating, score){
    const kFactor = 32;
    const expectedScore = 1/ (1 + Math.pow(10, (opponentRating - this.rating)/400));
    this.rating += kFactor * (score - expectedScore);
};

module.exports = mongoose.model("User", UserSchema);
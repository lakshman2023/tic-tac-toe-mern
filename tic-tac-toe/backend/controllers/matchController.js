const Match = require("../models/Match");
const User = require('../models/User');
const Game = require('../models/Game');

const createMatch = async (req, res) => {
    try {
        const {opponentUsername, totalGames, boardSize, winningLength} = req.body;
        console.log('Request Body:', req.body); // Log request body
        console.log('User Info:', req.user);

        const user1 = await User.findById(req.user.id).exec();
        const user2 = await User.findOne({ username: opponentUsername }).exec();

        if (!user1) {
            return res.status(404).json({ msg: `User not found.` });
        }
        if (!user2) {
            return res.status(404).json({ msg: `User ${opponentUsername} not found.` });
        }

        const newMatch = new Match({
            player1 : user1,
            player2 : user2,
            games : [],
            scorePlayer1 : 0,
            scorePlayer2 : 0,
            totalGames,
            boardSize,
            winningLength
        });
        await newMatch.save();

        const newGame = new Game({
            match : newMatch._id,
            board : Array(boardSize).fill(Array(boardSize).fill(null)),
            currentPlayer: 'X',
            winner: null
        });
        await newGame.save();

        newMatch.games.push(newGame._id);
        await newMatch.save();

        res.status(201).send(newMatch);
    } catch (error) {
        res.status(500).send({error : `Server error : ${error}`});
    }
};

const getMatchDetails = async (req, res) => {
    try {
        const match = await Match.findById(req.params.matchId).populate('games').populate('player1').populate('player2');
        if(!match){
            return res.status(404).send({error : "Match not found"});
        }
        res.send(match);
    } catch (error) {
        res.status(500).send({error : `Server error : ${error}`});
    }
};

const updateMatchScore = async (req, res) => {
    try {
        const {winner} = req.body;
        const match = await Match.findById(req.params.matchId).populate('games').populate('player1').populate('player2');
        if(!match){
            return res.status(404).send({error : 'Match not found'});
        }

        //update score based on winner
        if(winner){
            if(winner === 'X'){
                await match.player1.updateRating(match.player2.rating, 1);
                await match.player2.updateRating(match.player1.rating, 0);
                match.scorePlayer1 += 1;
            } else if(winner === 'O'){
                await match.player1.updateRating(match.player2.rating, 0);
                await match.player2.updateRating(match.player1.rating, 1);
                match.scorePlayer2 += 1;
            } else {
                await match.player1.updateRating(match.player2.rating, 0.5);
                await match.player2.updateRating(match.player1.rating, 0.5);
                match.scorePlayer1 += 0.5;
                match.scorePlayer2 += 0.5;
            }

            

            //create next game if total games are not completed
            if(match.games.length < match.totalGames){
                const newGame = new Game({
                    match : match._id,
                    board: Array(match.boardSize).fill(Array(match.boardSize).fill(null)),
                    currentPlayer:'X',
                    winner:null
                });

                await newGame.save();
                match.games.push(newGame._id);
            }
        } 
        
        await match.save();

        res.send(match);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({error : `Server error : ${error}`});
    }
};

const getAllMatchesOfUser = async (req, res) => {
    try {
        const matches = await Match.find({
            $or: [{player1 : req.params.userId}, {player2 : req.params.userId}]
        }).populate('games').populate('player1').populate('player2');

        res.send(matches);
    } catch (error) {
        res.status(500).send({error : `Server error : ${error}`});
    }
};

const getGlobalScoreBoard = async (req, res) => {
    try {
        const users = await User.find().sort({rating : -1}).limit(10);
        const usersData = users.map(user => {
            return { username: user.username,
            rating: user.rating,
            score: user.gamesWon + (user.gamesDrawn * 0.5)};
        });
        res.send(usersData);       
    } catch (error) {
        res.status(500).send({error : `Server error : ${error}`});
    }
};

const getOneOnOneScoreBoard = async (req, res) => {
    try {
        const {userId1, userId2} = req.body;
        const matches = await Match.find({
            $or: [{player1: userId1, player2:userId2}, {player1: userId2, player2:userId1}]
        });

        const oneOnOneScore = matches.reduce((acc, match) => {
            if(!acc[userId1]){
                acc[userId1] = 0;
            }
            if(!acc[userId2]){
                acc[userId2] = 0;
            }

            if(match.scorePlayer1 > match.scorePlayer2){
                if(match.player1.toString() === userId1){
                    acc[userId1] += 1;
                } else {
                    acc[userId2] += 1;
                }
            } else if(match.scorePlayer1 < match.scorePlayer2){
                if(match.player2.toString() === userId2){
                    acc[userId2] += 1;
                } else {
                    acc[userId1] += 1;
                }
            } else {
                acc[userId1] += 0.5;
                acc[userId2] += 0.5;
            }
            return acc;
        }, {});
        res.send(oneOnOneScore);
    } catch (error) {
        res.status(500).send({error : `Server error : ${error}`});
    }
};

module.exports = {createMatch, getMatchDetails, updateMatchScore, getAllMatchesOfUser, getGlobalScoreBoard, getOneOnOneScoreBoard};
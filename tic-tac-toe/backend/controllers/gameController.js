const Game = require('../models/Game');
const Match = require('../models/Match');

const createGame = async (req, res) => {
    try{
        const newGame = new Game();
        const game = await newGame.save();
        res.json(game);
    } catch(e) {
        res.status(500).send(`Server error ${e} occurred while creating the game`);
    }
};

const getGameDetails = async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        res.json(game);
    } catch (error) {
        res.status(500).send(`Server error ${error} occurred while retrieving the game ${req.params.id}`);
    }
};

const updateGame = async (req, res) => {
    try {
        const gameId = req.params.id;
        const { board, currentPlayer, winner } = req.body;
        const game = await Game.findById(gameId);
        if(!game){
            return res.status(404).json({ msg: 'Game not found' });
        }

        const match = await Match.findById(game.match);
        if(!match){
            return res.status(404).json({ msg: 'Match not found' });
        }
        const previousPlayerId = req.user.id;
        const isPlayerTurn = (currentPlayer === 'X' && previousPlayerId === match.player2.toString()) ||
                            (currentPlayer === 'O' && previousPlayerId === match.player1.toString());//
        if(!isPlayerTurn){
            return res.status(403).json({ msg: 'Not your turn' });
        }

        game.board = board;
        game.currentPlayer = currentPlayer;
        game.winner = winner;

        await game.save();

        res.json(game);
    } catch (error) {
        console.error(error.message);
        res.status(500).send(`Server error ${error} occurred while updating the game ${req.params.id}`);
    }
};

module.exports = {createGame, getGameDetails, updateGame};


const router = require('express').Router();
const Game = require('../models/Game');

//express router to create new game 
router.post('/', async (req, res) => {
    try{
        const newGame = new Game();
        const game = await newGame.save();
        res.json(game);
    } catch(e) {
        res.status(500).send(`Server error ${e} occurred while creating the game`);
    }
});

//express router to retrieve game by id
router.get('/:id', async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        res.json(game);
    } catch (error) {
        res.status(500).send(`Server error ${error} occurred while retrieving the game ${req.params.id}`);
    }
});

//express router to update game by id
router.put('/:id', async (req, res) => {
    try {
        const { board, currentPlayer, winner } = req.body;
        const game = await Game.findByIdAndUpdate(
            req.params.id,
            { board, currentPlayer, winner },
            { new: true }
          );
        res.json(game);
    } catch (error) {
        res.status(500).send(`Server error ${error} occurred while updating the game ${req.params.id}`);
    }
});

module.exports = router;

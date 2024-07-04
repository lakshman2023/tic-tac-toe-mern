const router = require('express').Router();
const Game = require('../models/Game');
const {createGame, getGameDetails, updateGame} = require('../controllers/gameController');
const verifyJWT = require('../middleware/verifyJWT');

//express router to create new game 
router.post('/', verifyJWT, createGame);

//express router to retrieve game by id
router.get('/:id', verifyJWT, getGameDetails);

//express router to update game by id
router.put('/:id', verifyJWT, updateGame);

module.exports = router;

const router = require('express').Router();
const {createMatch, getMatchDetails, updateMatchScore, getAllMatchesOfUser, getGlobalScoreBoard, getOneOnOneScoreBoard} = require('../controllers/matchController');
const verifyJWT = require('../middleware/verifyJWT');

router.post('/create', verifyJWT, createMatch);

router.get('/:matchId', verifyJWT, getMatchDetails);

router.put('/:matchId/update-score', verifyJWT, updateMatchScore);

router.get('/users/:userId', verifyJWT, getAllMatchesOfUser);

router.get('/scoreboard/global', verifyJWT, getGlobalScoreBoard);

router.get('/scoreboard/one-on-one/:userId1/:userId2', verifyJWT, getOneOnOneScoreBoard);

module.exports = router;

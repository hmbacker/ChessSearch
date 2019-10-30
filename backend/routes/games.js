const express = require('express');

const router = express.Router();

// Require controller modules
const games_controller = require('../controllers/gameController');

// GAME ROUTES //

// enable cross-origin resource sharing (CORS)
router.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});


// GET request for list of all games 
router.get('/', games_controller.games_list)

// GET request for one game
router.get('/:id', games_controller.game)

// GET request for comments to one game
// comments order by time created in ascending order
router.get('/:id/comments', games_controller.game_comments)

// POST request for creating comment to one game
router.post('/:id/create', games_controller.create_game_comment)






module.exports = router;


const express = require('express');
const tournament_Route = express();
const auth = require("../middleware/auth");

const tournament_Controller = require('../controllers/tournamentControllers');

tournament_Route.use(express.json());
tournament_Route.use(express.urlencoded({ extended: true }));


tournament_Route.post('/create-tournament', auth, tournament_Controller.createTournament);

tournament_Route.post('/create-room', auth, tournament_Controller.createRoom);

tournament_Route.post('/add-player',auth,  tournament_Controller.addPlayers);

tournament_Route.post ('/find-winner',tournament_Controller.findGameWinner);

module.exports = tournament_Route;
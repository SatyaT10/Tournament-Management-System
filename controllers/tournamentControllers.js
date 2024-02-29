const Tournament = require('../model/tournamentModel');
const User = require('../model/userModel');
var moment = require('moment'); 
console.log(moment().valueOf());

const createTournament = async (req, res) => {
    try {
        const token = req.body.token || req.query.token || req.headers['authorization'];
        const userData = await User.findOne({ token: token });
        if (userData) {
            const user_id = userData._id;
            await Tournament.create({
                creater_id: user_id,
            });
            res.status(200).send({ success: true, msg: "Tournament Created" });
        } else {
            res.status(400).send({ success: false, msg: "User Does not exists!" });
        }

    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

const createRoom = async (req, res) => {
    try {
        const token = req.body.token || req.query.token || req.headers['authorization'];
        const reqBody = req.body;
        const { Tournament_id } = reqBody;
        const tournamentData = await Tournament.findOne({ creater_id: Tournament_id });
        console.log(tournamentData.room[0]);
        if (tournamentData) {
            const room_id = moment().valueOf();
            await Tournament.findOneAndUpdate({ creater_id: Tournament_id }, {
                $push: {
                    room: {
                        room_id: room_id
                    }
                }
            });
            await User.findOneAndUpdate(
                {
                    token: token
                },
                {
                    $push:
                    {
                        room_id: room_id
                    }
                });
            res.status(200).send({ success: true, msg: "Room Created Successfully!" });
        } else {
            res.status(400).send({ success: false, msg: "Tournament_id doesn't exists!" });
        }
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });

    }
}

const addPlayers = async (req, res) => {
    try {
        const reqBody = req.body;
        const { Tournament_id, Room_id, name, score } = reqBody;
        const tournamentData = await Tournament.findOne({ creater_id: Tournament_id });
        console.log(tournamentData);
        if (tournamentData) {
            tournamentData.room.forEach(async (element) => {
                if (element.room_id == Room_id) {
                    // console.log("Roomaid", element)
                    const findRoom = await Tournament.findOneAndUpdate(
                        {
                            "room.room_id": Room_id
                        },
                        {
                            $push: {
                                "room.$.players": {
                                    name: name,
                                    score: score
                                }
                            }
                        },
                        {
                            new: true
                        }
                    )
                    console.log("Satya", findRoom);
                    res.status(200).send({ success: true, msg: "Player Add Successfully!" });

                } else {
                    res.status(400).send({ success: false, msg: "RoomData Not Found!" });
                }
            });
        } else {
            res.status(400).send({ success: false, msg: "tournamentData Not" });
        }
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

const findGameWinner = async (req, res) => {
    try {
        const reqBody = req.body;
        const { Tournament_id } = reqBody;
        var highestScore = 0;
        var { id, name } = ''
        const tournamentData = await Tournament.findOne({ creater_id: Tournament_id })
        if (tournamentData) {
            tournamentData.room.forEach(async (element) => {
                element.players.forEach(async (element) => {
                    const score = element.score;
                    if (highestScore <= score) {
                        highestScore = score;
                        id = element._id;
                        name = element.name
                    }
                })
            });
            const winnerData = await Tournament.findOneAndUpdate({ creater_id: Tournament_id }, { $set: { winner_id: id } });
            console.log(id);
            const response = {
                success: true,
                msg: "Winner is:",
                Data: name,
            }
            res.status(200).send(response);
        } else {
            res.status(400).send({ success: false, msg: "Tournament Doesn't Found!" });
        }
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
}

module.exports = {
    createTournament,
    createRoom,
    addPlayers,
    findGameWinner
}
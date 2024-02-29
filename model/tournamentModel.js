const mongoose = require('mongoose');
const tournamentSchema = mongoose.Schema({
    creater_id: {
        type: String,
        required: true
    },
    winner_id: {
        type: String,
        default: ''
    },
    room: [{
        room_id: {
            type: String,
            required: true
        },
        players: [{
            name: {
                type: String,
                required: true
            },
            score: {
                type: Number,
                default: 0
            }
        }]
    }]
});


module.exports = mongoose.model('Tournament', tournamentSchema);
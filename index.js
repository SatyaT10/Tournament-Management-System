const mongoose = require('mongoose');
const cors=require('cors');


mongoose.connect('mongodb+srv://satyaprakashroy280:PxDkqYcFKPf6MaNM@game.01l44wn.mongodb.net/');

const express = require('express');
const app = express();
const http = require('http').Server(app);
app.use(cors());
const tournament_Route = require('./routes/tournamentRoutes');
const user_Routes = require('./routes/userRoute');

app.use('/api', user_Routes);

app.use('/api', tournament_Route);


http.listen(3000, () => console.log("Server is Runing On Port 3000."))
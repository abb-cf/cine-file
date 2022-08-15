const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movies;
const Users = Models.Users;

mongoose.connect('mongodb://localhost:27017/cinefiledb', { useNewUrlParser: true, useUnifiedTopology: true });

const express = require("express"),
    bodyParser = require('body-parser'),
    uuid = require('uuid'),
    morgan = require('morgan');

const app = express();

app.use(bodyParser.json());

app.use(morgan('common'));

app.get('/', (req, res) => {
    res.send('Welcome to Cine-File!');
  });

//returns a list of all movies to the user
app.get('/movies', (req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
  });

// Gets the data about a single movie, by title  
app.get('/movies/:title', (req, res) => {
    Movies.findOne({ Title: req.params.Title })
        .then((movie) => {
            res.json(movie);
        })
        .catch((err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Gets the data about a single genre 
app.get('/movies/genre', (req, res) => {
    res.send('Successful GET request for data on a specific genre.');
    // res.json(movies.find((genre) =>
    // { return movie.genre === req.params.genre }));
});

// Gets the data about a single director, by name  
app.get('/movies/director', (req, res) => {
    res.send('Successful GET request for data on a specific director.');
    // res.json(movies.find((director) =>
    // { return movie.director === req.params.director }));
});
  
// Adds data for a new user
app.post('/users', (req, res) => {
    // let newUser = req.body;

    res.send('Successful POST of new user.');

    // if (!newUser.name) {
    //     const message = 'Missing name in request body';
    //     res.status(400).send(message);
    // } else {
    //     newUser.id = uuid.v4();
    //     users.push(newUser);
    //     res.status(201).send(newUser);
    // }
});

 // Update the username of a user
 app.put('/users/username', (req, res) => {

    res.send('Successful PUT, changing user usernmae information.');

    // let username = users.find((user) => { return user.username === req.params.username });
    // let newUsername = req.body;

    // if (user) {
    //   user.username[req.params.username] = parseInt(req.params.username);
    //   res.status(201).send('User ' + req.params.username + ' was updated to' + req.params.newUsername);
    // } else {
    //   res.status(404).send('User ' + req.params.username + ' was not found.');
    // }
  });

// Adds movie to a user's list of favorites
app.post('/users/favorites', (req, res) => {
    
    res.send('Successful POST of new favorite movie to user list of favorites.');
    
    // let favorite = req.body;

    // if (!favorite.title) {
    //     const message = 'Missing title in request body';
    //     res.status(400).send(message);
    // } else {
    //     users.push(favorite);
    //     res.status(201).send(favorite);
    // }
});

// Deletes a movie from a user's list of favorites
app.delete('users/favorites', (req, res) => {
    
    res.send('Successful DELETE of movie from use list of favorites.');
    
    // let favorite = favorites.find((title) => { return favorites/title === req.params.title });

    // if (title) {
    //     title = favorites.title((obj) => { return obj.favorite !== req.params.title});
    //     res.status(201).send('Movie' + req.params.title + ' was removed from favorites.');
    // }
});

// Deletes a user from the app by username
app.delete('/users/username', (req, res) => {
   
    res.send('Successful DELETE of user.');
   
    // let username = users.find((user) => { return user.username === req.params.username });
  
    // if (user) {
    //   user = users.filter((obj) => { return obj.username !== req.params.username });
    //   res.status(201).send('User ' + req.params.username + ' was deleted.');
    // }
  });

app.use(express.static('public'));

app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', {root: __dirname});
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
  });
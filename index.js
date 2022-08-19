const express = require('express'),
    bodyParser = require('body-parser'),
    uuid = require('uuid'),
    morgan = require('morgan');

const app = express();

const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movies;
const Users = Models.Users;

mongoose.connect('mongodb://localhost:27017/cinefiledb', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
let auth = require('./auth.js') (app);

const passport = require('passport');
require('./passport.js');


app.use(morgan('common'));

app.get('/', (req, res) => {
    res.send('Welcome to Cine-File!');
  });

//returns a list of all movies to the user
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
  });

  //returns a list of all users
  app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
  })

// Gets the data about a single movie, by title  
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ Title: req.params.Title })
        .then((movie) => {
            res.json(movie);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Gets the data about a single genre 
app.get('/genres/:Genre', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ 'Genre.Name': req.params.Genre})
        .then((movie) => {
            res.status(201).json(movie.Genre);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Gets the data about a single director, by name  
app.get('/directors/:Director', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ 'Director:Name': req.params.Director})
        .then((movie) => {
            res.status(201).json(movie.Director);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});
  
// Adds data for a new user
/* We'll expect JSON  in this format:
{
    ID: Integer,
    Username: String,
    (required)
    Password: String,
    (required) 
    Email: String,
    (required)
    Birthday, Date
}*/
app.post('/users', (req, res) => {
    Users.findOne({ Username: req.body.Username})
    .then((user) => {
        if (user) {
            return res.status(400).send(req.body.Username + ' already exists');
        }
        else {
            Users
                .create({
                    Username: req.body.Username,
                    Password: req.body.Password,
                    Email: req.body.Email,
                    Birthday: req.body.Birthday
                })
                .then((user) => {res.status(201).json(user) })
                .catch((error) => {
                    console.error(error);
                    res.status(500).send('Error: ' + error);
                })
        }
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
    });
});

 // Update the username of a user
 /* We'll expect JSON in this format: 
 {
    Username: String,
    (required)
    Password: String,
    (required)
    Email: String,
    (required)
    Birthday: Date
 } */
 app.put('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, 
    { $set:
        {   
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
        }
    },
    { new: true }, //This line makes sure that the updated document is returned
    (err, updatedUser) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.json(updatedUser);
        }
    });
  });

// Adds movie to a user's list of favorites
app.post('/users/:Username/Favorites/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate(
        { Username: req.params.Username }, 
        { $addToSet: { Favorites: req.params.MovieID } },
        { new: true }, //This line makes sure that the updated info is returned.
        (err, updatedUser) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.json(updatedUser);
        }
    });
});

// Deletes a movie from a user's list of favorites
app.delete('/users/:Username/Favorites/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate(
        { Username: req.params.Username }, 
        { $pull: { Favorites: req.params.MovieID } },
        { new: true }, 
        (err, updatedUser) => {
           if (err) {
                console.error(err);
                res.status(500).send('Error: ' + err);
                } else {
                res.json(updatedUser);
            }
    });
});

// Deletes a user from the app by username
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
   Users.findOneAndRemove({ Username: req.params.Username })
   .then((user) => {
    if (!user) {
        res.status(400).send(req.params.Username + ' was not found.');
    } else {
        res.status(200).send(req.params.Username + ' was deleted.');
    }
   })
   .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
   });
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
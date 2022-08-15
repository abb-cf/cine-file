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
app.get('/movies/:genre', (req, res) => {
    Movies.findOne({ Genre.Name: req.params.Genre})
        .then((genre) => {
            res.json(genre);
        })
        .catch((err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Gets the data about a single director, by name  
app.get('/movies/:director', (req, res) => {
    Movies.findOne({ Director:Name: req.params.Director})
        .then((director) => {
            res.json(director);
        })
        .catch((err) {
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
 app.put('/users/:username', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
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
app.post('/users/:Username/movies/:MovieID', (req, res) => {
    Users.findOneAndUPdate({ Username: req.params.Username }, {
        $addToSet: { FavoriteMovies: req.params.MovieID }
    },
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
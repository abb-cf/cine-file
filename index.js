const express = require("express");
    morgan = require('morgan');

const app = express();

let topTenMovies = [
    {
        title: 'Princess Diaries',
        year: 2001,
        director: 'Gary Marshall',
        actors: ['Anne Hathaway', 
        'Julie Andrews', 
        'Héctor Elizondo',
        'Heather Matarazzo',
        'Mandy Moore',
        'Caroline Goodall',
        'Robert Schwartzman']
    },
    {
        title: 'Mean Girls',
        year: 2004,
        director: 'Mark Waters',
        actors: ['Lindsay Lohan',
        'Rachel McAdams',
        'Tim Meadows',
        'Ana Gasteyer',
        'Amy Poehler',
        'Tina Fey']
    },{
        title: 'Pride and Prejudice',
        year: 2005,
        director: 'Joe Wright',
        actors: ['Kiera Knightley',
        'Matthew Macfadyen',
        'Brenda Blethyn',
        'Donald Sutherland',
        'Tom Hollander',
        'Rosamund Pike',
        'Jena Malone',
        'Judi Dench']
    },{
        title: 'Hustle',
        year: 2022,
        director: 'Jeremiah Zagar',
        actors: ['Adam Sandler',
        'Queen Latifah',
        'Ben Foster',
        'Juancho Hermangomez',
        'Robert Duvall',
        'Anthony Edwards',
        'Heidi Gardner']
    },{
        title: 'Ingrid Goes West',
        year: 2017,
        director: 'Matt Spicer',
        actors: ['Aubrey Plaza',
        'Elizabeth Olsen',
        'Billy Magnussen',
        'Wyatt Russell',
        'Pom Klementieff',
        'O\'Shea Jackson Jr.']
    },{
        title: 'Everything Everywhere All At Once',
        year: 2022,
        director: ['Daniel Kwan', 'Daniel Scheinert'],
        actors: ['Michelle Yeoh',
        'Shetphanie Hsu',
        'Ke Huy Quan',
        'Jenny Slate',
        'Harry Shum Jr.',
        'James Hong',
        'Jamie Lee Curtis']
    },{
        title: 'Fargo',
        year: 1996,
        director: 'Joel Coen',
        actors: ['Frances McDormand',
        'William H. Macy',
        'Steve Buscemi',
        'Harve Presnell',
        'Peter Storemare']
    },{
        title: 'Little Women',
        year: 2019,
        director: 'Greta Gerwig',
        actors: ['Saoirse Ronan',
        'Emma Watson',
        'Florence Pugh',
        'Eliza Scanlen',
        'Laura Dern',
        'Timothee Chalamet',
        'Meryl Streep',
        'Tracy Letts',
        'Bob Odenkirk',
        'James Norton'
        ]
    },{
        title: 'Lady Bird',
        year: 2017,
        director: 'Greta Gerwig',
        actors: ['Saoirse Ronan',
        'Laurie Metcalf',
        'Tracy Letts',
        'Timothee Chalamet',
        'Beanie Feldstein',
        'Stephen McKinley Henderson',
        'Lois Smith']
    },{
        title: 'Runaway Bride',
        year: 1999,
        director: 'Gary Marshall',
        actors: ['Julia Roberts',
        'Richard Gere',
        'Joan Cusack',
        'Hector Elizondo',
        'Rita Wilson',
        'Paul Dooley']
    },
];

app.use(morgan('common'));

app.get('/', (req, res) => {
    res.send('Welcome to Cine-File!');
  });
  
app.get('/movies', (req, res) => {
    res.json(topTenMovies);
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
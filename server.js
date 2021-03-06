//Libraries
const express = require('express');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const cors = require('cors');
const knex = require('knex');

//Controllers
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

//Database
// const db = knex({
//     client: 'pg', //postgres
//     connection: {
//       host : '127.0.0.1', //localhost is 127.0.0.1
//       user : 'postgres',
//       password : 'dbconnect123',
//       database : 'facefinder'
//     }
//   });

const db = knex({
    client: 'pg', //postgres
    connection: {
      connectionString : process.env.DATABASE_URL, //localhost is 127.0.0.1
      ssl: true,

    }
  });

//Middleware
const app = express();
app.use(express.json());
app.use(cors());

// app.all('/', function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     next()
//   });

//Routes with Dependency Injection
app.get('/', (req, res) => res.send('GET / is working'));
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt)})
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt, salt)})
app.get('/profile/:id', (req, res) => {profile.handleGetProfile(req, res, db)})
app.put('/image', (req, res) => { image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})

//Server

// app.listen(process.env.PORT || 3000, () => {
//     console.log(`App is running on ${process.env.PORT}`);
// })

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, () => {
    console.log(`App is running on ${port}`);
});
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
const db = knex({
    client: 'pg', //postgres
    connection: {
      host : '127.0.0.1', //localhost
      user : 'postgres',
      password : 'dbconnect123',
      database : 'facefinder'
    }
  });

//Middleware
const app = express();
app.use(express.json());
app.use(cors());

//Routes with Dependency Injection
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt)})
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt, salt)})
app.get('/profile/:id', (req, res) => {profile.handleGetProfile(req, res, db)})
app.put('/image', (req, res) => { image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})

//Server
app.listen(3000, () => {
    console.log('App is running');
})
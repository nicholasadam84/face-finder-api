const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();

const database = {
    users: [
        {
            id: '123',
            name: 'Nick',
            email: 'nick@gmail.com',
            password: '1234',
            entries: 0,
            joined: new Date(),
        },
        {
            id: '234',
            name: 'Heather',
            email: 'heather@gmail.com',
            password: '1234',
            entries: 0,
            joined: new Date(),
        },
    ],
    login: [
        {
            id: '987',
            hash: '',
            email: 'nick@gmail.com'
        }
    ]
}

//REMEMBER to parse JSON data coming from the front end.
app.use(express.json());

//Eliminate CORS errors during development
app.use(cors());

app.get('/', (req, res) => {
    res.send(database.users);
})

//SIGN IN
//Using res.json() instead of res.send() returns a JSON response.
app.post('/signin', (req, res) => {

    // Load hash from your password DB.
    bcrypt.compare("1234", '$2a$10$wbtESfT1JakzDlftlS20T.1X4Yp4NOpz1xyz2EUQE7rtw0o/3zwSS', function(err, res) {
        // res === true
        console.log('first guess', res);
    });
    bcrypt.compare("not_bacon", '$2a$10$wbtESfT1JakzDlftlS20T.1X4Yp4NOpz1xyz2EUQE7rtw0o/3zwSS', function(err, res) {
        // res === false
        console.log('second guess', res);
    });

//FIX ME: this should loop through all users, not just the first element.
    if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
        res.json(database.users[0]);
    } else {
        res.status(400).send('error loggin in'); 
    }
})

//REGISTER
app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    
    //Hash a password        
    // var bcrypt = require('bcryptjs');
    // bcrypt.genSalt(10, function(err, salt) {
    //     bcrypt.hash(password, salt, function(err, hash) {
    //     console.log(hash);
    //     });
    // });

    database.users.push({
        id: "3",
        name: name,
        email: email,
        //password: password,
        entries: 0,
        joined: new Date(),
   })
   res.json(database.users[database.users.length - 1]) 
})

//PROFILE
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        } 
    })
    if (!found) {
        res.status(400).json('not found')
    }
})

//IMAGE
app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++;
            return res.json(user.entries);
        } 
    })
    if (!found) {
        res.status(400).json('not found')
    }
})



app.listen(3000, () => {
    console.log('App is running');
})

//PLANNING
/*
1. GET  /                   Res: 'GET / is working'
2. POST /signin             Res: 'Success' or 'Fail'
3. POST /register           Res: new user object
4. GET  /profile/:userId    Res: user object
5. PUT  /image              Res: user object with updated count
*/

//For POST /signin: Why POST? 
//We don' want to send login info as a query string. 
//We want to send it inside of the body, ideally over HTTPS so that it is hidden from man-in-the-middle attacks.
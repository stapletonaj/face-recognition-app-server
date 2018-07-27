// require thing to make the api work
const   express = require('express'),
        bodyParser = require('body-parser'),
        bcrypt = require('bcrypt-nodejs'),
        cors = require('cors'),
        knex = require('knex'),
        register = require('./controllers/register'),
        profile = require('./controllers/profile'),
        image = require('./controllers/image'),
        signin = require('./controllers/signin');

//connect to the postgresql database
const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'Andy',
        password: 'bums',
        database: 'smart-brain'
    }
});

// db.select('*').from('users').then(data => {
//     console.log(data);
// })

// invoke express
const app = express()

//use body parser or else the things will come back as undefined
// also need to parse with the json() method if using json.
app.use(bodyParser.json());
//cors is something that enables multiple sources on one page - if we dont use this we get an error 
app.use(cors());



// Routes ==================================
app.get('/', (req, res) => {
    res.send(database.users)
})

// Sign in Route
app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt)})

// Register Route
//parameter injection in handle, resgister
app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)})

//profile route
app.get('/profile/:id', (req, res) => {profile.handleProfile(req, res, db)})

//image route
app.put('/image', (req, res) => { image.handleImage(req, res, db) }) 







// start server
app.listen(4000, () => {
    console.log('server for app is running on port 4000')
})







/*
/signin ---> POST request = sucess/fail
/register ---> POST request = return user
/profile/:id ---> GET = return user
/image ---> PUT request = return updated user 
*/
// require thing to make the api work
const   express = require('express'),
        bodyParser = require('body-parser'),
        bcrypt = require('bcrypt-nodejs'),
        cors = require('cors'),
        knex = require('knex');

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

db.select('*').from('users').then(data => {
    console.log(data);
})

// invoke express
const app = express()

//use body parser or else the things will come back as undefined
// also need to parse with the json() method if using json.
app.use(bodyParser.json());
//cors is something that enables multible sources on one page - if we dont use this we get an error 
app.use(cors());

const database = {
  users: [
    {
      id: "123",
      name: "John",
      email: "john@gmail.com",
      password: "password",
      entries: 0,
      joined: new Date()
    },
    {
      id: "124",
      name: "sally",
      email: "sally@gmail.com",
      password: "password",
      entries: 0,
      joined: new Date()
    }
  ],
  login: [
      {
          id: '234',
          has: '',
          email: 'john@gmail.com'
      }
  ]
};


// Routes ==================================

app.get('/', (req, res) => {
    res.send(database.users)
})

// Sign in Route
app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email 
        && req.body.password === database.users[0].password){
            res.json(database.users[0])
        } else {
            res.status(400).json('error logging in!')
        }
    res.json()
})



// Register Route

app.post('/register', (req, res) => {
    const {email, name, password} = req.body;
    db('users')
        .returning('*')
        .insert({
            email: email,
            name: name,
            joined: new Date() 
        })
        .then(user => {
            res.json(user[0]) 
        })
        .catch(err =>{
            res.status(400).json('unable to register')
        })
    
})


//profile route
app.get('/profile/:id', (req, res) => {
    const {id} = req.params;
    let found = false;
    db.select('*').from('users').then(user => {
        console.log(user)
    })
    if (!found){
       res.status(400).json('not found');
    }
})

//image route
app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++
            return res.json(user.entries);
        }
    })
    if (!found) {
        res.status(400).json('not found');
    }
})







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
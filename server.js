// require thing to make the api work
const   express = require('express'),
        bodyParser = require('body-parser'),
        bcrypt = require('bcrypt-nodejs'),
        cors = require('cors');

// invoke express
const app = express()

//use body parser or else the things will come back as undefined
// also need to parse with the json() method if using json.
app.use(bodyParser.json());
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
            res.json('success')
        } else {
            res.status(400).json('error logging in!')
        }
    res.json()
})



// Register Route

app.post('/register', (req, res) => {
    const {email, name, password} = req.body;
    database.users.push({
        id: "125",
        name: name,
        email: email,
        entries: 0,
        joined: new Date()
    })
    res.json(database.users[database.users.length-1])
})


//profile route
app.get('/profile/:id', (req, res) => {
    const {id} = req.params;
    let found = false;
    database.users.forEach(user => {
        if(user.id === id){
            found = true;
            return res.json(user);
        }
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
    console.log('server for app is running on port 3000')
})







/*
/signin ---> POST request = sucess/fail
/register ---> POST request = return user
/profile/:id ---> GET = return user
/image ---> PUT request = return updated user 
*/
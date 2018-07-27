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

// db.select('*').from('users').then(data => {
//     console.log(data);
// })

// invoke express
const app = express()

//use body parser or else the things will come back as undefined
// also need to parse with the json() method if using json.
app.use(bodyParser.json());
//cors is something that enables multible sources on one page - if we dont use this we get an error 
app.use(cors());



// Routes ==================================

app.get('/', (req, res) => {
    res.send(database.users)
})

// Sign in Route
app.post('/signin', (req, res) => {
    db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
            if (isValid){
                return db.select('*').from('users')
                .where('email', '=', req.body.email)
                .then(user => {
                    res.json(user[0])
                })
                .catch(err => res.status(400).json('unable to get user'))
            } else {
                res.status(400).json('wrong credentials')
            }
            
    })
    .catch(err => res.status(400).json('wrong credentials'))
})



// Register Route

app.post('/register', (req, res) => {
    const {email, name, password} = req.body;
    const hash = bcrypt.hashSync(password);
    
        db.transaction(trx => {
            trx.insert({
                hash: hash,
                email: email
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0],
                        name: name,
                        joined: new Date()
                    })
                    .then(user => {
                        res.json(user[0])
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })  
        .catch(err => {
            res.status(400).json('unable to register')
        })
    
})


//profile route
app.get('/profile/:id', (req, res) => {
    const {id} = req.params;
    db.select('*').from('users').where({
        id: id,
    })
    .then(user => {
        if(user.length){
            res.json(user[0])   
        } else {
            res.status(400).json('error user not found!')
        }   
    })
})

//image route
app.put('/image', (req, res) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries)
        })
        .catch(err => res.status(400).json('unable to get entries'))
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
const express =  require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const config = require('./config/database')

mongoose.connect(config.database)

mongoose.connection.on('connected', () => {
  console.log("Connected to database " + config.database)
})
mongoose.connection.on('error', (err) => {
  console.log("Database error " + err)
})

const app = express()
const users = require('./routes/users')
const port = 3000;

app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())
app.use('/users', users)

app.use(passport.initialize())
app.use(passport.session())

require('./config/passport')(passport);

app.get('/', (req, res) => {
  res.send("Invalid request")
})

app.listen(port, () => {
  console.log("Server running on port " + port);
})

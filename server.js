const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const port = process.env.PORT || 3001

const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

mongoose
  .connect(process.env.DATABASE_LOCAL, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false,    useUnifiedTopology: true })
    .then(() => console.log('DB connected'))
    .catch(err => {
      console.log(err);
    });


io.on('connection', (socket) => {
  console.log('socketId', socket.id)
})

const corOpts = {
  origin: process.env.CLIENT_URL
}

app.use(cors(corOpts))

app.use(bodyParser.json())
app.use(cookieParser())
app.use(morgan('dev'))

app.use(function(req, res, next) {
  req.io = io;
  next()
})

app.use('/api/craw', require('./routes/crawLottery'))
app.use('/api/user', require('./routes/user'))


server.listen(port, () => {
  console.log(`App running on port ${port}`)
})


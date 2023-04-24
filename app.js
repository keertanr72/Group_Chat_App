const express = require('express')

const bodyParser = require('body-parser')
const path = require('path')

const cors = require('cors')
const helmet = require('helmet')

const UserRoute = require('./routes/user')
// const forgotPasswordRoute = require('./routes/forgotPassword')
// const chatRoute = require('./routes/chat')
// const groupRoute = require('./routes/group')
// const imageRoute = require('./routes/image')

const errorController = require('./controllers/error')

const mongoConnect = require('./util/database').mongoConnect

const app = express()

const http = require('http').createServer(app)

const io = require('socket.io')(http, {
    cors: {
        origin: 'http://127.0.0.1:5500',
        methods: ['GET', 'POST']
    }
});

io.on('connection', (socket) => {

    // Listen for chat messages
    socket.on('chatMessage', ({ from, to, message, chat }) => {
        // Broadcast the message to all users in the chat room
        socket.to(getRoomName(from, to)).emit('chatMessage', { chat, message });
    });

    // Join a chat room
    socket.on('joinChat', ({ from, to }) => {
        socket.join(getRoomName(from, to))
    });

    socket.on('groupChatMessage', ({ groupId, message, chat }) => {
        socket.to(groupId).emit('groupChatMessage', { chat, message });
    });

    socket.on('joinGroupChat', ({ groupId }) => {
        socket.join(groupId);
    });
});

function getRoomName(from, to) {
    // Generate a unique name for the chat room
    return `${Math.min(from, to)}:${Math.max(from, to)}`;
}

app.use(cors({
    origin: ['http://127.0.0.1:5500'],
    credentials: true
}))
app.use(helmet())

// app.use('/image', imageRoute)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


app.use('/user', UserRoute)

// app.use('/password', forgotPasswordRoute)

// app.use('/chat', chatRoute)

// app.use('/group', groupRoute)

// app.use(express.static(path.join(__dirname, 'public')));

mongoConnect(() => {
    http.listen(3000)
})
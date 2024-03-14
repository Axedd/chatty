const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const session = require('express-session');

// Use body-parser middleware to parse request bodies before your route handlers.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(session({
    secret: 'iujfgd8dbiufb32uhi@@£$$€{~!!!!!8432964',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: 'auto'}
}))

// Now declare your route handlers.
const mainRouter = require('./routes/main');
const profileRouter = require('./routes/profile');
const loginRouter = require('./routes/login');

app.use('/', mainRouter);
app.use('/profile', profileRouter);
app.use('/login', loginRouter);



io.on('connection', (socket) => {
    console.log('a user connected');
    const someSocketId = socket.id; // For demonstration, using the current socket's ID

    // Emitting an event specifically to this socket ID
    io.to(someSocketId).emit('showAlert', 'This is a message for you!');
    
    
    socket.on('chat message', (msg) => {
        if (socket.username) {
            io.emit('chat message', socket.username + ": " + msg);
        } else {
            // Emitting an event specifically to this socket ID
            io.to(someSocketId).emit('showAlertUsername', 'Please Enter A Username!');
        }
    });

    socket.on('add username', (username) => {
        console.log(username)
        socket.username = username;
        console.log(someSocketId)
        io.to(someSocketId).emit('change username', username);
    })
    
    
    socket.on('disconnect', () => {
        io.emit('chat message', '*User Left The Chat*');
      });
    
})


server.listen(3000, () => {
    console.log('listening on *:3000');

    
})
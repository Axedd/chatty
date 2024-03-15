const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const session = require('express-session');
require('dotenv').config();

// Use body-parser middleware to parse request bodies before your route handlers.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: 'auto' }
}));

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Now declare your route handlers.
const mainRouter = require('./routes/main');
const profileRouter = require('./routes/profile');
const loginRouter = require('./routes/login');
const registerRouter = require('./routes/register');

app.use('/', mainRouter);
app.use('/profile', profileRouter);
app.use('/login', loginRouter);
app.use('/register', registerRouter);

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});



io.on('connection', (socket) => {
    console.log('a user connected');
    const someSocketId = socket.id; // For demonstration, using the current socket's ID

    // Emitting an event specifically to this socket ID
    io.to(someSocketId).emit('showAlert', 'This is a message for you!');
    
    
    socket.on('chat message', (msg) => {
        if (user) {
            io.emit('chat message', user.username + ": " + msg);
        } else {
            // Emitting an event specifically to this socket ID
            io.to(someSocketId).emit('showAlertUsername', 'Please Login!');
        }
    });

    socket.on('add username', (username) => {
        io.to(someSocketId).emit('change username', username);
    })
    
    
    socket.on('disconnect', () => {
        io.emit('chat message', '*User Left The Chat*');
      });
    
})


server.listen(3000, () => {
    console.log('listening on *:3000');

    
})
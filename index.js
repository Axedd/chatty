const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const session = require('express-session');
require('dotenv').config();
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
app.set('view engine', 'ejs');

const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: 'auto' }
});

app.use(sessionMiddleware)

app.use(flash());
app.use(cookieParser());

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

app.use((req, res, next) => {
    console.log("Middleware check for loggedIn cookie");
    if (req.cookies.loggedIn && !req.session.user) {
        console.log("Clearing loggedIn cookie");
        res.clearCookie('loggedIn');
    }
    next();
});


// Declare the route handlers.
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
        res.clearCookie('loggedIn');
        res.redirect('/');
    });
});

io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});

io.on('connection', (socket) => {
    console.log('a user connected');
    const someSocketId = socket.id; // For demonstration, using the current socket's ID


    // Emitting an event specifically to this socket ID
    io.to(someSocketId).emit('showAlert', 'This is a message for you!');
    
    
    socket.on('chat message', (msg) => {
        if (socket.request.session.user && socket.request.session.user.username) {
            const username = socket.request.session.user.username;
            const role = socket.request.session.user.role;
            const message = msg;
            const userDisplay = username[0].toUpperCase() + username.slice(1);
            io.emit('chat message', {'user': userDisplay, msg: message, 'role': role});
        } else {
            // Handle cases where the user or username is not set
            console.log('User session or username not found.');
        }
      });

    /*
    socket.on('disconnect', () => {
        io.emit('chat message', '*User Left The Chat*');
      });
    */
    
})





server.listen(3000, () => {
    console.log('listening on *:3000');
})
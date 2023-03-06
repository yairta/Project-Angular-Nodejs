import express from 'express';
import cors from 'cors';
import './sqlConnect';
import { signup } from './services/signup';
import { getLoginStatus, login, logout } from './services/login';
import { getcustomer, getcustomers, newCustomer, removeCustomer, updateCustomer } from './services/customers';
import { getcontact, getcontacts, newContact, removeContact, updateContact } from './services/contacts';

const session = require('express-session');

const app = express();


app.set('view engine', 'ejs');

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET'
}));

app.get('/', function(req, res) {
    res.render('pages/auth');
});

const port = process.env.PORT || 3100;
app.listen(port, () => console.log('App listening on port ' + port));


const passport = require('passport');
var userProfile;

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

app.get('/success', (req, res) => res.send(userProfile));
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
    cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
});

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = '802791669308-e0q47mhpgvgmpsg816a7u03kv4buhe6r.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        userProfile = profile;
        return done(null, userProfile);
    }
));

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/error' }),
    function(req, res) {
        // Successful authentication, redirect success.
        res.redirect('/success');
    });

// const unGuards = [
//     '/login',
//     '/logout',
//     '/signup',
// ];

app.use(session({
    secret: 'my-secret',
    name: 'mySession',
    resave: false,
    saveUninitialized: false,
}));

app.use(cors({
    origin: true,
    methods: 'GET,PUT,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept',
}));

app.use(express.json());



// // פונקצית ביניים הבודקת את ההרשאות באופן גורף - לפני שהיא ניגשת בכלל לפונקציות
// app.use((req, res, next) => {
//     if (unGuards.includes(req.url) || req.session.user) {
//         next();
//     } else {
//         res.sendStatus(401);
//     }
// });


app.listen(3000, () => {
    console.log('listening on 3000');
});

app.get('/', (req, res) => {
    res.send("Hello World");
});

app.get('/users/:userId', (req, res) => {
    res.send({
        params: req.params,
        query: req.query,
    });
});


function authGurd(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}

app.get('/login', getLoginStatus);
app.get('/logout', logout);
app.post('/signup', signup);
app.post('/login', login);

app.get('/customers', authGurd, getcustomers);
app.get('/customer/:id', authGurd, getcustomer);
app.put('/customer/:id', authGurd, updateCustomer);
app.post('/customers', authGurd, newCustomer);
app.delete('/customer/:id', authGurd, removeCustomer);


app.get('/contacts', authGurd, getcontacts);
app.get('/contact/:id', authGurd, getcontact);
app.put('/contact/:id', authGurd, updateContact);
app.post('/contacts', authGurd, newContact);
app.delete('/contact/:id', authGurd,  removeContact);
const express = require('express');
const route = express.Router();

const services = require('../services/render');
const controller = require('../controller/controller');
const requireLogin = require('../middleware/auth');

// root routes
route.get('/', services.homeRoutes);
route.get('/login-user', services.login);
route.get('/signup-user', services.signup);

// movie details + review routes (protected)
route.get('/movie/:id', requireLogin, controller.getMoviePage);
route.post('/review', requireLogin, controller.createReview);

// api user routes
route.post('/signup-user', controller.createUser);
route.post('/login-user', controller.createLogin);

// movie routes (protected)
route.get('/movie', requireLogin, controller.getAllMovies);
route.get('/search', requireLogin, controller.searchMovies);

route.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error logging out");
        }
        res.redirect('/login-user'); // redirect to login page after logout
    });
});

module.exports = route;

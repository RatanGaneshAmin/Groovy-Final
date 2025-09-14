function requireLogin(req, res, next) {
  if (req.session && req.session.userId) {
    next(); // user is logged in
  } else {
    res.redirect('/login-user');
  }
}

module.exports = requireLogin;

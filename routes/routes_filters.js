function loggedInFilter(req, res, fwd) {
  if (req.session.passport.user) {
    fwd();
  } else {
    res.redirect('/');
  }
}

module.exports.loggedInFilter = loggedInFilter;
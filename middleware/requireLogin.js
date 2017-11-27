module.exports = function(req, res, next) {
  const HOME = '/';
  if (!req.user) {
    return res.redirect(HOME);
  }

  next();
};

module.exports = (req, res, next) => {
  let pw = req.body.password;
  try {
    if ( pw.match(/[a-z]/g)
    && pw.match(/[A-Z]/g)
    && pw.match(/[0-9]/g)
    && pw.match(/[^a-zA-Z\d]/g)
    && pw.length >= 8 ) {
      next();
    }
    else {
      throw(error)
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid password' });
  }
};
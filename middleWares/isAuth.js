const jwt = require('jsonwebtoken');

const isAuth = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Headers', 'Authorization');
  const authHeader = req.headers['authorization'];
  // console.log(req.headers)
  const token = authHeader && authHeader.split(' ')[1];

  // If no token is provided, return 401 Unauthorized
  if (!token) {
    return res.send({
      status: 403,
      error: 'Token is required'
    });
  }

  // Verify the token with the secret key
  jwt.verify(token, process.env.jwttoken, (err, user) => {
    if (err) {
      return res.send({
        status: 403,
        error: 'Invalid token'
      });
    }
    // Store the authenticated user's information in the request object
    req.user = user;
    next();
  });
}
module.exports = { isAuth };
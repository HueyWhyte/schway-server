const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const token = req.header("x-auth-token");

  // check for token
  if (!token)
    return res.status(401).send({ msg: "No token, authorization denied!" });

  try {
    // verify token
    const decoded = jwt.verify(token, "Famous10@stanleyotabil_fuckuall360");
    // add user from payload
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).send({ msg: "Token is not valid" });
  }
}

module.exports = auth;

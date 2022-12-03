const jwt = require("jsonwebtoken");
const passport = require("passport");
const passportJWT = require("passport-jwt");

let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;
let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");

jwtOptions.secretOrKey = process.env.JWT_SECRET;

const Auth = function () {
  this.jwtFromHeader = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  let strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
    //console.log("payload received", jwt_payload);

    if (jwt_payload) {
      next(null, {
        _id: jwt_payload._id,
        userName: jwt_payload.userName,
      });
    } else {
      next(null, false);
    }
  });
  passport.use(strategy);
  this.initialize = function () {
    return passport.initialize();
  };
  this.authenticate = (req, res, next) => {
    //console.log(req.header, req.headers, "[authenticate]");
    passport.authenticate("jwt", { session: false }, (a, info) => {
      //console.log(info, "[authenticate]");
      req.user = info;
      return next();
    })(req, res, next);
    // next();
  };
};

module.exports = new Auth();

const JwtStrategy = require('passport-jwt').Strategy,
ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require ("mongoose");
const User = mongoose.model("users");
const keys = require("./keys");

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;


module.exports = passport => {
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    // console.log(jwt_payload);
    User.findById(jwt_payload.id)
      .then(user => {
        if(user){
          return done(null,user); // 存在该用户
        }
        return done(null,false); // 不存在该用户
      })
      .catch(err=> console.log(err));
  }));
}
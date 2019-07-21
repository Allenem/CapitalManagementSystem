// @login & register

const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

const User = require("../../models/User");

// $route   GET api/users/test
// @desc    返回请求的json数据
// @access  public

// just test
router.get("/test",(req,res)=>{
  res.json({msg:"users test api works"})
})

// $route   POST api/users/register,http://localhost:5000/api/users/register
// @desc    返回请求的json数据
// @access  public
router.post("/register",(req,res)=>{
  // console.log(req.body);

  // 查询数据库中是否有这个邮箱
  User.findOne({email:req.body.email})
    .then((user) => {
      if(user){
        return res.status(400).json("邮箱已被注册！")
      }else{
        const avatar = gravatar.url(req.body.email, {s: '200', r: 'pg', d: 'mm'});
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar,
          password: req.body.password,
          identity: req.body.identity
        })
        // 密码加密
        bcrypt.genSalt(10, function(err, salt) {
          if(err) throw err;
          bcrypt.hash(newUser.password, salt, function(err, hash) { // hash加密后的密码
            if(err) throw err;
            newUser.password = hash;
            newUser.save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          });
        });
      }
    })
})

// $route   POST api/users/login,http://localhost:5000/api/users/login
// @desc    返回token jwt passport
// @access  public
router.post("/login",(req,res) => {
  const email = req.body.email;
  const password = req.body.password;
  // 查询数据库
  User.findOne({email})
    .then(user =>{
      if(!user){
        return res.status(404).json("该用户不存在！");
      }

      // 密码匹配
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if(isMatch){
            // 登录成功，测试返回success，实际返回token
            // res.json({msg:"success"});
            // jwt.sign("规则","加密名字","过期时间","箭头函数");
            const rule = {
              id:user.id,
              name:user.name,
              avatar:user.avatar,
              identity:user.identity
            };
            jwt.sign(rule,keys.secretOrKey,{expiresIn:3600},(err,token) => {//3600一小时失效
              if(err) throw err;
              res.json({
                success: true,
                token: "Bearer " + token //token必须这样
              });
            });
          }else{
            return res.status(400).json("密码错误！");
          }
        })
    })
})

// $route   GET api/users/current,http://localhost:5000/api/users/current
// @desc    return current user
// @access  private
router.get(
  "/current",
  passport.authenticate("jwt",{session:false}), // 用户权限验证
  (req,res) => {
    res.json({
      id:req.user.id,
      name:req.user.name,
      email:req.user.email,
      identity:req.user.identity
    });
})


// $route   GET api/users/
// @desc    获取所有信息
// @access  private
router.get(
  "/",
  passport.authenticate("jwt",{session:false}),
  (req,res)=>{
    User.find()
      .then(user => {
        if(!user){
          return res.status(404).json("没有任何用户内容~");
        }
        res.json(user);
      }).catch(err => res.status(404).json(err));
})

module.exports = router;
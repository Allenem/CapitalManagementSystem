// @profile

const express = require("express");
const router = express.Router();
const passport = require("passport");

const Profile = require("../../models/Profile");

// $route   GET api/profiles/test
// @desc    返回请求的json数据
// @access  public

// just test
router.get("/test",(req,res)=>{
  res.json({msg:"profiles test api works"})
})

// $route   POST api/profiles/add
// @desc    创建信息接口
// @access  private
router.post(
  "/add",
  passport.authenticate("jwt",{session:false}),
  (req,res)=>{
    const profileField = {};

    if(req.body.type) profileField.type = req.body.type;
    if(req.body.describe) profileField.describe = req.body.describe;
    if(req.body.income) profileField.income = req.body.income;
    if(req.body.expend) profileField.expend = req.body.expend;
    if(req.body.cash) profileField.cash = req.body.cash;
    if(req.body.remark) profileField.remark = req.body.remark;
    
    new Profile(profileField).save().then( profile =>{
      res.json(profile);
    })
})

// $route   GET api/profiles/
// @desc    获取所有信息
// @access  private
router.get(
  "/",
  passport.authenticate("jwt",{session:false}),
  (req,res)=>{
    Profile.find()
      .then(profile => {
        if(!profile){
          return res.status(404).json("没有任何资金流水内容~");
        }
        res.json(profile);
      }).catch(err => res.status(404).json(err));
})

// $route   GET api/profile/:id
// @desc    获取单个信息
// @access  private
router.get(
  "/:id",
  passport.authenticate("jwt",{session:false}),
  (req,res)=>{
    Profile.findOne({_id:req.params.id})
      .then(profile => {
        if(!profile){
          return res.status(404).json("没有任何该id内容~");
        }
        res.json(profile);
      }).catch(err => res.status(404).json(err));
})

// $route   POST api/profile/edit/:id
// @desc    编辑信息接口
// @access  private
router.post(
  "/edit/:id",
  passport.authenticate("jwt",{session:false}),
  (req,res)=>{
    const profileField = {};

    if(req.body.type) profileField.type = req.body.type;
    if(req.body.describe) profileField.describe = req.body.describe;
    if(req.body.income) profileField.income = req.body.income;
    if(req.body.expend) profileField.expend = req.body.expend;
    if(req.body.cash) profileField.cash = req.body.cash;
    if(req.body.remark) profileField.remark = req.body.remark;
    
    Profile.findOneAndUpdate(
      {_id: req.params.id},
      {$set: profileField},
      {new: true}
    ).then(profile => res.json(profile));
})

// $route   POST api/profile/delete/:id
// @desc    删除信息接口
// @access  private
router.delete(
  "/delete/:id",
  passport.authenticate("jwt",{session:false}),
  (req,res)=>{
    Profile.findOneAndRemove({_id: req.params.id}).then(profile => {
      profile.save().then(profile => res.json(profile));
    }).catch(err => res.status(404).json("删除失败！"));
})

module.exports = router;
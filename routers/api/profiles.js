// @profile

const express = require("express");
const router = express.Router();
const passport = require("passport");

const Profile = require("../../models/Profile");

// Date format
Date.prototype.format = function(fmt){
  var o = {
    "M+" : this.getMonth()+1,                                                             //月份
    "d+" : (this.getHours()+8>24)?(this.getDate()+1):(this.getDate()),                    //日
    "h+" : (this.getHours()+8>24)?(this.getHours()+8-24):this.getHours()+8,               //小时
    "m+" : this.getMinutes(),                                                             //分
    "s+" : this.getSeconds(),                                                             //秒
    "q+" : Math.floor((this.getMonth()+3)/3),                                             //季度
    "S"  : this.getMilliseconds()                                                         //毫秒
  };
  if(/(y+)/.test(fmt)){
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  }  
  for(var k in o){
    if(new RegExp("("+ k +")").test(fmt)){
      fmt = fmt.replace(
        RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));  
    }
  }
  return fmt;
}

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
    if(new Date().format("yyyy-MM-dd hh:mm:ss")) profileField.date = new Date().format("yyyy-MM-dd hh:mm:ss");
    
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
    if(new Date().format("yyyy-MM-dd hh:mm:ss")) profileField.date = new Date().format("yyyy-MM-dd hh:mm:ss");;
    
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
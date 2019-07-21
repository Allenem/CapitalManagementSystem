const express = require ("express");
const mongoose = require ("mongoose");
const bodyParser = require ("body-parser");
const passport = require("passport");
const app = express();

// 引入users.js
const users = require("./routers/api/users")
const profiles = require("./routers/api/profiles")

// DB config
const db = require("./config/keys").mongoURI;

// 使用body-parser中间件
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


// Connect to mongodb
mongoose.connect(db)
  .then(()=>console.log('MongoDB Connected'))
  .catch(err=>console.log(err));

// passport初始化
app.use(passport.initialize());

require("./config/passport")(passport);

// // Router setting
// app.get("/",(req,res) => {
//   res.send("Hello World!");
// })

// 使用routes，即访问 localhost:5000/api/xxx/...
app.use("/api/users",users);
app.use("/api/profiles",profiles);

const port = process.env.PORT || 5000; 

app.listen(port,() => {
  console.log(`Server is running on port ${port}`);
})
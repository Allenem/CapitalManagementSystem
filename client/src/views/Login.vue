<template>
  <div class="login">
    <section class="form-container">
      <div class="manage_tip">
        <span class="title">资金管理系统</span>
        <el-form
          :model="loginUser"
          :rules="rules"
          ref="loginForm"
          label-width="60px"
          class="loginForm"
        >
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="loginUser.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="loginUser.password" placeholder="请输入密码"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" class="submit_btn" @click="submitForm('loginForm')">登录</el-button>
          </el-form-item>

          <div class="tiparea">
            <p>还没有账号？现在<router-link to='/register'>注册</router-link></p>
          </div>
        </el-form>
      </div>
    </section>
  </div>
</template>

<script>
import jwt_decode from 'jwt-decode';
export default {
  name: "login",
  components: {},
  data() {
    
    return {
      loginUser: {
        email: "",
        password: ""
      },
      rules: {
        email: [
          {
            type: 'email',
            required: true,
            message: "邮箱格式不正确",
            trggle: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trggle: "blur"
          },
          {
            min: 6,
            max: 20,
            message: "长度在6~20字符之间",
            trggle: "blur"
          }
        ]
      }
    };
  },
  methods: {
    submitForm(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // alert('submit!');
          this.$axios.post('/api/users/login',this.loginUser).then(res => {
            // 登录成功，拿到token
            // console.log(res);
            const { token } = res.data;
            // 存储到ls
            localStorage.setItem('eleToken', token);

            // 解析token
            const decoded = jwt_decode(token);
            // console.log(decoded);

            // token存储到vuex中
            this.$store.dispatch("setAuthenticated",!this.isEmpty(decoded));
            this.$store.dispatch("setUser",decoded);

            this.$router.push('/index');
          });
        } 
      });
    },

    // 判断token是否为空的方法
    isEmpty(value){
      return(
        value === undefined ||
        value === null ||
        (typeof value === "object" && Object.keys(value).length === 0) ||
        (typeof value === "string" && value.trim().length === 0)
      );
    }

  }
};
</script>

<style scoped>
.login {
  position: relative;
  width: 100%;
  height: 100%;
  background: url(../assets/bg.jpg) no-repeat center center;
  background-size: 100% 100%;
}
.form-container {
  position: absolute;
  width: 370px;
  height: 210px;
  top: 20%;
  left: 34%;
  padding: 25px;
  border-radius: 5px;
  text-align: center;
}
.form-container .manage_tip .title {
  font-family: "Microsoft YaHei";
  font-weight: bold;
  font-size: 26px;
  color: #fff;
}

.loginForm {
  margin-top: 20px;
  background-color: #fff;
  padding: 20px 40px 20px 20px;
  border-radius: 5px;
  box-shadow: 0 5px 10px #ccc;
}

.submit_btn {
  width: 100%;
}

.tiparea{
  text-align: right;
  font-size: 12px;
  color: #333;
}

.tiparea p a{
  color: #409eff;
}
</style>
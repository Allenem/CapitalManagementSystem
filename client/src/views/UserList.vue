<template>
  <div class="userlist" v-if="user.identity == 'manager'">

    <!-- 上面一行 -->
    <div>
      <el-form :inline="true" ref="add_data" :model="search_user">
        <!-- 筛选 -->
        <el-form-item label="按照用户筛选：">
          
        <el-row>
        <el-col :span="12">
          <el-input
            v-model="search_user.name"
            type="text"
            placeholder="用户名"
            size="small"
          >
          </el-input>
        </el-col>

        <el-col :span="12">
          <el-select 
            v-model="search_user.identity"
            placeholder="用户身份"
            size="small"
          >
            <el-option label="" value=""></el-option>
            <el-option label="管理员" value="manager"></el-option>
            <el-option label="普通员工" value="employee"></el-option>
          </el-select>
        </el-col>
        </el-row>
        </el-form-item>

        <el-form-item>
          <el-button 
            type="primary"
            size="small"
            icon="el-icon-search"
            @click="handleSearch()">筛选</el-button>
        </el-form-item>

      </el-form>
    </div>

    <!-- 表格部分 -->
    <div class="table_container">

      <el-table
        :v-if="userData.length > 0 "
        :data="userData"
        max-height="450"
        border
        style="width: 100%"
      >

        <el-table-column
          prop="name"
          label="用户"
          align="center"
          :span="8">
        </el-table-column>

        <el-table-column
          prop="email"
          label="邮箱"
          align="center"
          :span="8">
        </el-table-column>

        <el-table-column
          prop="identity"
          label="身份"
          align="center"
          :span="8">
        </el-table-column>

      </el-table>

      <!-- 分页 -->
      <el-row>
        <el-col :span="24">
          <div class="pagination">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="paginations.page_index"
              :page-sizes="paginations.page_sizes"
              :page-size="paginations.page_size"
              :layout="paginations.layout"
              :total="paginations.total">
            </el-pagination>
          </div>
        </el-col>
      </el-row>

    </div>

  </div>

  <div class="home" v-else>
    <div class="container">
      <h1 class="title">Allenem资金管理系统</h1>
      <p class="lead"> 温馨提示：</p>
      <p class="lead">非管理员身份用户，无法查看所有用户信息~可注册管理员帐号查看</p>
    </div>
  </div>

</template>

<script>
  export default {
    name: "userlist",
    data() {
      return {
        search_user: {
          name: '',
          identity: ''
        },
        filterUserData: [],
        userData: [],
        allUserData: [],
        formData:{
          name:'',
          email:'',
          identity:'',
        },
        paginations:{
          page_index: 1, // 当前页
          total: 0, // 总页数
          page_size: 5, // 一页显示多少条
          page_sizes: [5, 10, 15, 20], // 每页显示多少条
          layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
        },
      };
    },
    components: {},
    computed:{
      // 拿到user，进行权限控制：非管理员无法增删改
      user(){
        return this.$store.getters.user;
      }
    },
    created() {
      this.getUser();
    },
    methods:{
      getUser() {
        // 获取表格数据
        this.$axios
          .get('/api/users')
          .then(res => {
            // console.log(res);
            this.allUserData = res.data;
            this.filterUserData = res.data;
            // 设置分页
            this.setPaginations();
          })
          .catch(err => console.log(err));
      },
      setPaginations(){
        // 分页属性设置
        this.paginations.total = this.allUserData.length;
        this.paginations.page_index = 1;
        this.paginations.page_size = 5;
        // 设置默认分页数据
        this.userData = this.allUserData.filter((item,index)=>{
          return index < this.paginations.page_size;
        })
      },
      handleSizeChange(page_size){
        // 切换size
        this.paginations.page_index = 1;
        this.paginations.page_size = page_size;
        this.userData = this.allUserData.filter((item,index)=>{
          return index < page_size;
        })
      },
      handleCurrentChange(page){
        // 获取当前页第一个序号
        let index = this.paginations.page_size * (page - 1);
        // 获取当前页最后一个序号
        let nums = this.paginations.page_size * page;
        //容器
        let users = [];

        for(let i = index; i<nums; i++){
          if(this.allUserData[i]){
            users.push(this.allUserData[i]);
          }
          this.userData = users;
        }
      },
      handleSearch(){
        //筛选
        if(!this.search_user.name && !this.search_user.identity){
          this.$message({
            type:'warning',
            message: '请输入筛选信息'
          });
          this.getUser();
          return;
        }
        const searchName = this.search_user.name;
        const searchIdentity = this.search_user.identity;

        this.allUserData = this.filterUserData.filter(item => {
          // console.log(item);
          // console.log(searchName);
          // console.log(searchIdentity);
          let name = item.name;
          let identity = item.identity;
          return name == searchName || identity == searchIdentity;
        });
        // 设置分页
        this.setPaginations();
      }
    },
  }
</script>

<style scoped>
.userlist{
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
.pagination{
  text-align: right;
  margin-top: 10px;
}
.home{
  width: 100%;
  height: 100%;
  background: url(../assets/403.png) no-repeat;
  background-size: 100% 100%;

}
.container{
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-top: 30vh;
  background-color: rgba(0,0,0,.3);
  text-align: center;
  color: #fff;
}
.title{
  font-size: 30px;
}
.lead{
  margin-top: 50px;
  font-size: 22px;
}
</style>
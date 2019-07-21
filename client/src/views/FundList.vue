<template>
  <div class="fillContainer">
    <!-- 上面一行 -->
    <div>
      <el-form :inline="true" ref="add_data" :model="search_data">
        <!-- 筛选 -->
        <el-form-item label="按照时间筛选：">
          <el-date-picker
            v-model="search_data.startTime"
            type="datetime"
            placeholder="选择开始时间"
            size="small"
          >
          </el-date-picker>
          —
          <el-date-picker
            v-model="search_data.endTime"
            type="datetime"
            placeholder="选择结束时间"
            size="small"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" icon="el-icon-search" @click="handleSearch()">筛选</el-button>
        </el-form-item>

        <!-- add button -->
        <el-form-item class="btnRight">
          <el-button 
            type="primary" 
            size="small" 
            icon="el-icon-view" 
            v-if="user.identity == 'manager'"
            @click="handleAdd()"
          >
            添加
          </el-button>
          <el-button 
            type="primary" 
            size="small" 
            icon="el-icon-view" 
            v-else
            disabled
          >
            非管理员无法添加
          </el-button>
        </el-form-item>

      </el-form>
    </div>

    <!-- 表格部分 -->
    <div class="table_container">
      
      <el-table
        :v-if="tableData.length > 0"
        :data="tableData"
        max-height="450"
        border
        style="width: 100%"
      >

        <el-table-column
          type="index"
          label="序号"
          align="center"
          width="70">
        </el-table-column>

        <el-table-column
          prop="date"
          label="创建时间"
          align="center"
          width="250">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.date }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="type"
          label="收支类型"
          align="center"
          width="130">
        </el-table-column>

        <el-table-column
          prop="describe"
          label="收支描述"
          align="center"
          width="130">
        </el-table-column>

        <el-table-column
          prop="income"
          label="收入"
          align="center"
          width="130">
          <template slot-scope="scope">
            <span style="color:#00d053">+{{ scope.row.income }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="expend"
          label="支出"
          align="center"
          width="130">
          <template slot-scope="scope">
            <span style="color:#f56767">-{{ scope.row.expend }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="cash"
          label="账户现金"
          align="center"
          width="130">
          <template slot-scope="scope">
            <span style="color:#4db3ff">{{ scope.row.cash }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="remark"
          label="备注"
          align="center"
          width="130">
        </el-table-column>

        <!-- 管理员操作部分 -->
        <el-table-column 
          prop="operation"
          label="操作"
          align="center"
          width="200"
          fixed="right"
          v-if="user.identity == 'manager'"
        >
          <template slot-scope="scope">
            <el-button
              size="small"
              type="warning"
              icon="el-icon-edit"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
              size="small"
              type="danger"
              icon="el-icon-delete"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>

        <!-- 非管理员操作部分 -->
        <el-table-column 
          prop="operation"
          label="操作"
          align="center"
          width="200"
          fixed="right"
          v-else
        >
          <template>
            <el-button
              size="small"
              type="warning"
              icon="el-icon-edit"
              disabled
            >
              编辑
            </el-button>
            <el-button
              size="small"
              type="danger"
              icon="el-icon-delete"
              disabled
            >
              删除
            </el-button>
          </template>
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

    <!-- 弹出框 -->
    <Dialog :dialog="dialog" :formData="formData" @update="getProfile"></Dialog>
  </div>
  
</template>

<script>
  import Dialog from '../components/Dialog';
  export default {
    name: "fundlist",
    data() {
      return {
        search_data:{
          startTime:'',
          endTime:''
        },
        filterTableData: [],
        tableData: [],
        allTableData: [],
        formData:{
          type:'',
          describe:'',
          income:'',
          expend:'',
          cash:'',
          remark:'',
          id:''
        },
        dialog:{
          show: false,
          title: '',
          option: 'edit'
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
    computed:{
      // 拿到user，进行权限控制：非管理员无法增删改
      user(){
        return this.$store.getters.user;
      }
    },
    created() {
      this.getProfile();
    },
    methods:{
      getProfile() {
        // 获取表格数据
        this.$axios
          .get('/api/profiles')
          .then(res => {
            // console.log(res);
            this.allTableData = res.data;
            this.filterTableData = res.data;
            // 设置分页
            this.setPaginations();
          })
          .catch(err => console.log(err));
      },
      setPaginations(){
        // 分页属性设置
        this.paginations.total = this.allTableData.length;
        this.paginations.page_index = 1;
        this.paginations.page_size = 5;
        // 设置默认分页数据
        this.tableData = this.allTableData.filter((item,index)=>{
          return index < this.paginations.page_size;
        })
      },
      handleEdit(index,row){
        // row为拿到的所有信息
        // 编辑
        // console.log(row);
        this.dialog = {
          show: true,
          title: "修改资金信息",
          option: 'edit'
        };
        this.formData={
          type:row.type,
          describe:row.describe,
          income:row.income,
          expend:row.expend,
          cash:row.cash,
          remark:row.remark,
          id:row._id
        };
      },
      handleDelete(index,row){
        // delete
        this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.delete(`/api/profiles/delete/${row._id}`)
          .then(res=>{
            this.$message({
              message:`"${row.describe}"删除成功!`,
              type:'success'
            });
            this.getProfile();
          })
          .catch(err=>{
            this.$message({
              message:`"${row.describe}"删除失败!`,
              type:'warning'
            });
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      handleAdd(){
        this.dialog = {
          show: true,
          title: "添加资金信息",
          option: 'add'
        };
        this.formData = {
          type:'',
          describe:'',
          income:'',
          expend:'',
          cash:'',
          remark:'',
          id:''
        };
      },
      handleSizeChange(page_size){
        // 切换size
        this.paginations.page_index = 1;
        this.paginations.page_size = page_size;
        this.tableData = this.allTableData.filter((item,index)=>{
          return index < page_size;
        })
      },
      handleCurrentChange(page){
        // 获取当前页第一个序号
        let index = this.paginations.page_size * (page - 1);
        // 获取当前页最后一个序号
        let nums = this.paginations.page_size * page;
        //容器
        let tables = [];

        for(let i = index; i<nums; i++){
          if(this.allTableData[i]){
            tables.push(this.allTableData[i]);
          }
          this.tableData = tables;
        }
      },
      handleSearch(){
        //筛选
        if(!this.search_data.startTime || !this.search_data.endTime){
          this.$message({
            type:'warning',
            message: '请选择时间区间'
          });
          this.getProfile();
          return;
        }
        const sTime = this.search_data.startTime.getTime();
        const eTime = this.search_data.endTime.getTime();

        this.allTableData = this.filterTableData.filter(item => {
          let date = new Date(item.date);
          let time = date.getTime();
          return time >= sTime && time <=eTime;
        });
        // 设置分页
        this.setPaginations();
      }
    },
    components:{
      Dialog
    }
  }
</script>

<style scoped>
.fillContainer{
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
.btnRight{
  float: right;
}
.pagination{
  text-align: right;
  margin-top: 10px;
}
</style>
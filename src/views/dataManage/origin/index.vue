<template>
  <div class="box">
    <!--表单-->
    <el-form v-show="isShow" label-width="90px" inline class="box-form" :model="dataSourceInfo" ref="dataSourceInfo">
      <el-form-item label="IP" prop="ip">
        <el-input placeholder="请输入IP" v-model="dataSourceInfo.ip"></el-input>
      </el-form-item>
      <el-form-item label="数据库类型" prop="dbtype">
        <el-input placeholder="请输入数据库类型" v-model="dataSourceInfo.dbtype"></el-input>
      </el-form-item>
      <el-form-item label="数据源别名" prop="aliasName">
        <el-input placeholder="请输入数据源别名" v-model="dataSourceInfo.aliasName"></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-select v-model="dataSourceInfo.state" placeholder="使用状态">
          <el-option
            v-for="(item,index) in stateList"
            :key="index"
            :label="item.dictLabel"
            :value="item.status"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="dataSourceInfo.createTime"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="goSearch">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>


    <div class="box-table">
      <!--隐藏和刷新按钮-->
      <right-toolbar :showSearch.sync="isShow" @queryTable="refreshList"></right-toolbar>

      <!--表格-->
      <el-table style="width: 98%" border :data="dataSourceList">
        <el-table-column prop="dbtype" label="数据库类型" align="center">
        </el-table-column>
        <el-table-column prop="aliasName" label="数据源别名" align="center">
        </el-table-column>
        <el-table-column prop="ip" label="IP" align="center">
        </el-table-column>
        <el-table-column prop="port" label="端口" align="center">
        </el-table-column>
        <el-table-column prop="dbname" label="名称" align="center">
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="{row}">
            <el-tag type="primary" v-html="row.dbState==='1'?'停用':'使用中'"></el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center">
        </el-table-column>
      </el-table>
    </div>



    <!--分页器-->
    <Pagination
      :page.sync="page.pageNum"
      :total="page.total"
      :limit.sync="page.limit"
      :page-sizes="[3,5,10]"
      layout="->, total, sizes, prev, pager, next, jumper"
      style="margin-right: 20px"
      @pagination="getList">
    </Pagination>
  </div>
</template>

<script>
export default {
  name: 'Origin',
  data(){
    return{
      //收集表单数据
      dataSourceInfo:{
        ip:'',
        dbtype:'',
        aliasName:'',  // 数据库别名
        state:'',
        createTime:''
      },
      //请求获得的状态列表
      stateList:[],
      //收集分页器数据
      page:{
        pageNum:1,
        limit:3,
        total:0
      },
      //请求获得的数据源列表
      dataSourceList:[],
      isShow:true
    }
  },
  methods:{
    //获取数据源状态
    async getDataSourceState(){
      let result = await this.$API.dataManage.reqDataSourceState()
      if(result.code === 200){
        this.stateList = result.data
      }
    },

    //获取数据源列表
    async getList(pager={page:1,limit:3}){
      let params = Object.assign(pager,this.dataSourceInfo)
      let result = await this.$API.dataManage.reqDataSourceList(params)
      if(result.code === 200){
        this.page.total = result.total
        this.dataSourceList = result.rows
      }
    },

    //重置按钮的回调
    resetForm() {
      this.$refs.dataSourceInfo.resetFields()
      this.getList()
    },

    //搜索按钮的回调
    goSearch() {
      this.getList()
    },

    //刷新按钮的回调
    refreshList() {
      this.getList({page:this.page.pageNum,limit:this.page.limit})
    }
  },
  mounted() {
    this.getDataSourceState()
    this.getList()
  }
}
</script>

<style scoped>
.box-form{
  margin: 20px 0;
}

.el-form-item{
  width: 310px;
  height: 32px;
  margin-right: 32px;
}

.el-input, .el-select{
  width: 220px;
}

.el-date-editor--daterange.el-input,
.el-date-editor--daterange.el-input__inner,
.el-date-editor--timerange.el-input,
.el-date-editor--timerange.el-input__inner{
  width: 220px;
}

.el-date-editor >>> .el-range__close-icon{
  line-height: 32px;
  width: 14px;
}

.el-date-editor >>> .el-range-separator{
  width: 5px;
}

.el-button{
  margin-left: 20px;
}

.box-table{
  margin-top: 20px;
  margin-left: 20px;
}

.top-right-btn{
  margin-right: 25px !important;
  margin-bottom: 5px;
}
</style>

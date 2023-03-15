<template>
  <div>
    <!--表单-->
    <el-form :model="dataSheetInfo" ref="dataSheetInfo" v-show="isShow" label-width="90px" inline class="box-form">
      <el-form-item label="表别名" prop="tableName">
        <el-input placeholder="请输入表别名" v-model="dataSheetInfo.tableName"></el-input>
      </el-form-item>
      <el-form-item label="数据源" prop="dbName">
        <el-input placeholder="请输入数据源" v-model="dataSheetInfo.dbName"></el-input>
      </el-form-item>
      <el-form-item label="更新时间" prop="updateTime">
        <el-date-picker
          v-model="dataSheetInfo.updateTime"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="dataSheetInfo.createTime"
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
      <el-table style="width: 98%" border :data="dataSheet" empty-text="暂无数据">
        <el-table-column prop="dbName" label="数据源" align="center">
        </el-table-column>
        <el-table-column prop="tableName" label="表别名" align="center">
        </el-table-column>
        <el-table-column prop="tableCount" label="数据量" align="center">
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" align="center">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center">
        </el-table-column>
      </el-table>
    </div>

    <!--分页器-->
    <Pagination
      :page="page.pageNum"
      :total="page.total"
      :limit="page.limit"
      :page-sizes="[3,5,10]"
      layout="->, total, sizes, prev, pager, next, jumper"
      style="margin-right: 20px"
      @pagination="getList">
    </Pagination>
  </div>
</template>

<script>
export default {
  name: 'Sheet',
  data(){
    return{
      //收集表单数据
      dataSheetInfo:{
        tableName:'',
        dbName:'',
        createTime:'',
        updateTime:''
      },
      //收集分页器数据
      page:{
        pageNum:1,
        limit:3,
        total:0
      },
      dataSheet:[],
      isShow:true
    }
  },
  methods:{
    //获取数据表
    async getList(pager={page:1,limit:3}){
      let params = Object.assign(pager,this.dataSheetInfo)
      let result = await this.$API.dataManage.reqDataSheet(params)
      if(result.code === 200){
        this.page.total = result.total
        this.dataSheet = result.rows
      }
    },

    //重置按钮的回调
    resetForm(){
      this.$refs.dataSheetInfo.resetFields()
      this.getList()
    },

    goSearch(){
      this.getList()
    },

    refreshList(){
      this.getList({page:this.page.pageNum,limit:this.page.limit})
    }
  },
  mounted() {
    this.getList()
  }
}
</script>

<style scoped>
.box-form{
  margin: 20px 0;
}

.box-form .el-form-item{
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

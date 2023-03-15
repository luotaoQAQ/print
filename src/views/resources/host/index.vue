<template>
  <div>
    <!--表单-->
    <el-form v-show="isShow" ref="hostInfo" :model="hostInfo" inline class="demo-form-inline" style="margin-left: 70px;margin-top: 20px">
      <el-form-item label="IP" prop="ip">
        <el-input v-model="hostInfo.ip" placeholder="请输入IP"></el-input>
      </el-form-item>
      <el-form-item label="更新时间" prop="updateTime" style="margin-left: 30px">
        <el-date-picker
          v-model="hostInfo.updateTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item style="margin-left: 30px">
        <el-button type="primary" icon="el-icon-search" @click="goSearch">搜索</el-button>
        <el-button icon="el-icon-refresh" @click="resetForm">重置</el-button>
        <el-button icon="el-icon-printer" v-print="printObj">打印</el-button>
      </el-form-item>
    </el-form>

    <div class="box-table">
      <!--隐藏和刷新按钮-->
      <right-toolbar :showSearch.sync="isShow" @queryTable="refreshList"></right-toolbar>

      <!--表格-->
      <el-table ref="table" :data="hostList" style="width: 98%;" empty-text="暂无数据" border id="nbprint">
        <el-table-column type="index" label="序" width="80" align="center">
        </el-table-column>
        <el-table-column prop="IP" label="IP" align="center">
        </el-table-column>
        <el-table-column prop="memPer" label="内存%" align="center">
        </el-table-column>
        <el-table-column prop="cpuPer" label="CPU%" align="center">
        </el-table-column>
        <el-table-column prop="" label="磁盘%" align="center">
        </el-table-column>
        <el-table-column prop="createTime" label="更新时间" align="center">
        </el-table-column>
        <el-table-column prop="REMARK" label="备注" align="center">
        </el-table-column>
        <el-table-column prop="" label="操作" align="center">
          <template slot-scope="{row}">
            <el-tooltip effect="dark" content="图表" placement="top">
              <el-button type="primary" icon="el-icon-time" plain circle @click="goHostChart(row)"></el-button>
            </el-tooltip>
          </template>
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
  name: 'Host',
  data(){
    return {
      hostInfo:{
        ip:undefined,
        updateTime:undefined
      },
      page:{
        pageNum:1,
        limit:3,
        total:0
      },
      hostList:[],
      isShow:true,
      //打印设置
      printObj:{
        id:'nbprint',
        popTitle:'主机管理列表',
        // preview:true,
        //解决element-ui表格打印不全问题
        beforeEntryIframe () {
          const cells = document.querySelectorAll('.cell')
          const tableNode = document.querySelectorAll('.el-table__header,.el-table__body')
          // el-table 打印不全的问题
          for (let j = 0; j < tableNode.length; j++) {
            const tableItem = tableNode[j]
            tableItem.style.width = '100%'
            const child = tableItem.childNodes
            for (let i = 0; i < child.length; i++) {
              const element = child[i]
              if (element.localName === 'colgroup') {
                element.innerHTML = ''
              }
            }
          }
          // el-table 格子里面打印超过格子的问题
          for (let i = 0; i < cells.length; i++) {
            const cell = cells[i]
            cell.style.width = '100%'
            cell.removeAttribute('style')
          }
        }
      }
    }
  },
  methods:{
    //获取主机列表数据
    async getList(pager={page:1,limit:3}){
      let params = Object.assign(pager,this.hostInfo)
      console.log(params)
      let result = await this.$API.host.reqHostList(params)
      if(result.code === 200){
        this.hostList = result.data
        this.page.total = result.total
      }
    },

    //跳转到主机图表
    goHostChart(row){
      this.$router.push({
        path:'/resources/hostChart',
        query:{
          hostname:row.IP,
          dateStr:row.createTime
        }
      })
    },

    //重置按钮的回调
    resetForm(){
      this.$refs.hostInfo.resetFields()
      // this.hostInfo = {ip: '',updateTime: ''}
      this.getList()
    },

    //搜索按钮的回调
    goSearch(){
      this.getList()
    },

    //刷新按钮的回调
    refreshList(){
      this.getList({page:this.page.pageNum,limit:this.page.limit})
    }
  },
  mounted() {
    console.log(this)
    this.getList()

    this.$nextTick(() => {
      //获取el-table的thead dom节点
      let thead = this.$refs.table.$el.querySelector('.el-table__header-wrapper thead');
      //追加到el-table的内容里去
      this.$refs.table.$el.querySelector('.el-table__body-wrapper table').appendChild(thead)
    })
  }
}
</script>

<style scoped>
.box-table{
  margin-top: 20px;
  margin-left: 20px;
}

.top-right-btn{
  margin-right: 25px !important;
  margin-bottom: 5px;
}

.el-button--primary.is-plain{
  width: 20px;
  height: 20px;
  padding: 2px;
  background-color: transparent;
  border-color: transparent;
}

.el-button--primary.is-plain:hover,
.el-button--primary.is-plain:focus{
  color: #1890ff;
}

.el-table .el-table__body-wrapper table thead{
  display:none;
}

@media print {
  /*给表格添加外边框*/
  .el-table{
    border: 1px solid black;
  }
  /*每页新增表头*/
  .el-table .el-table__header-wrapper{
    display:none;
  }
  .el-table .el-table__body-wrapper table thead{
    display:table-header-group;
  }
}
</style>

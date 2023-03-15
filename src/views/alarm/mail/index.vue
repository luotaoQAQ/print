<template>
  <div>
    <!--表单-->
    <el-form :model="mailInfo" v-show="isShow" label-width="70px" inline class="box-form">
      <el-form-item label="接收邮件" prop="receiveAccount">
        <el-input placeholder="请输入接收邮件账号" v-model="mailInfo.receiveAccount"></el-input>
      </el-form-item>
      <el-form-item label="发送邮件" prop="sendAccount">
        <el-input placeholder="请输入发送邮件账号" v-model="mailInfo.sendAccount"></el-input>
      </el-form-item>
      <el-form-item label="发送时间" prop="sendTime">
        <el-date-picker
          v-model="mailInfo.sendTime"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item class="button-wrapper">
        <el-button type="primary" icon="el-icon-search">搜索</el-button>
        <el-button icon="el-icon-refresh">重置</el-button>
      </el-form-item>
    </el-form>

    <div class="box-table">
      <!--隐藏和刷新按钮-->
      <right-toolbar :showSearch.sync="isShow" @queryTable="">
        <el-tooltip class="item" effect="dark" content="告警邮件发送" placement="top">
          <el-button icon="el-icon-message" size="mini" circle @click="drawer=true"></el-button>
        </el-tooltip>
      </right-toolbar>

      <!--表格-->
      <el-table style="width: 98%" border>
        <el-table-column prop="" label="序">
        </el-table-column>
        <el-table-column prop="" label="接收邮件账号" align="center">
        </el-table-column>
        <el-table-column prop="" label="发送邮件账号" align="center">
        </el-table-column>
        <el-table-column prop="" label="发送邮箱SMTP服务器" align="center">
        </el-table-column>
        <el-table-column prop="" label="发送时间" align="center">
        </el-table-column>
      </el-table>
    </div>

    <!--右侧弹出抽屉-->
    <el-drawer
      title="告警邮件（发送内存，CPU，服务接口告警，若不需要，可以删除）"
      size="745px"
      :visible.sync="drawer">
      <!--抽屉中的表单-->
      <div class="drawer-body">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules">
          <el-form-item label="发送邮件账号" prop="account">
            <el-input v-model="ruleForm.account"></el-input>
          </el-form-item>
          <el-form-item label="发送邮件密码" prop="password">
            <el-input v-model="ruleForm.password"></el-input>
          </el-form-item>
          <el-form-item label="发送邮件SMTP" prop="SMTP">
            <el-input v-model="ruleForm.SMTP"></el-input>
          </el-form-item>
          <el-form-item label="是否启用安全链接（SSL）" prop="SSL">
            <el-select v-model="ruleForm.SSL" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发送邮箱的SMTP端口（25或465）" prop="port">
            <el-select v-model="ruleForm.port" placeholder="请选择">
              <el-option
                v-for="(item,index) in portOptions"
                :key="index"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="接受邮件，多个邮件用;隔开" prop="receive">
            <el-input v-model="ruleForm.receive"></el-input>
          </el-form-item>
          <el-form-item class="box2-button">
            <el-button type="primary">测试发送</el-button>
            <el-button type="primary" @click="saveForm">保存</el-button>
            <el-button @click="clearForm">清除</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'Mail',
  data(){
    return {
      //抽屉中表单选择器选项
      options:[
        {
          label:'是',
          value:1
        },
        {
          label:'否',
          value:0
        }
      ],
      //抽屉中端口选择器选项
      portOptions:[25,465],
      //表单是否显示
      isShow:true,
      //抽屉是否显示
      drawer:false,
      //收集告警邮件表单数据
      ruleForm:{
        account:'',
        password:'',
        SMTP:'',
        SSL:undefined,
        port:undefined,
        receive:''
      },
      //表单验证规则
      rules:{
        account: [
          {required:true,message:'请输入您的账号',trigger:'blur'}
        ],
        password: [
          {required:true,message:'请输入您的密码',trigger:'blur'}
        ],
        SMTP: [
          {required:true,message:'请输入发送邮箱SMTP服务器',trigger:'blur'}
        ],
        SSL: [
          {required:true,message:'请选择是否启用安全链接',trigger:'blur'}
        ],
        port: [
          {required:true,message:'请选择发送邮箱的SMTP端口',trigger:'blur'}
        ],
        receive: [
          {required:true,message:'请输入接收邮件',trigger:'blur'}
        ]
      },
      //收集表单数据
      mailInfo:{
        receiveAccount:undefined,
        sendAccount:undefined,
        sendTime:undefined
      }
    }
  },
  methods:{
    //保存按钮的回调
    saveForm(){
      this.$refs.ruleForm.validate(valid => {
        if(valid){
          this.drawer = false
          this.$message.success('保存成功')
        } else {
          return false
        }
      })
    },

    //清除按钮的回调
    clearForm(){
      this.resetForm('ruleForm')
    }
  }
}
</script>

<style scoped>
.box-form{
  margin: 20px;
}

.box-form .el-form-item{
  width: 290px;
  height: 32px;
  margin-right: 32px;
}

.box-form .button-wrapper{
  width: 172px;
}

.button-wrapper .el-button{
  width: 80px;
  height: 32px;
  padding: 8px 15px;
}

.box-form .el-input,
.box-form .el-select,
.box-form >>> .el-input__inner{
  width: 220px;
  height: 32px;
}

.el-date-editor--daterange.el-input,
.el-date-editor--daterange.el-input__inner,
.el-date-editor--timerange.el-input,
.el-date-editor--timerange.el-input__inner{
  width: 220px;
  height: 32px;
  padding: 0 10px;
}

.el-date-editor >>> .el-range__close-icon{
  line-height: 32px;
  width: 14px;
}

.el-date-editor >>> .el-range-separator{
  width: 5px;
}

.box-table{
  margin-top: 20px;
  margin-left: 20px;
}

.box1-button{
  margin-right: 30px;
  margin-bottom: 5px;
  float: right;
}

.box1-button .el-button{
  margin-left: 10px;
}

/*抽屉标题样式*/
>>> .el-drawer__header{
  background-color: #409EFF;
  color: #fff;
  padding: 25px;
  margin-bottom: 0;
}

.el-form-item--medium .el-form-item__label{
  display: block;
  line-height: 22px;
}

.el-drawer .el-input >>> .el-input__inner{
  height: 30px;
  line-height: 30px;
  width: 666px;
}

.el-drawer .el-select >>> .el-input__inner{
  height: 30px;
  line-height: 30px;
  width: 666px;
}

.el-drawer .el-form-item{
  width: 688px;
  height: 62px;
  margin-right: 0;
  margin-bottom: 21px;
}

.drawer-body{
  padding: 20px;
}

.box2-button{
  margin-top: 40px;
}

.top-right-btn{
  margin-right: 25px !important;
  margin-bottom: 5px;
}
</style>

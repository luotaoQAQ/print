<template>
  <div class="box">
    <el-card class="box-card">
      <el-form ref="form" :model="hostInfo" label-width="40px" inline>
        <el-form-item label="时间">
          <el-date-picker
            v-model="this.hostInfo.updateTime || Date.now()"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <!--<el-button type="primary" @click="handlePrint">打印</el-button>-->
          <el-button type="primary" v-print="printObj">打印</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>CPU使用率%</span>
      </div>
      <div>
        <el-empty v-if="this.chartData.length === 0"></el-empty>
        <div v-else ref="chart" class="chart" id="chart"></div>
      </div>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>内存使用率%</span>
      </div>
      <div>
        <el-empty></el-empty>
      </div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'HostChart',
  data(){
    return {
      hostInfo:{
        updateTime: this.$route.query.dateStr,
        IP:this.$route.query.hostname
      },
      chartData:[],
      printObj:{
        id:'chart',
        popTitle:'主机列表',
        extraCss:'',
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
    async getHostChart(){
      let result = await this.$API.host.reqHostChart(this.hostInfo)
      if(result.code === 200){
        this.chartData = result.data
      }
    },

    // handlePrint(){
    //   this.$print({
    //     printable:this.$refs.chart,
    //     type:'html',
    //     documentTitle:'主机列表'
    //   })
    // }
  },
  mounted() {
    this.getHostChart()
  },

  watch:{
    //路由跳转传参只能接收到第一次传递的值
    $route(newVal,oldVal){
      if(newVal.path!==oldVal.path){
        this.$destroy()
      }
    },

    chartData(){
      this.$nextTick(()=>{
        let mychart = echarts.init(this.$refs.chart)
        const xData = this.chartData.map(item => item.label)
        const yData = this.chartData.map(item => item.value)
        mychart.setOption({
            xAxis:{
              type:'category',
              data:xData,
              axisTick:{show:false},
              axisLabel:{
                rotate:40
              }
            },
            yAxis:{
              type:'value',
              max:100,
              min:80,
              axisTick:{show:false},
              axisLine:{show:true},
              splitLine:{
                show:true,
                lineStyle:{
                  type:'dashed'
                }
              }
            },
            tooltip:{
              trigger:'axis',
              axisPointer:{
                lineStyle:{
                  color:'#aaf8ff',
                  type:'dashed'
                },
                label:{
                  show:true,
                  backgroundColor:'rgba(0,0,0,.5)',
                  color:'white'
                }
              }
            },
            dataZoom:[
              {
                type:'inside',
                start:0,
                end:50,
              },
              {
                type:'slider',
                handleSize:'150%',
                handleStyle:{
                  color:'#6c03a5',
                },
                fillerColor:'rgba(108,3,165,.4)',
                moveHandleStyle:{
                  opacity:0
                },
                brushSelect:false, //是否开启刷选功能。在下图的 brush 区域你可以按住鼠标左键后框选出选中部分。
                left:50,
                right:10,
                bottom:10,
                width:1100,
                height:15
              }
            ],
            series:[
              {
                type:'line',
                name:'每隔两分钟',
                data:yData,
                itemStyle:{
                  color:'#aaf8ff',
                  opacity: 0
                },
                lineStyle:{
                  color:'#aaf8ff'
                },
                areaStyle:{
                  color: {
                    type: "linear",
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: "#aaf8ff", // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: "white", // 100% 处的颜色
                      },
                    ],
                    global: false, // 缺省为 false
                  },
                },
                emphasis:{
                  itemStyle: {
                    opacity: 1,
                    color:'#aaf8ff',
                    borderWidth:5,
                    borderColor:'#aaf8ff'
                  }
                }
              }
            ],
            grid:{
              top:50,
              left:50,
              right:50
            },
            legend: {
              right:'5%',
              data:['每隔两分钟'],
              icon:'circle',
              itemStyle:{
                opacity:1,
                color:'#aaf8ff'
              }
            }
          })
      })
    }
  }
}
</script>

<style scoped>
.box-card{
  margin: 20px;
}

.box-card >>> .el-form-item{
  margin-bottom: 0;
}

.chart{
  width: 1191px;
  height: 260px;
}
</style>

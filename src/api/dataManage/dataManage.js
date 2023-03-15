import request from '@/utils/request'

//获取数据源状态
export const reqDataSourceState = () => request({
  method:'get',
  url:'/resources/datasource/state'
})

//获取数据源列表
export const reqDataSourceList = (params) => request({
  method:'get',
  url:'/resources/datasource/list',
  params
})

//获取数据表
export const reqDataSheet = (params) => request({
  method:'get',
  url:'/resources/db/list',
  params
})

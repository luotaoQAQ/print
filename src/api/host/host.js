import request from '@/utils/request'

export const reqHostList = (params) => request({
  method:'get',
  url:'/biz/host/list',
  params
})

// export const reqHostList = (page,limit,IP) => {
//   if(IP){
//     return request({
//       method:'get',
//       url:`/biz/host/list?pageNum=${page}&pageSize=${limit}&IP=${IP}`
//     })
//   } else {
//     return request({
//       method:'get',
//       url:`/biz/host/list?pageNum=${page}&pageSize=${limit}`
//     })
//   }
// }

export const reqHostChart = (hostInfo) => request({
  method:'get',
  url:`/biz/host/chart?hostname=${hostInfo.IP}&dateStr=${hostInfo.updateTime}`
})

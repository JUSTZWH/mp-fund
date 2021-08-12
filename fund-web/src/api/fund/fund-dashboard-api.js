import request from '@/utils/request-api'

/**
 * 读取月数据
 * @param {*} params
 * @returns
 */
export function monthData(params) {
  return request({
    url: '/fund/dashboard/monthData',
    method: 'get',
    params: params
  })
}

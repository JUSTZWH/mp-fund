import request from '@/utils/request-api'

/**
 * 创建账号
 * @param {*} data
 * @returns
 */
export function accountCreateOrUpdate(data) {
  return request({
    url: '/fund/account/createOrUpdate',
    method: 'post',
    data
  })
}

/**
 * 读取基金list
 * @param {*} params
 * @returns
 */
export function readFundList(params) {
  return request({
    url: '/fund/readFundList',
    method: 'get',
    params: params
  })
}

/**
 * 创建或更新账号持有基金
 * @param {*} data 数据
 * @returns data
 */
export function accountHoldCreateOrUpdate(data) {
  return request({
    url: '/fund/accountHold/createOrUpdate',
    method: 'post',
    data
  })
}

/**
 * 读取我的基金账号
 * @param {*} params
 * @returns
 */
export function readMyAccount(params) {
  return request({
    url: '/fund/readMyAccount',
    method: 'get',
    params: params
  })
}

/**
 * 读取我的基金账号持有的基金
 * @param {*} params
 * @returns
 */
export function readMyFund(params) {
  return request({
    url: '/fund/readMyFund',
    method: 'get',
    params: params
  })
}

/**
 * 创建或更新基金日收益
 * @param {*} data 数据
 * @returns data
 */
export function incomeRecordCreateOrUpdate(data) {
  return request({
    url: '/fund/incomeRecord/createOrUpdate',
    method: 'post',
    data
  })
}


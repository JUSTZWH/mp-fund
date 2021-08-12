import request from '@/utils/request-api'

// 账号登录
export function readTokenByAccount(params) {
  return request({
    url: '/pub/login/readTokenByAccount',
    method: 'get',
    params: params
  })
}

// 读取自己信息
export function readMyInfo() {
  return request({
    url: '/pub/member/readMySimpleInfo',
    method: 'get'
  })
}

/**
 * 更新会员信息
 * @param {object} data
 * @returns
 */
export function updateInfo(data) {
  return request({
    url: '/pub/member/updateSimpleInfo',
    method: 'post',
    data
  })
}

/**
 * 登陆日志
 * @returns
 */
export function login() {
  return request({
    url: '/pub/member/login?source=music',
    method: 'get'
  })
}

/**
 * 注册
 * @returns
 */
export function register(data) {
  return request({
    url: '/pub/member/register',
    method: 'post',
    data
  })
}

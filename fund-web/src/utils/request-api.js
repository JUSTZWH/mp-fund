import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import { getMemberToken } from '@/utils/auth'
import router from '@/router'

const service = axios.create({
  baseURL: process.env.VUE_APP_MP_MEMBER_BASE_API,
  timeout: 10000
})

service.interceptors.request.use(
  config => {
    if (getMemberToken()) {
      config.headers['M_TOKEN'] = getMemberToken()
    }
    config.headers['MUSIC'] = '123456'
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

service.interceptors.response.use(

  response => {
    const that = this
    const res = response.data
    if (res === '') {
      return res
    }
    if (res.code !== 0) {
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 3 * 1000
      })
      if (res.code === 10000) {
        MessageBox.alert('登录已过期，请重新登录', '温馨提示', {
          confirmButtonText: '确定',
          showClose: false,
          callback: () => {
            router.push('/member-login')
          }
        })
      }
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  }
)

export default service

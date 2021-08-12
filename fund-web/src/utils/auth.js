import Cookies from 'js-cookie'

const TokenKey = 'admin_user_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function getMemberToken() {
  return Cookies.get('member_token')
}

export function setMemberToken(token) {
  return Cookies.set('member_token', token)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function removeMemberToken() {
  return Cookies.remove('member_token')
}

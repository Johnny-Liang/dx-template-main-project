import axios from '@/utils/axios'
export const getRouters = () => {
  return axios({
    url: '/user-service/pms/menu/getCurrentUserMenu?systemId=1',
    method: 'GET'
  })
}
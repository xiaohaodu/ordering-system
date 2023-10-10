import base from '@/network/base'
import axios from 'axios'
import qs from 'qs'

//客户端点餐-添加菜单
export function submitOrder(order) {
    return axios({
        method: 'post',
        url: `${base.url}/order`,
        headers: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': localStorage.Authorization },
        data: qs.stringify(order)
    })
}

//服务器端-获取菜单
export function getOrder(id) {
    return axios({
        method: 'get',
        url: `${base.url}/order/${id}`,
        headers: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': localStorage.Authorization },
    })
}

//客户端-通过桌号获取菜单
export function getOrderTable(id) {
    return axios({
        method: 'get',
        url: `${base.url}/order_table/${id}`,
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
    })
}



//修改菜单
export function updateOrder(order) {
    return axios({
        method: 'patch',
        url: `${base.url}/order`,
        headers: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': localStorage.Authorization },
        data: qs.stringify(order)
    })
}
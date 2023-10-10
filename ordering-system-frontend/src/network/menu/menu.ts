import axios from "axios";
import base from "../base";
import qs from 'qs'

//获取菜单
export function getMenu(id) {
    return axios({
        method: 'get',
        url: `${base.url}/menu/${id}`,
        headers: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': localStorage.Authorization },
    })
}

//获取菜单
export function getMenus() {
    return axios({
        method: 'get',
        url: `${base.url}/menus`,
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
    })
}

//添加菜单
export function addMenu(dish, id) {
    return axios({
        method: 'post',
        url: `${base.url}/menu/${id}`,
        headers: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': localStorage.Authorization },
        data: qs.stringify(dish)
    })
}

//删除菜单
export function subMenu(dish, id) {
    return axios({
        method: 'delete',
        url: `${base.url}/menu/${id}`,
        headers: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': localStorage.Authorization },
        data: qs.stringify(dish)
    })
}
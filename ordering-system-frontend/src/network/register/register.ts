import base from "@/network/base";
import axios from 'axios';
import qs from 'qs';
export function register(user) {
    return axios({
        method: 'post',
        url: `${base.url}/user/register/`,
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: qs.stringify(user)
    })
}
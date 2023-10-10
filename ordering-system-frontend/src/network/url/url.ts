import axios from "axios";
import base from "../base";
import qs from 'qs'

export function getUrl(picture) {
    // console.log(picture);
    return axios({
        method: 'post',
        url: `${base.url}/url`,
        headers: { 'Authorization': localStorage.Authorization, 'Content-Type': 'application/x-www-form-urlencoded' },
        data: qs.stringify(picture)
    })
}
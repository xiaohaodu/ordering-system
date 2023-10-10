const { default: axios } = require("axios");
const qs = require('qs')

const Authorization = 'chv_yXY8_2aa7587f22e9e234b81301171ace9b97ff12f3b20153af3f7e4228ea8285928a58824ae95d9cf556c456d11d8a195ca5963a3102797ca10e7625e664947cfd92'
exports.getUrl = (req, res) => {
    // console.log(req.body);
    try {
        const data = axios({
            method: 'post',
            url: `https://imgloc.com/api/1/upload`,
            headers: { 'X-API-Key': Authorization },
            data: qs.stringify(req.body)
        })
        console.log(data);
    } catch (error) {
        console.log(error);
    }
}
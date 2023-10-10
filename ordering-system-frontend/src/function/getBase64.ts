export async function getBase64(image: File, result: any) {
    //   如果用户选择了图片就将图片转化为base64位的格式进行存储和使用
    // 第一步：先读取文件
    const base = new FileReader()
    // console.dir(base)
    // 第二步：将需要转化的图片放进去
    base.readAsDataURL(image)
    // 第三步：获取结果， 因为文件加载需要时间，因此是个异步的过程，需要使用onload去获取读取的结果，读取转化后的结果放在了result属性里了
    base.onload = () => {
        result = base.result
    }
}

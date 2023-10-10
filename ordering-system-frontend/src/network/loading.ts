import { ElLoading } from 'element-plus'

function loading() {
    const option = {
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
    }
    return ElLoading.service(option)
}
export default loading

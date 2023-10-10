import { ElMessage } from "element-plus"
import loading from "@/network/loading"
export function elMessage(error, mytype: any = 'error', bool: boolean = true) {
    if (bool) {
        loading().close()
    }
    return ElMessage({
        message: error,
        grouping: true,
        type: mytype
    })
}
export function useWebSocket(handleMessage) {
    const ws = new WebSocket(`wss://os.api.mayuan.work/ws`)
    // const ws = new WebSocket(`wss://127.0.0.1:8100/ws`)
    // const ws = new WebSocket(`ws://127.0.0.1:8100/ws`)

    const init = () => {
        bindEvent()
    }

    function bindEvent() {
        ws.addEventListener('open', handleOpen, false)
        ws.addEventListener('close', handleClose, false)
        ws.addEventListener('error', handleError, false)
        ws.addEventListener('message', handleMessage, false)
    }
    function handleOpen(e) {
        console.log('WebSocket open', e);
    }
    function handleClose(e) {
        console.log('WebSocket close', e);
    }
    function handleError(e) {
        console.log('WebSocket error', e);
    }

    init()

    return ws
}
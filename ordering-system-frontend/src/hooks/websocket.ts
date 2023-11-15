export function useWebSocket(handleMessage) {
  const ws =
    process.env.NODE_ENV === "production"
      ? new WebSocket(`wss://os.api.mayuan.work/ws`)
      : new WebSocket(`ws://127.0.0.1:9000/ws`);
  let webSocketState: boolean;
  const init = () => {
    bindEvent();
  };
  const heartBeat = {
    time: 5000,
    timeout: 2000,
  };

  function bindEvent() {
    ws.addEventListener("open", handleOpen, false);
    ws.addEventListener("close", handleClose, false);
    ws.addEventListener("error", handleError, false);
    ws.addEventListener("message", handleMessage, false);
  }
  function handleOpen(e) {
    console.log("WebSocket open", e);
  }
  function handleClose(e) {
    console.log("WebSocket close", e);
  }
  function handleError(e) {
    console.log("WebSocket error", e);
  }
  /*
   * 心跳初始函数
   * @param time：心跳时间间隔
   */
  function startHeartBeat(time) {
    setTimeout(() => {
      waitingServer();
    }, time);
  }
  function waitingServer() {
    webSocketState = false; //在线状态
    setTimeout(() => {
      if (webSocketState) {
        startHeartBeat(heartBeat.time);
        return;
      }
      console.log("心跳无响应，已断线");
      close();
      //重连操作
    }, heartBeat.timeout);
  }

  init();

  return ws;
}

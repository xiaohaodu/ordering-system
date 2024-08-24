export function useWebSocket(handleMessage) {
  console.log(process.env.NODE_ENV); // 可以考虑使用更安全的日志级别

  const wsUrl =
    process.env.NODE_ENV === "production"
      ? "wss://os.api.mayuan.work/ws"
      : "wss://127.0.0.1:9000/ws";
  let ws = new WebSocket(wsUrl);
  let webSocketState = false;
  const heartBeat = {
    time: 5000,
    timeout: 2000,
  };
  const maxAttempts = 5; // 最大重连次数
  let attempts = 0; // 当前重连尝试次数

  function bindEvent() {
    ws.addEventListener("open", handleOpen);
    ws.addEventListener("close", handleClose);
    ws.addEventListener("error", handleError);
    ws.addEventListener("message", handleMessage);
  }

  function handleOpen() {
    console.log("WebSocket open");
    webSocketState = true;
    startHeartBeat(heartBeat.time);
  }

  function handleClose() {
    console.log("WebSocket close");
    webSocketState = false;
    attempts = 0; // 重置重连次数
    waitingServer();
  }

  function handleError() {
    console.log("WebSocket error");
    webSocketState = false;
    attempts = 0; // 重置重连次数
    waitingServer();
  }

  function startHeartBeat(time) {
    setTimeout(() => {
      if (webSocketState) {
        ws.send(JSON.stringify({ type: "heartbeat" }));
        startHeartBeat(heartBeat.time);
      } else {
        waitingServer();
      }
    }, time);
  }

  function waitingServer() {
    setTimeout(() => {
      if (!webSocketState) {
        console.log("心跳无响应，已断线");
        // 检查是否超过了最大重连次数
        if (maxAttempts > 0 && attempts >= maxAttempts) {
          console.log("Max reconnection attempts reached, giving up.");
          return;
        }
        reconnect();
      }
    }, heartBeat.timeout);
  }

  function reconnect() {
    console.log(`Reconnecting attempt ${attempts + 1}...`);
    ws.close(); // 关闭旧连接
    ws = new WebSocket(wsUrl); // 创建新连接
    bindEvent(); // 重新绑定事件
    // 设置延迟时间，例如首次尝试后等待1秒，第二次2秒，第三次4秒等
    setTimeout(
      () => ws.send(JSON.stringify({ type: "heartbeat" })),
      Math.pow(2, attempts++) * 1000
    );
  }

  bindEvent();

  return ws; // 返回WebSocket实例
}

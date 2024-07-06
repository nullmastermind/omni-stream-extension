type ServerConfig = {
  server: string;
  fps: number;
  width: number;
  height: number;
};

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "startStream") {
    void selectWindowStream(request.config);
  }
});

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function selectWindowStream(config: ServerConfig) {
  (window as any).currentCaptureSession = Date.now();
  (window as any).oldWs?.close();
  let currentCaptureSession = (window as any).currentCaptureSession;

  if (config.width % 2 === 1) {
    config.width += 1;
  }

  if (config.height % 2 === 1) {
    config.height += 1;
  }

  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        frameRate: {
          ideal: +(config.fps || 60),
          max: +(config.fps || 60),
        },
      },
      audio: false,
    });

    const videoTrack = stream.getVideoTracks()[0];
    const imageCapture = new ImageCapture(videoTrack);

    const offscreenCanvas = new OffscreenCanvas(1, 1);
    const offscreenContext = offscreenCanvas.getContext("2d");

    let lastFrameTime = performance.now();
    let frameCount = 0;
    let fps = 0;

    let ws: WebSocket | null = null;
    (window as any).oldWs = ws;

    function connectWebSocket() {
      ws = new WebSocket(config.server);

      ws.onopen = () => {
        console.log("Connected to WebSocket server");
      };

      ws.onclose = () => {
        if (currentCaptureSession !== (window as any).currentCaptureSession) {
          return;
        }
        console.log(
          "Disconnected from WebSocket server, attempting to reconnect...",
        );
        setTimeout(connectWebSocket, 1000);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error: ", error);
        ws?.close();
      };
    }

    // connectWebSocket();

    async function extractCenterPixels() {
      try {
        const bitmap = await imageCapture.grabFrame();

        const currentFrameTime = performance.now();
        frameCount++;
        const elapsedTime = currentFrameTime - lastFrameTime;

        if (elapsedTime >= 1000) {
          fps = frameCount;
          frameCount = 0;
          lastFrameTime = currentFrameTime;
          console.log(`FPS: ${fps}`);
        }

        const width = bitmap.width;
        const height = bitmap.height;

        offscreenCanvas.width = width;
        offscreenCanvas.height = height;

        const centerX = Math.floor(width / 2);
        const centerY = Math.floor(height / 2);
        const startX = centerX - config.width / 2;
        const startY = centerY - config.height / 2;

        offscreenContext!.drawImage(bitmap, 0, 0);
        const imageData = offscreenContext!.getImageData(
          startX,
          startY,
          config.width,
          config.height,
        );
        const data = imageData.data;

        // if (
        //   ws &&
        //   ws.readyState === WebSocket.OPEN &&
        //   data.buffer.byteLength > 100
        // ) {
        //   ws.send(data.buffer);
        // }
      } catch {}
    }

    // while (true) {
    //   if (videoTrack.readyState !== "live") {
    //     break;
    //   }
    //   await extractCenterPixels();
    //   await sleep(1);
    // }
    const loop = async () => {
      if (videoTrack.readyState !== "live") {
        return;
      }
      await extractCenterPixels();
      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);

    console.log("stopped");
  } catch (err) {
    console.error("Error: " + err);
  }
}

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

async function selectWindowStream(config: ServerConfig) {
  if (config.width % 2 === 1) {
    config.width += 1;
  }

  if (config.height % 2 === 1) {
    config.height += 1;
  }

  try {
    console.log("frameRate:", +(config.fps || 60));
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        frameRate: {
          ideal: +(config.fps || 60),
        },
      },
      audio: false,
    });

    const videoTrack = stream.getVideoTracks()[0];
    const imageCapture = new ImageCapture(videoTrack);

    let lastFrameTime = performance.now();
    let frameCount = 0;
    let fps = 0;

    const countFps = () => {
      const currentFrameTime = performance.now();
      frameCount++;
      const elapsedTime = currentFrameTime - lastFrameTime;

      if (elapsedTime >= 1000) {
        fps = frameCount;
        frameCount = 0;
        lastFrameTime = currentFrameTime;
        console.log(`FPS: ${fps}`);
      }
    };

    const offscreenCanvas = new OffscreenCanvas(config.width, config.height);
    const offscreenContext = offscreenCanvas.getContext("2d")!;

    function extractCenterPixels() {
      imageCapture
        .grabFrame()
        .then(async (bitmap) => {
          const width = bitmap.width;
          const height = bitmap.height;
          const centerX = Math.floor(width / 2);
          const centerY = Math.floor(height / 2);
          const startX = centerX - config.width / 2;
          const startY = centerY - config.height / 2;

          offscreenContext.drawImage(
            bitmap,
            startX,
            startY,
            config.width,
            config.height,
            0,
            0,
            config.width,
            config.height,
          );

          // const t = performance.now();
          const imageDataPixels = offscreenContext.getImageData(
            0,
            0,
            config.width,
            config.height,
          );
          // console.log("getImageData performance:", performance.now() - t);

          countFps();
        })
        .catch(() => {});
    }

    const loop = async () => {
      if (videoTrack.readyState !== "live") {
        return;
      }
      extractCenterPixels();
      requestAnimationFrame(loop);
    };

    void loop();

    console.log("stopped");
  } catch (err) {
    console.error("Error: " + err);
  }
}

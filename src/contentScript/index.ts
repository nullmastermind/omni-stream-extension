chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "startStream") {
    void selectWindowStream();
  }
});

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function selectWindowStream() {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        frameRate: {
          ideal: 240,
          max: 240,
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
        const startX = centerX - 40;
        const startY = centerY - 40;

        const imageData = offscreenContext!.getImageData(
          startX,
          startY,
          80,
          80,
        );
        const data = imageData.data;
      } catch {
        await sleep(1);
      }
    }

    while (true) {
      if (videoTrack.readyState !== "live") {
        break;
      }
      await extractCenterPixels();
    }

    console.log("stopped");
  } catch (err) {
    console.error("Error: " + err);
  }
}

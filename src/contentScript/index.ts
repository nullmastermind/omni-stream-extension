chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "startStream") {
    console.log("start stream");
  }
});

console.log("Reloaded:", new Date());

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // if (request.action === "startStream") {
  //   console.log("start stream");
  // }
  console.log("request", request);
});

console.log("background is running");

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "startStream") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      void chrome.tabs.sendMessage(tabs[0].id!, request);
    });
  }
});

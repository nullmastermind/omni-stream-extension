console.log("background is running");

chrome.runtime.onMessage.addListener((request) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    void chrome.tabs.sendMessage(tabs[0].id!, request);
  });
});

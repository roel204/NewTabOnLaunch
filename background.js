chrome.runtime.onStartup.addListener(function() {
    chrome.tabs.create({ url:"chrome://newtab", active: true });
});
chrome.runtime.onStartup.addListener(function() {
    chrome.tabs.query({ title: "New Tab" }, function(tabs) {
        tabs.forEach(tab => chrome.tabs.remove(tab.id));
    });
    chrome.tabs.create({ url: "chrome://newtab", active: true });
});
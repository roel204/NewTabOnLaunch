chrome.runtime.onStartup.addListener(function () {
    // Check for existing "New Tab" and close them
    chrome.tabs.query({title: "New Tab"}, function (tabs) {
        tabs.forEach(tab =>
            chrome.tabs.remove(tab.id)
        );
    });

    // Minimize all tab groups (Currently not working, chrome fix is in progress)
    // chrome.windows.getCurrent(function (win) {
    //     chrome.tabGroups.query({ windowId: win.id }, function (groups) {
    //         groups.forEach(group =>
    //             chrome.tabGroups.update(group.id, {collapsed: true})
    //         );
    //     })
    // })

    // Create the new tab (existing code)
    chrome.tabs.create({url: "chrome://newtab", active: true});
});
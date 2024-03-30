chrome.runtime.onStartup.addListener(function () {

    ensureNewTab()

    // Minimize all tab groups
    // chrome.windows.getCurrent(function (win) {
    //     chrome.tabGroups.query({ windowId: win.id }, function (groups) {
    //         groups.forEach(group =>
    //             chrome.tabGroups.update(group.id, {collapsed: true})
    //         );
    //     })
    // })
});

chrome.tabs.onActivated.addListener(function () {
    ensureNewTab()
})

function createNewTab() {
    // Check for existing "New Tab" and close them
    chrome.tabs.query({title: "New Tab"}, function (tabs) {
        tabs.forEach(tab =>
            chrome.tabs.remove(tab.id)
        );
    });

    // Create new tab
    chrome.tabs.create({url: "chrome://newtab", active: true});
}

// Function to always have a new tab open
async function ensureNewTab() {
    // Get all existing tabs
    const tabs = await chrome.tabs.query({});

    // Find all "New Tab" tabs
    const newTabsIndex = tabs.map((tab, index) => tab.title === "New Tab" ? index : null).filter(index => index !== null);

    // Keep only the last "New Tab" and close any extra ones
    if (newTabsIndex.length > 1) {
        for (const tabIndex of newTabsIndex.slice(0, -1)) {
            setTimeout(() => {
                chrome.tabs.remove(tabs[tabIndex].id);
            }, 100);
        }
    }

    // Move the last remaining "New Tab" to the desired position (or create one if none exist)
    const newTabIndex = newTabsIndex.length > 0 ? newTabsIndex[0] : -1;
    if (newTabIndex !== -1 && newTabIndex !== tabs.length - 1) {
        setTimeout(() => {
            chrome.tabs.move(tabs[newTabIndex].id, {index: tabs.length});
        }, 100);
    } else if (!~newTabIndex) {
        setTimeout(() => {
            chrome.tabs.create({url: "chrome://newtab", active: false, index: tabs.length});
        }, 100);
    }
}

let newTabOnLaunchOption = false;
let ensureNewTabOption = false;

// Get all options from the sync storage
async function setOptions() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(['newTabOnLaunch', 'ensureNewTab'], function (data) {
            // Use the retrieved options here
            newTabOnLaunchOption = data.newTabOnLaunch || false;
            ensureNewTabOption = data.ensureNewTab || false;
            console.log(data)
            resolve()
        })
    })
}

// Code that runs on startup
chrome.runtime.onStartup.addListener(async function () {

    await setOptions()

    console.log(newTabOnLaunchOption)
    // Create a new active tab on launch
    if (newTabOnLaunchOption) {
        ensureNewTab(true)
    }

    // Minimize all tab groups (Not working currently, waiting on chrome update)
    // chrome.windows.getCurrent(function (win) {
    //     chrome.tabGroups.query({ windowId: win.id }, function (groups) {
    //         groups.forEach(group =>
    //             chrome.tabGroups.update(group.id, {collapsed: true})
    //         );
    //     })
    // })
});

// Call tabChange when the active tab has changed. Timeout to prevent moving tab error
chrome.tabs.onActivated.addListener(function () {
    setTimeout(() => {
        tabChange()
    }, 500);
})

// Call tabChange when a tab has been moved. Timeout to prevent moving tab error
chrome.tabs.onMoved.addListener(function () {
    setTimeout(() => {
        tabChange()
    }, 500);
})

// Call tabChange when a tab has been removed
chrome.tabs.onRemoved.addListener(function () {
    tabChange()
})

// Function that runs when there are changes to the tabs
function tabChange() {
    // Ensure a new tab is always open
    if (ensureNewTabOption) {
        ensureNewTab(false)
    }
}

// Function to always have a new tab open
async function ensureNewTab(isActive) {
    // Get all existing tabs
    const tabs = await chrome.tabs.query({});

    // Find all "New Tab" tabs
    const newTabsIndex = tabs.map((tab, index) => tab.title === "New Tab" ? index : null).filter(index => index !== null);

    // Keep only the last "New Tab" and close any extra ones
    if (newTabsIndex.length > 1) {
        for (const tabIndex of newTabsIndex.slice(0, -1)) {
            chrome.tabs.remove(tabs[tabIndex].id);
        }
    }

    // Get the index of the remaining "New Tab"
    const newTabIndex = newTabsIndex.length > 0 ? newTabsIndex[0] : -1;
    // If it's not in the last position, move it there
    if (newTabIndex !== -1 && newTabIndex !== tabs.length - 1) {
        chrome.tabs.move(tabs[newTabIndex].id, {index: tabs.length});

        // Check if the moved tab needs to be active
        if (isActive) {
            chrome.tabs.update(tabs[newTabIndex].id, {active: true});
        }

        // If there is no new tab, create one
    } else if (!~newTabIndex) {
        chrome.tabs.create({url: "chrome://newtab", active: isActive, index: tabs.length});

        // If a "New Tab" exists and doesn't need to be moved, check if it needs to be active
    } else if (isActive) {
        chrome.tabs.update(tabs[newTabIndex].id, {active: true});
    }
}

const newTabOnLaunchElement = document.getElementById('newTabOnLaunch');
const ensureNewTabElement = document.getElementById('ensureNewTab');

chrome.storage.sync.get(['newTabOnLaunch', 'ensureNewTab'], function(data) {
    newTabOnLaunchElement.checked = data.newTabOnLaunch || false;
    ensureNewTabElement.checked = data.ensureNewTab || false;
});

newTabOnLaunchElement.addEventListener('change', function(event) {
    chrome.storage.sync.set({ newTabOnLaunch: event.target.checked });
});

ensureNewTabElement.addEventListener('change', function(event) {
    chrome.storage.sync.set({ ensureNewTab: event.target.checked });
});

let colors = [];
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    // When we get a message from the content script
    if (message.method == 'setColors') {
        colors = message.colors;
        console.log('Colors set:', colors);
    }
    // When we get a message from the popup
    else if (message.method == 'getColors') {
        sendResponse(colors);
        console.log('Colors sent:', colors);
    }
});


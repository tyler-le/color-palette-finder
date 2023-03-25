chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.colors) {
        console.log('Colors received:', request.colors);
        // Process the received colors here
        sendResponse({ "processedColors": request.colors });
    }
});

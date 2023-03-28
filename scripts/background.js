console.log('background script')

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log(request.input)
    fetch(request.input, request.init).then(function (response) {
        return response.text().then(function (text) {
            sendResponse([{
                body: text,
                status: response.status,
                statusText: response.statusText,
            }, null]);
        });
    }, function (error) {
        sendResponse([null, error]);
    });
    return true;
});
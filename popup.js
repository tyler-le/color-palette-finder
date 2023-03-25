chrome.runtime.sendMessage({ 'method': 'getColors' }, function (response) {
    //response is now the info collected by the content script.
    console.log(response);
});
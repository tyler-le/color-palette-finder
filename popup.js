window.addEventListener('load', function () {
    // Listen for a click event on the button
    const btn = document.getElementById("get-palette");
    btn.addEventListener("click", () => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { type: "getColors" }, function (colors) {
                console.log(colors);
                renderColors(colors);
            });
        });
    });
});

function renderColors(colors) {
}

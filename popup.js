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
    // Sort the colors by frequency
    const colorCounts = {};
    colors.forEach((color) => {
        colorCounts[color] = (colorCounts[color] || 0) + 1;
    });
    const sortedColors = Object.keys(colorCounts).sort(
        (a, b) => colorCounts[b] - colorCounts[a]
    );

    // Create blocks of the most frequent colors
    const colorsContainer = document.getElementById("output");
    for (let i = 0; i < 5 && i < sortedColors.length; i++) {
        const colorBlock = document.createElement("div");
        colorBlock.style.backgroundColor = sortedColors[i];
        colorBlock.style.width = "50px";
        colorBlock.style.height = "50px";
        colorBlock.style.margin = "5px";
        colorBlock.style.border = "1px solid black";
        colorsContainer.appendChild(colorBlock);
    }
}

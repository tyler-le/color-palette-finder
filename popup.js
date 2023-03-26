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
        colorBlock.style.position = "relative";
        colorBlock.style.cursor = "pointer";

        // Add span element to display color code
        const colorCodeSpan = document.createElement("span");
        colorCodeSpan.textContent = sortedColors[i];
        colorCodeSpan.style.position = "absolute";
        colorCodeSpan.style.top = "50%";
        colorCodeSpan.style.left = "50%";
        colorCodeSpan.style.transform = "translate(-50%, -50%)";
        colorCodeSpan.style.color = "#fff";
        colorCodeSpan.style.fontWeight = "bold";
        colorCodeSpan.style.fontSize = "12px";
        colorCodeSpan.style.opacity = 0;
        colorBlock.appendChild(colorCodeSpan);

        // Add mouseover and mouseout event listeners to show/hide color code and change cursor
        colorBlock.addEventListener("mouseover", () => {
            colorCodeSpan.style.opacity = 1;
            colorBlock.style.cursor = "cursor";
        });
        colorBlock.addEventListener("mouseout", () => {
            colorCodeSpan.style.opacity = 0;
            colorBlock.style.cursor = "pointer";
        });

        // Add click event listener to copy color code to clipboard
        colorBlock.addEventListener("click", async () => {
            await navigator.clipboard.writeText(sortedColors[i]);
            alert("Hex code copied to clipboard: " + sortedColors[i]);
        });

        colorsContainer.appendChild(colorBlock);
    }
}


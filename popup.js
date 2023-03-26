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

        // Calculate perceived brightness of color and set text color accordingly
        const [red, green, blue] = colorBlock.style.backgroundColor.match(/\d+/g);
        const perceivedBrightness = Math.sqrt(
            0.299 * red ** 2 +
            0.587 * green ** 2 +
            0.114 * blue ** 2
        );
        const textColor = perceivedBrightness <= 130 ? "#fff" : "#000";

        // Add span element to display color code
        const colorCodeSpan = document.createElement("span");
        colorCodeSpan.textContent = sortedColors[i];
        colorCodeSpan.style.position = "absolute";
        colorCodeSpan.style.top = "50%";
        colorCodeSpan.style.left = "50%";
        colorCodeSpan.style.transform = "translate(-50%, -50%)";
        colorCodeSpan.style.color = textColor;
        colorCodeSpan.style.fontWeight = "bold";
        colorCodeSpan.style.fontSize = "12px";
        colorCodeSpan.style.opacity = 1; // Initially display the color code

        // Add mouseover and mouseout event listeners to show/hide color code and change cursor
        colorBlock.addEventListener("mouseover", () => {
            colorCodeSpan.style.opacity = 1;
            colorBlock.style.cursor = "pointer";
        });
        
        colorBlock.addEventListener("mouseout", () => {
            colorCodeSpan.textContent = sortedColors[i]; // Revert back to the color code
            colorCodeSpan.style.opacity = 1;
            colorBlock.style.cursor = "default";
        });

        // Add click event listener to copy color code to clipboard and show "Copied!" message
        colorBlock.addEventListener("click", async () => {
            await navigator.clipboard.writeText(sortedColors[i]);
            colorCodeSpan.textContent = "Copied!";
            setTimeout(() => {
                colorCodeSpan.textContent = sortedColors[i];
            }, 2500);
        });

        colorBlock.appendChild(colorCodeSpan);
        colorsContainer.appendChild(colorBlock);
    }
}



// Wait for the page to fully load before executing the following code
window.addEventListener("load", function () {
    // Get the loading indicator element and hide it
    const loading = document.getElementById("loading-dots");
    loading.style.display = "none";

    // Show the loading indicator
    loading.style.display = "block";

    // Query the active tab in the current window and send a message to get the colors
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            { type: "getColors" },
            function (colors) {
                console.log(colors);
                renderColors(colors);
                loading.style.display = "none";
            }
        );
    });
});

// Sorts colors by frequency and displays the top five colors 
function renderColors(colors) {
    // Empty out the colors container
    const colorsContainer = document.getElementById("output");
    colorsContainer.innerHTML = "";

    if (colors == null || !colors.length) {
        colorsContainer.innerHTML = `<div style="border: 1px solid; margin: 10px 0px; padding: 15px; color: #D8000C; background-color: #FFBABA;">Unable to find colors!</div>`;
        return;
    }

    // Sort the colors by frequency
    const colorCounts = {};
    colors.forEach((color) => {
        colorCounts[color] = (colorCounts[color] || 0) + 1;
    });
    const sortedColors = Object.keys(colorCounts).sort(
        (a, b) => colorCounts[b] - colorCounts[a]
    );

    // Create blocks of the most frequent colors
    console.log("[Popup Script] Sorted Colors: ", sortedColors)
    for (let i = 0; i < sortedColors.length; i++) {
        const colorBlock = document.createElement("color-block");
        colorBlock.setAttribute("code", sortedColors[i])
        colorsContainer.appendChild(colorBlock);
    }
}

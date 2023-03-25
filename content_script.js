// Regular expression to match colors in CSS
const colorRegex = /#([0-9a-f]{3}){1,2}\b|\b((rgb|hsl)a?\([\d\s%,.]+\))/gi;

// Array to store the color values
const colors = [];

// Function to convert RGB color to HEX format
function rgbToHex(rgb) {
    const rgbValues = rgb.match(/\d+/g);
    const r = parseInt(rgbValues[0]);
    const g = parseInt(rgbValues[1]);
    const b = parseInt(rgbValues[2]);
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Get all the link elements on the page
const links = document.getElementsByTagName('link');

// Loop through the links and process the CSS files
for (let i = 0; i < links.length; i++) {
    const link = links[i];
    // Only process link elements with rel="stylesheet"
    if (link.rel === 'stylesheet') {
        // Use the Fetch API to fetch the CSS file
        fetch(link.href)
            .then(response => response.text())
            .then(cssText => {
                // Parse the CSS file and process it
                const colorValues = cssText.match(colorRegex);
                if (colorValues) {
                    colorValues.forEach(colorValue => {
                        // Check if the color is in RGB format
                        if (colorValue.startsWith("rgb")) {
                            const hexValue = rgbToHex(colorValue);
                            colors.push(hexValue);
                        } else {
                            colors.push(colorValue);
                        }
                    });
                }

                //console.log(`FROM CONTENT SCRIPT: ${colors}`)
                chrome.runtime.sendMessage({ 'method': 'setColors', 'colors': colors });
            })
            .catch(error => {
                console.error('Error fetching CSS file:', error);
            });
    }
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    switch (message.type) {
        case "getColors":
            getColors().then((colors) => {
                sendResponse(Array.from(colors));
            });
            return true; // Return true to indicate that sendResponse will be called asynchronously
        default:
            console.error("Unrecognized message: ", message);
    }
});

// Function to convert RGB color to HEX format
function rgbToHex(rgb) {
    const rgbValues = rgb.match(/\d+/g);
    const r = parseInt(rgbValues[0]);
    const g = parseInt(rgbValues[1]);
    const b = parseInt(rgbValues[2]);
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Function to convert HSL color to HEX format
function hslToHex(hsl) {
    const hslValues = hsl.match(/\d+/g);
    const h = parseInt(hslValues[0]);
    const s = parseInt(hslValues[1]) / 100;
    const l = parseInt(hslValues[2]) / 100;
    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        const hueToRgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hueToRgb(p, q, h / 360 + 1 / 3);
        g = hueToRgb(p, q, h / 360);
        b = hueToRgb(p, q, h / 360 - 1 / 3);
    }

    const toHex = (c) => {
        const hex = Math.round(c * 255).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };

    return "#" + toHex(r) + toHex(g) + toHex(b);
}

// Function that converts HEX value to 6 hex
function standardizeHex(hex) {
    let one = hex[1];
    let two = hex[2];
    let three = hex[3];
    return (hex.length == 7) ? hex : `#${one}${one}${two}${two}${three}${three}`;
}


function getColors() {
    // Regular expression to match colors in CSS
    const colorRegex = /#([0-9a-f]{3}){1,2}\b|\b((rgb|hsl)a?\([\d\s%,.]+\))/gi;

    // Array to store the color values
    const colors = new Set();

    // Get all the link elements on the page
    const links = document.getElementsByTagName("link");

    // Array of Promises to fetch the CSS files and extract the color values
    const fetchPromises = [];

    // Loop through the links and process the CSS files
    for (let i = 0; i < links.length; i++) {
        const link = links[i];
        // Only process link elements with rel="stylesheet"
        if (link.rel === "stylesheet") {
            const fetchPromise = fetch(link.href)
                .then((response) => response.text())
                .then((cssText) => {
                    // Parse the CSS file and process it
                    const colorValues = cssText.match(colorRegex);
                    if (!colorValues) return;

                    colorValues.forEach((colorValue) => {
                        // Check if the color is in RGB format
                        let hexValue;
                        if (colorValue.startsWith('rgb')) { hexValue = rgbToHex(colorValue); }
                        else if (colorValue.startsWith('hsl')) { hexValue = hslToHex(colorValue); }
                        else { hexValue = standardizeHex(colorValue); }
                        colors.add(hexValue);
                    });
                })
                .catch((error) => {
                    console.error("Error fetching CSS file:", error);
                });
            fetchPromises.push(fetchPromise);
        }
    }

    // Return a Promise that resolves when all the CSS files have been fetched and color values extracted
    return Promise.all(fetchPromises).then(() => {
        console.log("From Content Script");
        console.log(colors);
        return colors;
    });
}

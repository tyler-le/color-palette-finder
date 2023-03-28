chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    switch (message.type) {
        case "getColors":
            getColors().then((colors) => {
                sendResponse(colors);
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

// Function that converts HEX value to 6 digit hex
function standardizeHex(hex) {
    let one = hex[1];
    let two = hex[2];
    let three = hex[3];
    return hex.length == 7 ? hex : `#${one}${one}${two}${two}${three}${three}`;
}

function fetchResource(input, init) {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ input, init }, messageResponse => {
            const [response, error] = messageResponse;
            if (response === null) {
                reject(error);
            } else {
                // Use undefined on a 204 - No Content
                const body = response.body ? new Blob([response.body]) : undefined;
                resolve(new Response(body, {
                    status: response.status,
                    statusText: response.statusText,
                }));
            }
        });
    });
}


async function getColors() {

    // Regular expression to match colors in CSS
    const colorRegex = /#([0-9a-f]{3}){1,2}\b|\b((rgb|hsl)a?\([\d\s%,.]+\))/gi;

    // Array to store the color values
    const colors = [];

    // Get all the link elements on the page
    const links = document.getElementsByTagName("link");

    // Loop through the links and process the CSS files
    for (let i = 0; i < links.length; i++) {
        const link = links[i];
        // Only process link elements with rel="stylesheet"
        if (link.rel === "stylesheet") {
            try {
                // Fetch the CSS file text
                const response = await fetchResource(link.href);
                const cssText = await response.text();

                // Parse the CSS file and look for color values
                const colorValues = cssText.match(colorRegex);

                if (colorValues === null || !colorValues.length) {
                    console.warn(
                        "[Content Script] This specific CSS file does not have any colors!" +
                        link.href
                    );
                    continue;
                }

                // Convert color code to HEX and store in 'colors' array
                colorValues.forEach((colorValue) => {
                    // Check if the color is in RGB format
                    let hexValue = colorValue.startsWith("rgb")
                        ? rgbToHex(colorValue)
                        : colorValue.startsWith("hsl")
                            ? hslToHex(colorValue)
                            : standardizeHex(colorValue);

                    colors.push(hexValue);
                });
            } catch (error) {
                console.error("[Content Script] Error fetching CSS file:", error);
            }
        }
    }

    console.log("[Content Script] Colors:");
    console.log(colors);
    return colors;
}

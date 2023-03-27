class ColorBlock extends HTMLElement {
    constructor() {
        super();

        // Create shadow DOM
        const shadow = this.attachShadow({ mode: "open" });

        // Create div element for the color block
        const colorBlock = document.createElement("div");

        // Set the style properties of the color block
        colorBlock.style.width = "50px";
        colorBlock.style.height = "50px";
        colorBlock.style.margin = "5px";
        colorBlock.style.border = "1px solid black";
        colorBlock.style.position = "relative";
        colorBlock.style.cursor = "pointer";
        colorBlock.style.padding = "15px";

        // Create span element for the color code
        const colorCodeSpan = document.createElement("span");

        // Set the style properties of the span inside the block
        colorCodeSpan.style.position = "absolute";
        colorCodeSpan.style.top = "50%";
        colorCodeSpan.style.left = "50%";
        colorCodeSpan.style.transform = "translate(-50%, -50%)";
        colorCodeSpan.style.fontWeight = "bold";
        colorCodeSpan.style.fontSize = "12px";
        colorCodeSpan.style.opacity = 1;


        // Append the color block and color code span to the shadow DOM
        colorBlock.appendChild(colorCodeSpan);
        shadow.appendChild(colorBlock);
    }


    // connectedCallback function called when the element is added to the DOM
    connectedCallback() {
        // Get the color code from the "code" attribute of the element
        var colorCode = this.attributes.code.value

        // Get the color block and set its background color to the color code
        const colorBlock = this.shadowRoot.querySelector('div')
        colorBlock.style.backgroundColor = colorCode;

        // Get the color code span and set its text content to the color code
        const colorCodeSpan = colorBlock.querySelector("span");
        colorCodeSpan.textContent = colorCode;

        // Calculate perceived brightness of color and set text color accordingly
        const [red, green, blue] = colorBlock.style.backgroundColor.match(/\d+/g);
        const perceivedBrightness = Math.sqrt(
            0.299 * red ** 2 + 0.587 * green ** 2 + 0.114 * blue ** 2
        );
        const textColor = perceivedBrightness <= 130 ? "#fff" : "#000";
        colorCodeSpan.style.color = textColor;

        // Add mouseover and mouseout event listeners to show/hide color code and change cursor
        colorBlock.addEventListener("mouseover", () => {
            colorBlock.style.cursor = "pointer";
            colorBlock.style.opacity = 0.65;
        });

        colorBlock.addEventListener("mouseout", () => {
            colorBlock.style.cursor = "default";
            colorBlock.style.opacity = 1;
            colorCodeSpan.textContent = colorCode;
        });

        // Add click event listener to copy color code to clipboard and show "Copied!" message
        colorBlock.addEventListener("click", async () => {
            await navigator.clipboard.writeText(colorCode);
            colorCodeSpan.textContent = "Copied!";
        });
    }
}

// Define the custom element
customElements.define("color-block", ColorBlock);


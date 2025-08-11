
### **Requirements Document: Property Flyer Generator**

**1. Introduction**

*   **1.1. Purpose:** This document outlines the functional and non-functional requirements for a web application, the "Property Flyer Generator." The application will empower internal employees to autonomously create professional and printable property flyers from a property's website URL.
*   **1.2. Scope:** The project entails the development of a single-page application using Next.js (React) and Tailwind CSS. The application's primary function will be to accept a URL, extract a key image, generate a QR code, and assemble these elements into a pre-designed flyer. The final flyer will be available for direct printing or as a downloadable PDF.
*   **1.3. Target Audience:** Internal employees who need a quick and efficient way to generate marketing materials for properties without requiring design skills.

**2. Overall Description**

*   **2.1. User Persona:** The primary user is an "Internal Employee" looking for an intuitive, fast, and reliable tool to create property flyers.
*   **2.2. Core User Story:** As an internal employee, I want to input a property's website URL into a simple web interface, so that I can instantly receive a high-quality, printable flyer featuring the property's main image and a QR code linking back to the provided URL.

**3. Design & UI Specifications (Source of Truth)**

All visual elements, including layout, colors, typography, and spacing, must be implemented in exact accordance with the provided Figma designs.

*   **Initial Page View:** [Figma Link](https://www.figma.com/design/YrNFBXfdVAlcPtGMAFZhLI/Figma-MCP---AI-training?node-id=17-256&t=wA6iAcQ8foSnM0To-11)
*   **Generated Flyer View:** [Figma Link](https://www.figma.com/design/YrNFBXfdVAlcPtGMAFZhLI/Figma-MCP---AI-training?node-id=16-122&t=wA6iAcQ8foSnM0To-11)
*   **Flyer Template:** [Figma Link](https://www.figma.com/design/YrNFBXfdVAlcPtGMAFZhLI/Figma-MCP---AI-training?node-id=14-202&t=wA6iAcQ8foSnM0To-11)

**4. Functional Requirements**

*   **4.1. Web Interface & User Interaction**
    *   **Initial State (per Figma):**
        *   The application shall load a single page with a centered content area.
        *   A main heading "Property Flyer Generator" must be displayed at the top.
        *   Below the heading, an input field for the URL must be present with the placeholder text "Enter property URL".
        *   A button with the text "Generate flyer" must be present below the input field.
    *   **Flyer Generation Trigger:**
        *   The flyer generation process is initiated when the user clicks the "Generate flyer" button.
        *   The button should have a loading or disabled state while the flyer is being generated.
    *   **Generated Flyer Display (per Figma):**
        *   After generation, the interface will update to display the created flyer prominently.
        *   Below the displayed flyer, two buttons must be visible: "Download PDF" and "Print".
    *   **Error Handling:**
        *   If the user enters text that is not a valid URL (e.g., "htp:/invalid" or "just text"), the application must display a descriptive error message below the input field, such as "Please enter a valid URL."
        *   If the URL is valid but the page cannot be reached or an image cannot be extracted, a different descriptive error should appear, such as "Could not retrieve data from the provided URL. Please check the link and try again."

*   **4.2. Image Extraction**
    *   The system must programmatically fetch the main image from the provided URL.
    *   The selection of the "main image" should prioritize high-quality images. The recommended logic is:
        1.  Check for a social media `og:image` meta tag.
        2.  If not found, check for a `twitter:image` meta tag.
        3.  If no social meta tags are present, parse the HTML for `<img>` tags and select the one with the largest dimensions (width x height).
    *   **Image Scaling:** The extracted image must fill the entire designated image area in the flyer template. It should be scaled proportionally to cover the area without being stretched, skewed, or distorted (equivalent to `background-size: cover`).

*   **4.3. QR Code Generation**
    *   A QR code must be generated that encodes the exact URL provided by the user in the input field.

*   **4.4. Flyer Composition (per Figma)**
    *   The flyer must be composed as a portrait-oriented A4 document.
    *   The top portion of the flyer will be entirely filled by the extracted property image.
    *   The bottom portion will have a white background and contain the generated QR code, aligned to the right.

*   **4.5. Output and Printing**
    *   **PDF Download:** Clicking the "Download PDF" button will generate and save a high-quality PDF of the flyer to the user's device.
    *   **Direct Printing:** Clicking the "Print" button will open the browser's native print dialog, pre-loaded with the generated flyer for direct printing.

**5. Technical Stack & Architecture**

*   **Framework:** Next.js (This is recommended to handle the web scraping and image extraction on the server-side via an API route, which will prevent browser-based CORS issues.)
*   **Styling:** Tailwind CSS (configured to use the colors, fonts, and spacing from the Figma Design System).

**6. Testing & Validation**

*  The application's generic URL parsing and image extraction functionality should be validated using a sample set of diverse URLs. The following links are examples for this testing phase and do not represent a finite or exhaustive list. The success of the tool depends on its ability to handle URLs beyond this list.
    *   `https://arthemisiarhemes.vacation-bookings.com/`
    *   `https://alpenpilaresidence.vacation-bookings.com/`
    *   `https://villamitpool-wien.vacation-bookings.com/`
    *   `https://casinanapoleonica.vacation-bookings.com/`
    *   `https://waldliesel.holiduhost.com/`
    *   `https://alpalmentorelais.holiduhost.com/`
    *   `https://boutiquehotelcanyamel.holiduhost.com/`

**7. Non-Functional Requirements**

*   **Performance:** The flyer generation process (from button click to display) should complete within 5-7 seconds.
*   **Usability:** The interface must be intuitive, requiring no instructions for a user to successfully generate a flyer.
*   **Browser Compatibility:** The application must be fully functional on the latest stable versions of Google Chrome, Mozilla Firefox, Apple Safari, and Microsoft Edge.

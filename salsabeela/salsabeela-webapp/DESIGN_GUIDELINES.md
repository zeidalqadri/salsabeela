# Salsabeela Web App - Frontend Design Guidelines

This document outlines the design principles and visual guidelines for the Salsabeela Quran Explorer web application frontend.

## 1. Design Philosophy

*   **Clarity & Readability:** Prioritize clear presentation of Arabic text and associated data. Ensure high legibility through appropriate typography and spacing.
*   **Simplicity & Focus:** Maintain a clean, uncluttered interface. Minimize visual noise to allow users to focus on interacting with the Quranic data.
*   **Respectful Aesthetic:** Employ a calm, considered visual style suitable for the sacred nature of the content. Avoid overly flashy or distracting elements.
*   **Accessibility:** Strive for WCAG AA compliance. Ensure good color contrast, keyboard navigability, semantic HTML, and clear focus states.
*   **Responsiveness:** Design should adapt gracefully to various screen sizes (desktop, tablet, mobile).

## 2. Layout & Grid

*   **Basic Structure:** Header, Main Content Area (Controls, Results), Footer.
*   **Main Content Layout:** Single-column layout for simplicity, clearly separating control inputs from the results display.
*   **Spacing:** Use consistent spacing units (e.g., based on `rem`) for margins, padding, and gaps. (Initial CSS uses `rem` and `gap`).
*   **Responsiveness:** Basic media query included in `style.css` for smaller screens, stacking controls vertically. Further refinement may be needed.

## 3. Color Palette (Initial - Light Mode)

*   **Background:** `#f8f9fa` (Very light gray)
*   **Content Background (Results):** `#ffffff` (White)
*   **Primary Text:** `#212529` (Near black)
*   **Secondary Text / Labels:** `#495057` (Dark gray)
*   **Muted Text / Borders:** `#6c757d`, `#ced4da`, `#dee2e6`, `#e9ecef` (Grays)
*   **Primary Button Background:** `#6c757d` (Gray)
*   **Primary Button Text:** `#ffffff` (White)
*   **Accent Color:** (To be defined - could be used for focus states or highlights)

*Note: A Dark Mode palette needs to be defined.*

## 4. Typography

*   **Arabic Font (Results):** `Noto Naskh Arabic` (specified in `style.css`, ensure font is available/imported) or similar high-quality Arabic font.
    *   Size: `1.4em` (relative to base)
    *   Line Height: `1.8`
*   **UI Font (Latin):** System default sans-serif stack specified in `style.css` (`-apple-system`, `BlinkMacSystemFont`, `"Segoe UI"`, `Roboto`, etc.).
    *   Base Size: `1rem` (typically 16px)
*   **Hierarchy:**
    *   `h1` (Header): Larger size, lighter weight (`300`).
    *   `h2` (Section Titles): Medium size, normal weight (`400`), muted color.
    *   Labels: Slightly smaller size (`0.9em`).
    *   Body/Input Text: Base size.

## 5. Component Styles (Initial)

*   **Inputs/Select:** Simple border, padding, rounded corners.
*   **Buttons:** Solid background, white text, rounded corners, hover effect.
*   **Results Area:** White background, padding, border, `direction: rtl`, specific Arabic font styles.

*Note: Styles for loading states, error messages, and potentially more complex result displays (like tables for analysis) need to be defined.*

## 6. Iconography

*   (To be defined) - Recommend a minimal set like Feather Icons or Material Symbols if needed for buttons or indicators.

## 7. Accessibility

*   **Contrast:** Ensure text and UI elements meet WCAG AA contrast ratios against their backgrounds (needs verification, especially if colors change).
*   **Semantics:** Use appropriate HTML tags (`header`, `main`, `section`, `label`, `button`, etc.).
*   **Keyboard Navigation:** Ensure all interactive elements are reachable and operable via keyboard.
*   **Focus States:** Define clear visual focus indicators for interactive elements.
*   **RTL Support:** `dir="rtl"` is set on the results area. Ensure layout and components work correctly in RTL context.

## 8. Responsiveness

*   Basic single-column stacking implemented for controls below 600px width.
*   Further testing and refinement needed for various device sizes.

*This is a starting point. These guidelines should be expanded and refined as the application is developed.*

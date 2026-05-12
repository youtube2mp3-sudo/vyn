# Portfolio Template Documentation

Welcome to the comprehensive guide for your new portfolio website. This document covers everything from initial setup to advanced customization and deployment.

---

## 📚 Table of Contents
1. [Getting Started](#getting-started)
2. [File Structure](#file-structure)
3. [Customization Guide](#customization-guide)
    - [Global Styles & Colors](#global-styles--colors)
    - [Typography](#typography)
    - [Editing Content](#editing-content)
    - [Working with Images](#working-with-images)
4. [Advanced Features](#advanced-features)
    - [Dark Mode Logic](#dark-mode-logic)
    - [SEO Optimization](#seo-optimization)
5. [Deployment](#deployment)
6. [Troubleshooting](#troubleshooting)

---

## 🚀 Getting Started

This template is built with **Vanilla HTML, CSS, and JavaScript**. There are no build steps, no package managers (npm/yarn), and no framework dependencies.

### Installation
1.  **Download/Unzip** the template files.
2.  Open the folder in your code editor (VS Code recommended).
3.  Double-click `index.html` to open it in your browser.
    *   *Tip: Use the "Live Server" extension in VS Code for real-time updates.*

---

## 📂 File Structure

The project uses a **flat file structure** for simplicity. All files are located in the root directory.

```text
/
├── index.html          # Main HTML structure and content
├── style.css           # Core styles, design tokens, and layout
├── style_additions.css # Extra styles (e.g., animations, specific component overrides)
├── script.js           # JavaScript for interactions (mobile menu, theme toggle)
├── man.jpg             # Placeholder hero image
├── project.jpg         # Placeholder project image
├── README.md           # Quick start guide
├── ERROR_LOG.md        # Troubleshooting and issue reporting
└── DOCUMENTATION.md    # This file
```

---

## 🎨 Customization Guide

### Global Styles & Colors
All visual styles are controlled by CSS variables in `style.css`. To change the color scheme:

1.  Open `style.css`.
2.  Locate the `:root` selector at the top of the file.
3.  Update the HSL values for the variables.

```css
:root {
    /* Base Background Colors */
    --color-bg: hsl(140, 60%, 98%);       /* Light Mint Green */
    
    /* Brand Accent Colors */
    --color-primary: hsl(340, 82%, 52%);  /* Hot Pink */
    --color-secondary: hsl(150, 50%, 45%); /* Darker Green */
    
    /* Text Colors */
    --color-text: hsl(150, 30%, 20%);     /* Dark Green/Gray */
}
```

### Typography
The template uses Google Fonts (`Outfit`). To change the font:
1.  Go to [Google Fonts](https://fonts.google.com/).
2.  Select your desired font.
3.  Replace the `@import` URL at the top of `style.css` with the new one.
4.  Update the `font-family` property in the `body` selector in `style.css`.

### Editing Content
All text content is located in `index.html`. 
- **Navigation**: Search for `<nav>` to change links.
- **Hero Section**: Look for `<header class="hero">` to update the headline and bio.
- **Projects**: Find the `<section id="projects">` block. Duplicate the `.project-card` div to add more projects.

### Working with Images
**To replace the Hero image:**
1.  Place your photo (e.g., `my-photo.jpg`) in the root folder.
2.  Open `index.html`.
3.  Find the `<img>` tag in the hero section and update the `src`.
    ```html
    <img src="my-photo.jpg" alt="A photo of me">
    ```

**To replace Project images:**
1.  Place your project screenshot (e.g., `app-design.jpg`) in the root folder.
2.  Update the `style="background-image: url(...)"` inline style or the `<img>` tag within the `.project-card`.

---

## ⚡ Advanced Features

### Dark Mode Logic
The dark mode toggle works by adding a `.dark-mode` class to the `<body>`.
- **Logic**: Defined in `script.js`. It saves the user's preference to `localStorage`.
- **Styles**: Defined in `style.css` under the `body.dark-mode` selector.
    ```css
    body.dark-mode {
        --color-bg: hsl(220, 20%, 10%); /* Dark Background */
        --color-text: hsl(220, 20%, 90%); /* Light Text */
    }
    ```

### SEO Optimization
To make your site Google-friendly:
1.  Open `index.html`.
2.  Update the `<title>` tag with your name and profession.
3.  Update the `<meta name="description">` tag with a brief summary of who you are.
    ```html
    <meta name="description" content="Portfolio of John Doe, a Product Designer based in NYC.">
    ```

---

## 🌍 Deployment

You can host this site for free on many platforms.

### Option 1: Netlify (Recommended)
1.  Create an account on [Netlify](https://www.netlify.com/).
2.  Drag and drop your project folder onto the Netlify dashboard.
3.  Your site will be live instantly!

### Option 2: GitHub Pages
1.  Upload your files to a new GitHub repository.
2.  Go to **Settings > Pages**.
3.  Select the `main` branch and click **Save**.

---

## 🔧 Troubleshooting

If something isn't working right, please check our [Error Log & Troubleshooting Guide](ERROR_LOG.md). 

Common fixes include:
- **Missing Images**: Check file names and extensions (case-sensitive!).
- **Cached Styles**: Hard refresh your browser (Ctrl+F5).

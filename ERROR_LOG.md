# Error Log & Troubleshooting Guide

This document lists common issues you might encounter while using this portfolio template and how to resolve them.

## Common Issues

### 1. Images Not Loading
**Problem:** Images appear as broken icons or alt text.
**Potential Causes:**
- Incorrect file path in `index.html`.
- Image file is missing from the root directory.
- Case sensitivity issues (e.g., `Man.jpg` vs `man.jpg`).
**Solution:**
- Ensure the image file exists in the same folder as `index.html` (this template uses a flat file structure).
- Check the `src` attribute in `index.html`. It should look like `src="man.jpg"`.
- Verify the file extension matches exactly (.jpg vs .jpeg vs .png).

### 2. Styles Not Updating
**Problem:** You made changes to `style.css` or `style_additions.css` but they aren't showing up.
**Potential Causes:**
- Browser caching.
- Syntax error in CSS.
**Solution:**
- Hard refresh the page (Ctrl+F5 or Cmd+Shift+R).
- Check the browser console for any errors (F12 > Console).
- Validate your CSS syntax.

### 3. Dark Mode Toggle Not Working
**Problem:** Clicking the theme toggle button does nothing.
**Potential Causes:**
- `script.js` is not linked correctly.
- JavaScript is disabled in the browser.
**Solution:**
- Ensure `<script src="script.js"></script>` is present at the end of the `<body>` tag in `index.html`.
- Check the browser console for JavaScript errors.

### 4. Custom Fonts Not Showing
**Problem:** The Google Fonts (Outfit) are not displaying.
**Potential Causes:**
- No internet connection (fonts are loaded from Google CDN).
- Import URL in CSS is modified or removed.
**Solution:**
- Ensure you have an active internet connection.
- Check `style.css` for the `@import` line at the top.

## Report an Issue

If you encounter an error not listed above, please document it below to keep track of your findings or to prepare for support.

### User Error Report Form

**Date:** [Enter Date]
**Browser & Version:** [e.g., Chrome 120.0, Safari 17.0]
**OS:** [e.g., Windows 11, macOS Sonoma]
**Device:** [e.g., Desktop, iPhone 14]

**Description of the Issue:**
[Describe what you were trying to do and what went wrong]

**Error Message (if any):**
[Copy any error message from the browser console (F12 > Console)]

**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Screenshot (Optional):**
[Attach or link a screenshot here if possible]

---
*Note: This file is for your personal tracking of issues. If you are contacting support, please copy the details from the "User Error Report Form" above.*

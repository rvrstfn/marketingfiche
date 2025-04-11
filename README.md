# Marketing Fiche Generator - Modular Version

This is a modular version of the Marketing Fiche Generator app that runs entirely in the browser without requiring Python installation.

## Features

- Same functionality as the original app
- Three-phase system: Technical → Analysis → Marketing
- Uses OpenAI API directly from the browser
- Markdown formatting support
- Chat history management
- Local storage for API key
- Modular code architecture for better maintainability

## How to Use

1. Unzip this folder
2. Open the `index.html` file in any modern web browser
3. Enter your OpenAI API key when prompted
4. Switch between phases using the buttons at the top
5. Type your messages in the input box and press Send

## Project Structure

- `index.html` - Main HTML structure
- `css/styles.css` - All styling for the application
- `js/`
  - `config.js` - Contains system prompts and application settings
  - `api.js` - Handles OpenAI API communication
  - `ui.js` - UI helper functions
  - `app.js` - Main application logic

## Requirements

- A modern web browser (Chrome, Firefox, Edge, or Safari)
- An internet connection
- An OpenAI API key with access to:
  - GPT-4o (for Technical and Marketing phases)
  - o3-mini (for Analysis phase)

## Privacy

- Your API key is stored locally in your browser's local storage
- No data is sent to any server other than OpenAI's API
- All processing happens in your browser

## Debugging

The app includes extensive console logging. To view the logs:
1. Open your browser's developer tools (F12 or right-click → Inspect)
2. Navigate to the Console tab
3. Observe the detailed logs as you interact with the app
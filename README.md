# MyMyApps - Firefox Extension

**Firefox port of the original Chrome extension by baukburg@gmail.com**

Original Chrome Extension: [MyMyApps](https://chromewebstore.google.com/detail/mymyapps/bcoigfjmifckcplmaloeekdfmbjmpohb)

A Firefox extension for easily accessing and managing your Microsoft MyApps links. Automatically fetches and displays your app links with search and keyboard navigation functionality.

## Features

- **Automatic Link Extraction**: Extracts your Microsoft MyApps links when you visit myapps.microsoft.com
- **Search Functionality**: Quickly find apps by typing to filter the list
- **Keyboard Navigation**: Use arrow keys, Page Up/Down, and Enter to navigate
- **Popup Interface**: Clean, responsive interface for accessing your apps
- **Auto-refresh**: Automatically refreshes stale data (older than 24 hours)

## How It Works

1. **Data Extraction**: When you visit `https://myapps.microsoft.com/refreshapps`, the content script automatically extracts your app links from the page's localStorage
2. **Local Storage**: App links are stored locally in the extension for quick access
3. **Search & Navigate**: Use the popup to search and navigate through your apps
4. **Direct Access**: Click or press Enter to open apps in new tabs

## File Structure

```
├── manifest.json          # Extension manifest (Firefox format)
├── background.js          # Background script for window management
├── content.js            # Content script for data extraction
├── popup.html            # Popup interface
├── popup.css             # Popup styles
├── popup.js              # Popup functionality
├── icon.png              # Extension icon
└── README.md             # This file
```

## Installation

### Loading in Firefox (Development)

1. Open Firefox and navigate to `about:debugging`
2. Click "This Firefox" in the sidebar
3. Click "Load Temporary Add-on"
4. Select the `manifest.json` file from this directory

### First Use

1. Click the MyMyApps extension icon in your toolbar
2. Click "Refresh from MyApps" to extract your app links
3. The extension will open a background tab to myapps.microsoft.com
4. Once extraction is complete, you'll see your apps in the popup

## Usage

### Search Apps
- Type in the search box to filter apps by name
- Search is case-insensitive and matches partial text

### Keyboard Navigation
- **Arrow Up/Down**: Navigate through apps one by one
- **Page Up/Down**: Jump 10 apps at a time
- **Enter**: Open the selected app in a new tab

### Refresh Data
- Click "Refresh from MyApps" to get updated app links
- Data automatically refreshes if older than 24 hours
- Refresh is required if you have new apps added to your Microsoft account

## Key Differences from Chrome Version

- Uses `browser.*` API instead of `chrome.*`
- Promise-based async operations
- Firefox manifest v2 format
- Adjusted permissions for Firefox compatibility

## Permissions

- **storage**: Store app links locally
- **tabs**: Create background tabs for data extraction

## Troubleshooting

### No Apps Showing
1. Make sure you're signed in to your Microsoft account
2. Visit myapps.microsoft.com directly to ensure you have apps assigned
3. Try clicking "Refresh from MyApps" in the extension popup

### Apps Not Updating
- Click "Refresh from MyApps" to get the latest app list
- Clear the extension's storage data and refresh

### Extension Not Working
- Check Firefox developer console for errors
- Ensure you have proper permissions to access myapps.microsoft.com
- Try reloading the extension in about:debugging

## Development

### Testing
1. Load the extension as a temporary add-on
2. Visit `https://myapps.microsoft.com/refreshapps` to test content script
3. Open the popup to test the interface and search functionality

### Debugging
- Use Firefox Developer Tools for popup debugging
- Check the Browser Console for background script logs
- Content script logs appear in the web page's console

## Version History

- **v1.1**: Ported from Chrome extension with Firefox compatibility
- Full search and keyboard navigation
- Automatic data extraction and refresh

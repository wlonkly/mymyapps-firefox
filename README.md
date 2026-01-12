# MyMyApps - Firefox Extension

**Firefox port of the original Chrome extension by baukburg@gmail.com**

Original Chrome Extension: [MyMyApps](https://chromewebstore.google.com/detail/mymyapps/bcoigfjmifckcplmaloeekdfmbjmpohb)

A Firefox extension for easily accessing and managing your Microsoft MyApps links. Automatically fetches and displays your app links with search and keyboard navigation functionality.

## Installation

1. Go to the 

### First Use

1. Click the MyMyApps extension icon in your toolbar
2. Click "Refresh from MyApps" to extract your app links
3. The extension will open a background tab to myapps.microsoft.com
4. Once extraction is complete, you'll see your apps in the popup

## Usage

### Opening the Extension
- Click the MyMyApps extension icon in your toolbar, or
- Use the keyboard shortcut **Alt+Shift+M** to open/close the popup

You can customize this keyboard shortcut in Firefox:
1. Navigate to `about:addons`
2. Click the gear icon and select "Manage Extension Shortcuts"
3. Find MyMyApps and set your preferred shortcut

### Search Apps
- Type in the search box to filter apps by name
- Search is case-insensitive and matches partial text

### Keyboard Navigation
- **Arrow Up/Down**: Navigate through apps one by one
- **Page Up/Down**: Jump 10 apps at a time
- **Enter**: Open the selected app in a new tab

### Refresh Data
- Click "Refresh from MyApps" to manually get updated app links
- Data automatically updates when you visit myapps.microsoft.com
- Apps are cached indefinitely - no forced refresh on stale data

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

### Loading in Firefox (Development)

1. Open Firefox and navigate to `about:debugging`
2. Click "This Firefox" in the sidebar
3. Click "Load Temporary Add-on"
4. Select the `manifest.json` file from this directory

### Packaging for Distribution

To package the extension for submission to addons.mozilla.org:

1. Increment version in manifest.json

2. Merge your PR

3. Create a ZIP file containing only the necessary files:
   ```bash
   zip -r mymyapps-firefox.zip manifest.json background.js content.js popup.html popup.css popup.js icon.png -x ".*" -x "__MACOSX"
   ```
4. Submit to AMO

5. After AMO review, download signed zip file

6. Create a Github release for this version number w/ signed zip file

## Version History

- **v1.2**: Fixed forced refresh bug - apps now cache indefinitely
  - Removed 24-hour auto-refresh that required frequent manual refreshes
  - Apps persist until manually refreshed or updated via myapps.microsoft.com
- **v1.1**: Ported from Chrome extension with Firefox compatibility
  - Full search and keyboard navigation
  - Automatic data extraction and refresh

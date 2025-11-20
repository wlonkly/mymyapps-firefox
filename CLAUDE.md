# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MyMyApps is a Firefox extension (ported from Chrome) that extracts and manages Microsoft MyApps links. Users can search and navigate their enterprise applications through a popup interface.

## Development Commands

### Loading the Extension
```bash
# Open Firefox and navigate to about:debugging
# Click "This Firefox" → "Load Temporary Add-on" → Select manifest.json
```

### Testing
- Visit `https://myapps.microsoft.com/refreshapps` to test content script extraction
- Open Browser Console (Ctrl+Shift+J) for background script logs
- Right-click popup and select "Inspect Element" for popup debugging
- Content script logs appear in the web page console (F12 on myapps.microsoft.com)

## Architecture

### Three-Component System

1. **content.js** (Data Extraction)
   - Runs on `myapps.microsoft.com/refreshapps` when page loads
   - Polls `localStorage` for `tileLibrary` data updates (10-second timeout, 100ms intervals)
   - Waits for `storeTime` to change, indicating fresh data from Microsoft
   - Extracts app links (href, imgSrc, text) and saves to `browser.storage.local`

2. **popup.js** (UI & State Management)
   - Manages state: apps list, search query, selected index, filtered results
   - Caches apps indefinitely - never auto-refreshes or clears cache
   - Implements fuzzy search by text matching with prioritized results
   - Keyboard navigation: Arrow keys (±1), PageUp/Down (±10), Enter to open

3. **background.js** (Minimal)
   - Currently logs extension loading only
   - Can be extended for tab/window management if needed

### Data Flow
```
User clicks "Refresh" → popup.js opens background tab → content.js extracts localStorage
→ browser.storage.local updated → popup.js storage listener detects change
→ Updates UI and closes background tab
```

## Firefox-Specific Considerations

### API Differences from Chrome
- Use `browser.*` namespace (not `chrome.*`)
- All storage APIs return Promises (use `async/await` or `.then()`)
- Manifest v2 format (not v3)
- Use `browser_action` (not `action`)

### Key Implementation Details
- Storage listener pattern in popup.js:258-234 handles async data extraction
- Background tabs created with `active: false` to avoid disrupting user
- 10-second timeout fallback if extraction fails
- `scrollIntoViewIfNeeded` fallback for Firefox compatibility (popup.js:195-199)

## File Purposes

- **manifest.json**: Extension configuration, permissions (storage, tabs)
- **content.js**: Microsoft MyApps data extraction via localStorage polling
- **popup.js**: Search, keyboard navigation, state management, UI rendering
- **popup.html/css**: Extension popup interface
- **background.js**: Background service (currently minimal)
- **icon.png**: Extension icon (128x128)

## Common Development Scenarios

### Adding New App Properties
Modify content.js:42-46 to extract additional fields from `app` object in localStorage.

### Changing Refresh Behavior
Apps are cached indefinitely and only refresh when:
- User manually clicks "Refresh from MyApps"
- User visits myapps.microsoft.com (content script extracts new data)
To adjust polling timeout, modify MAX_TIME_TO_WAIT at content.js:4.

### Extending Keyboard Navigation
Add new key mappings to `keyMappings` object (popup.js:7-12) and handle in `handleKeydown`.

### Debugging Storage Issues
Use Firefox Storage Inspector (about:debugging → Inspect → Storage) to view `browser.storage.local` contents.

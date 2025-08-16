# Firefox Extension Development Notes

## Porting from Chrome Extension

When porting a Chrome extension to Firefox, keep these key differences in mind:

### API Differences

1. **Namespace**: Use `browser.*` instead of `chrome.*`
2. **Promises**: Firefox uses promise-based APIs, Chrome uses callbacks
3. **Manifest**: Firefox uses manifest v2, Chrome v3 has different structure

### Common Porting Steps

1. **Update manifest.json**:
   - Change `manifest_version` to 2
   - Use `browser_action` instead of `action`
   - Adjust permissions as needed

2. **Update JavaScript**:
   - Replace `chrome.*` with `browser.*`
   - Convert callbacks to async/await or .then()
   - Update event listeners

3. **Test thoroughly**:
   - Load in Firefox developer edition
   - Check console for errors
   - Verify all functionality works

### Resources

- [MDN WebExtensions API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions)
- [Porting Chrome Extensions](https://extensionworkshop.com/documentation/develop/porting-a-google-chrome-extension/)
- [Firefox Extension Workshop](https://extensionworkshop.com/)

## TODO

- [ ] Add actual icons (currently using placeholders)
- [ ] Implement your Chrome extension's specific functionality
- [ ] Test on multiple Firefox versions
- [ ] Submit to Firefox Add-ons store when ready

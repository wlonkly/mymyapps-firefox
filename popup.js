// Popup script for MyMyApps Firefox extension
// Handles the popup UI interactions

const MYAPPS_URL = "https://myapps.microsoft.com/refreshapps";

// Keyboard navigation mappings
const keyMappings = {
  ArrowDown: 1,
  ArrowUp: -1,
  PageDown: 10,
  PageUp: -10
};

// Simple search function (simplified version of Fuse.js functionality)
function searchApps(query, apps) {
  if (!query || query.length === 0) {
    return apps;
  }
  
  query = query.toLowerCase();
  return apps.filter(app => 
    app.text.toLowerCase().includes(query)
  ).sort((a, b) => {
    // Prioritize matches at the beginning of the text
    const aIndex = a.text.toLowerCase().indexOf(query);
    const bIndex = b.text.toLowerCase().indexOf(query);
    return aIndex - bIndex;
  });
}

// State management
let state = {
  windowId: null,
  isLoading: false,
  apps: [],
  searchQuery: "",
  selectedIndex: -1,
  filteredApps: []
};

// DOM elements
let elements = {};

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('Popup loaded');
  initializeElements();
  initializeState();
  setupEventListeners();
});

function initializeElements() {
  elements = {
    searchInput: document.getElementById('searchInput'),
    loading: document.getElementById('loading'),
    appList: document.getElementById('appList'),
    onboarding: document.getElementById('onboarding'),
    refreshWrapper: document.getElementById('refreshWrapper'),
    refreshButton: document.getElementById('refreshButton'),
    refreshButtonBottom: document.getElementById('refreshButtonBottom'),
    refreshLink: document.getElementById('refreshLink')
  };
}

async function initializeState() {
  try {
    // Load stored apps
    const result = await browser.storage.local.get(['storedLinks', 'timestamp']);
    state.apps = result.storedLinks || [];
    
    elements.searchInput.focus();
    
    // Check if we need to refresh (no apps or data is old)
    if (!state.apps.length || !result.timestamp || result.timestamp < Date.now() - 86400000) { // 24 hours
      await refreshFromMyApps(true); // Auto-refresh
    } else {
      updateDisplay();
    }
  } catch (error) {
    console.error('Error initializing popup:', error);
  }
}

function setupEventListeners() {
  // Search input
  elements.searchInput.addEventListener('input', handleSearchInput);
  
  // Refresh buttons
  elements.refreshButton.addEventListener('click', () => refreshFromMyApps(false));
  elements.refreshButtonBottom.addEventListener('click', () => refreshFromMyApps(false));
  elements.refreshLink.addEventListener('click', () => refreshFromMyApps(false));
  
  // Keyboard navigation
  window.addEventListener('keydown', handleKeydown);
}

function handleSearchInput(event) {
  state.searchQuery = event.target.value;
  state.selectedIndex = state.searchQuery ? 0 : -1;
  updateDisplay();
}

function handleKeydown(event) {
  if (keyMappings[event.key]) {
    event.preventDefault();
    const movement = keyMappings[event.key];
    const newIndex = Math.max(0, Math.min(state.selectedIndex + movement, state.filteredApps.length - 1));
    state.selectedIndex = newIndex;
    updateDisplay();
    scrollToSelected();
  } else if (event.key === 'Enter' && state.selectedIndex >= 0 && state.filteredApps[state.selectedIndex]) {
    event.preventDefault();
    openApp(state.filteredApps[state.selectedIndex]);
  }
}

function updateDisplay() {
  // Filter apps based on search query
  state.filteredApps = searchApps(state.searchQuery, state.apps);
  
  // Show/hide appropriate sections
  if (state.isLoading) {
    showLoading();
  } else if (state.apps.length > 0) {
    showAppList();
  } else {
    showOnboarding();
  }
}

function showLoading() {
  elements.loading.style.display = 'block';
  elements.appList.style.display = 'none';
  elements.onboarding.style.display = 'none';
  elements.refreshWrapper.style.display = 'none';
}

function showAppList() {
  elements.loading.style.display = 'none';
  elements.appList.style.display = 'block';
  elements.onboarding.style.display = 'none';
  elements.refreshWrapper.style.display = 'block';
  
  renderAppList();
}

function showOnboarding() {
  elements.loading.style.display = 'none';
  elements.appList.style.display = 'none';
  elements.onboarding.style.display = 'block';
  elements.refreshWrapper.style.display = 'none';
}

function renderAppList() {
  elements.appList.innerHTML = '';
  
  state.filteredApps.forEach((app, index) => {
    const linkElement = createAppElement(app, index === state.selectedIndex);
    elements.appList.appendChild(linkElement);
  });
}

function createAppElement(app, isSelected) {
  const linkElement = document.createElement('a');
  linkElement.className = isSelected ? 'link-row selected' : 'link-row';
  linkElement.href = app.href;
  linkElement.target = '_blank';
  linkElement.rel = 'noopener noreferrer';
  
  linkElement.addEventListener('click', (event) => {
    event.preventDefault();
    openApp(app);
  });
  
  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'link-image-wrapper';
  
  const image = document.createElement('div');
  image.className = 'link-image';
  image.style.backgroundImage = `url(${app.imgSrc})`;
  
  const nameElement = document.createElement('div');
  nameElement.className = 'link-name';
  nameElement.textContent = app.text;
  
  imageWrapper.appendChild(image);
  linkElement.appendChild(imageWrapper);
  linkElement.appendChild(nameElement);
  
  return linkElement;
}

function scrollToSelected() {
  const selectedElement = elements.appList.querySelector('.link-row.selected');
  if (selectedElement && selectedElement.scrollIntoViewIfNeeded) {
    selectedElement.scrollIntoViewIfNeeded();
  } else if (selectedElement) {
    selectedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function openApp(app) {
  browser.tabs.create({ url: app.href });
  window.close();
}

async function refreshFromMyApps(isAutoRefresh) {
  if (!isAutoRefresh) {
    state.isLoading = true;
    updateDisplay();
  }
  
  try {
    // In Firefox, we'll open a regular tab instead of a popup window
    // and monitor for the data extraction
    const tab = await browser.tabs.create({
      url: MYAPPS_URL,
      active: false // Open in background
    });
    
    state.windowId = tab.id;
    
    // Listen for storage changes (when content script extracts data)
    const storageListener = (changes, areaName) => {
      if (areaName === 'local' && changes.storedLinks) {
        state.isLoading = false;
        state.apps = changes.storedLinks.newValue || [];
        updateDisplay();
        
        // Clean up - close the tab
        browser.tabs.remove(state.windowId).catch(console.error);
        state.windowId = null;
        browser.storage.onChanged.removeListener(storageListener);
      }
    };
    
    browser.storage.onChanged.addListener(storageListener);
    
    // Fallback: if extraction doesn't work within 10 seconds
    setTimeout(() => {
      if (state.windowId) {
        state.isLoading = false;
        state.windowId = null;
        browser.storage.onChanged.removeListener(storageListener);
        
        // Don't close the tab automatically, let user interact with it
        browser.storage.local.set({ storedLinks: [], timestamp: Date.now() });
        
        updateDisplay();
      }
    }, 10000);
    
  } catch (error) {
    console.error('Error creating tab:', error);
    state.isLoading = false;
    updateDisplay();
  }
}

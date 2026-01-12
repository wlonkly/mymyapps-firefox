// Content script for MyMyApps Firefox extension
// Extracts Microsoft MyApps links from localStorage

const MAX_TIME_TO_WAIT = 10000;
const RETRY_DELAY = 100;

let previousMaxTime = null;
let counter = 0;

function attemptExtraction() {
  // find all tile libraries stored in local storage (probably only 1...)
  const tileLibraries = Object.entries(localStorage)
    .filter(([key, value]) => value.startsWith("{"))
    .map(([key, value]) => [key, JSON.parse(value)])
    .filter(([key, value]) => key.indexOf("tileLibrary") >= 0);

  // when this page is first loaded it'll likely be blank or a stale value...
  // it is going to refresh itself and write to localStorage.  we want to capture when that happens
  const maxTime = Math.max(
    0,
    ...tileLibraries.map(([key, value]) => {
      return new Date(value.storeTime);
    })
  );

  // so poll localStorage and see if the max storeTime we see is different than it was before
  if (
    (!previousMaxTime || previousMaxTime === maxTime) &&
    counter < MAX_TIME_TO_WAIT / RETRY_DELAY
  ) {
    // if it hasn't updated yet, try again in 100ms or so
    previousMaxTime = maxTime;
    counter++;
    console.log("rescheduling extraction");
    setTimeout(attemptExtraction, RETRY_DELAY);
    return;
  }

  // it's updated!  we can just grab this stuff from localStorage and use those links directly now
  const links = tileLibraries
    .map(([key, value]) => {
      return value.value.map((app) => ({
        href: app.persistentLaunchUrl,
        imgSrc: app.logoUrl,
        text: app.displayName,
      }));
    })
    .flat();

  console.log("MyMyApps: extraction complete. Found", links.length, "apps:", links);
  browser.storage.local.set({ storedLinks: links, timestamp: Date.now() });
}

attemptExtraction();

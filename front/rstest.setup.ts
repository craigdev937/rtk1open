/* jsdom ships no matchMedia, and the theme code asks it
for the OS colour scheme. Default to light. */
if (typeof window.matchMedia !== "function") {
    window.matchMedia = (query: string) => ({
        media: query,
        matches: false,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false
    }) as MediaQueryList;
}

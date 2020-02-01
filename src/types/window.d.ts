declare global {
  interface Window {
    ga: () => void;
    __INITIAL_DATA__: {
      settings: any;
      themeConfig: any;
    };
  }
}

export enum PageTypes {
  HOME = 'home',
  PAGE = 'page',
  POST = 'post',
  TAG = 'tag',
  TAGS = 'tags',
  PREVIEW = 'preview',
  ABOUT = 'about',
}

declare global {
  interface Window {
    Prism: any;
  }
}

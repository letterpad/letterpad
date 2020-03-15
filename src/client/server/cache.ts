class Cache {
  data: {};

  constructor() {
    this.data = {};
  }

  set(url: string, content: string) {
    this.data[url] = content;
  }

  get(url: string) {
    if (this.data[url]) {
      return this.data[url];
    }
    return false;
  }

  delete(url) {
    delete this.data[url];
  }

  has(url: string) {
    return this.data[url] ? true : false;
  }

  clear() {
    this.data = {};
  }
}

const cache = new Cache();

export default cache;

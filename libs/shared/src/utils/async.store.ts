import { AsyncLocalStorage } from 'async_hooks';

export interface IAsyncStore {
  requestId: string;
}

const KEY = 'PLEASE_WORK';

const storage = new AsyncLocalStorage<Map<string, object>>();

export class AsyncStore {
  static run(initialData: IAsyncStore, next: () => void): void {
    const map = new Map<string, object>();
    map.set(KEY, initialData);
    storage.run(map, next);
  }

  static set(value: Partial<IAsyncStore>): void {
    const store = storage.getStore();
    if (store) {
      const existing = store.get(KEY) || {};
      store.set(KEY, { ...existing, ...value });
    } else {
      // eslint-disable-next-line no-console
      console.log('no store - are you inside a .run() block?');
    }
  }

  static get(): IAsyncStore | undefined {
    const store = storage.getStore();
    return store?.get(KEY) as IAsyncStore;
  }
}

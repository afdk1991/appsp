/** 同步读写本地存储封装（H5 / App 通用） */
export function load<T>(key: string, fallback: T): T {
  try {
    const raw = uni.getStorageSync(key);
    if (raw === '' || raw === undefined || raw === null) return fallback;
    return raw as T;
  } catch {
    return fallback;
  }
}

export function save<T>(key: string, value: T): void {
  try {
    uni.setStorageSync(key, value);
  } catch (e) {
    console.warn('storage save failed', key, e);
  }
}

export function remove(key: string): void {
  try {
    uni.removeStorageSync(key);
  } catch {
    /* ignore */
  }
}

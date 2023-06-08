export class LocalStorageWrapper {
  public static get<T>(key: string) {
    try {
      const stored = localStorage.getItem(key)
      if (stored) {
        return JSON.parse(stored) as T
      }
      return null
    } catch (e) {
      console.error('[LCL STORAGE]', e)
    }
  }

  public static set<T>(key: string, value: T) {
    try {
      const stringified = JSON.stringify(value)

      localStorage.setItem(key, stringified)
    } catch (e) {
      console.error('[LCL STORAGE]', e)
    }
  }
}

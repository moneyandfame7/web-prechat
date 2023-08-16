export const timeout =
  <T>(t: number) =>
  (value: T) =>
    new Promise<T>((res) => {
      setTimeout(() => res(value), t)
    })

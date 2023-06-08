import { deepSignal } from 'deepsignal'

export const testStore = deepSignal({
  counter: 0,
  getCounterWithHello: () => {
    return testStore.counter + 'Hello worlf from store'
  },
  inc: () => {
    testStore.counter += 2
  }
})

export function getCounterWithHello() {
  return testStore.counter + 'Hello world'
}

export function increment() {
  testStore.counter += 5
}

export const testStoreSubscribe = testStore.$counter!.subscribe((val) => {
  console.log({ val }, '[COUNTER]')
})

// testStoreSubscribe()

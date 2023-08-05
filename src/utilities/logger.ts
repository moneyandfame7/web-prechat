/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
export const logger = {
  info(msg: string, ...data: any[]) {
    console.log(`%c${msg}`, 'color: #26bfa5; font-weight: bold', data)
  },

  warn(msg: string, ...data: any) {
    console.log(`%c${msg}`, 'color: orange', data)
  },

  error(msg: string, ...data: any) {
    console.log(`%c${msg}`, 'color: red', data)
  }
}

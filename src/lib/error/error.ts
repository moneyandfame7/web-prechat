import {Signal} from '@preact/signals'

export class ClientError {
  private static error: Signal = new Signal('')

  public static setError(err: string) {
    ClientError.error.value = err
  }

  public static clearError() {
    ClientError.error.value = ''
  }

  public static getError() {
    return ClientError.error
  }
}

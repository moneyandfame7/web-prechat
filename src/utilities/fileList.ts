export class MyFileList implements FileList {
  public constructor(private readonly files: File[]) {}

  public item(index: number) {
    return this.files[index] || null
  }

  public get length() {
    return this.files.length
  }

  public *[Symbol.iterator](): IterableIterator<File> {
    for (const file of this.files) {
      yield file
    }
  }

  [index: number]: File
}

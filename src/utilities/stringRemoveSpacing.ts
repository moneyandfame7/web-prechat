/**
 * @example
 * unformatStr("Lorem ipsum dorem") // Loremipsumdorem
 */
export const unformatStr = (str: string) => str.replace(/\s/g, '')

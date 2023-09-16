const UUID_PATTERN =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/

export function isValidId(id: string) {
  let processed = id
  if (id.startsWith('u_')) {
    processed = id.split('u_')[1]

    // return UUID_PATTERN.test(withoutPrefix)
  } else if (id.startsWith('c_')) {
    processed = id.split('c_')[1]
  }

  const tested = UUID_PATTERN.test(processed)

  return tested
}

export function getInitials(fullName: string) {
  // Розбиваємо повне ім'я на масив частин
  const nameParts = fullName.split(' ')

  // Беремо першу літеру першого елемента (ім'я)
  let firstInitial = nameParts[0].charAt(0).toUpperCase()

  // Якщо є другий елемент (прізвище) - беремо першу літеру
  if (nameParts.length > 1) {
    const lastInitial = nameParts[1].charAt(0).toUpperCase()
    firstInitial += lastInitial
  }

  return firstInitial
}

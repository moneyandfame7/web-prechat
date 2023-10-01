export function isYesterday(date: Date) {
  const currentDate = new Date()
  currentDate.setDate(currentDate.getDate() - 1) // Віднімаємо 1 день від поточної дати (робимо її вчорашньою)

  // Порівнюємо задану дату з вчорашньою датою
  return (
    date.getDate() === currentDate.getDate() &&
    date.getMonth() === currentDate.getMonth() &&
    date.getFullYear() === currentDate.getFullYear()
  )
}

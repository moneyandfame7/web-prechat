// export function isYesterday(date: Date) {
//   const currentDate = new Date()
//   currentDate.setDate(currentDate.getDate() - 1) // Віднімаємо 1 день від поточної дати (робимо її вчорашньою)

//   // Порівнюємо задану дату з вчорашньою датою
//   return (
//     date.getDate() === currentDate.getDate() &&
//     date.getMonth() === currentDate.getMonth() &&
//     date.getFullYear() === currentDate.getFullYear()
//   )
// }
export function isYesterday(checkedDate: Date): boolean {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  yesterday.setHours(0, 0, 0, 0)
  const yesterdayStart = yesterday.getTime()

  const date = new Date(checkedDate)
  date.setHours(0, 0, 0, 0)
  const dateStart = date.getTime()

  return dateStart >= yesterdayStart
}

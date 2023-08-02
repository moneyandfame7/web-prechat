export const isAnimationDisabled = () => {
  const root = document.documentElement
  return root.classList.contains('animation-none')
}

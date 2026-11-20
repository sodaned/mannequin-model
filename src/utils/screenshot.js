export function downloadScreenshot(canvas, filename) {
  const name = filename || `mannequin-${Date.now()}.png`
  const link = document.createElement('a')
  link.download = name
  link.href = canvas.toDataURL('image/png')
  link.click()
}

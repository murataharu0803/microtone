export const getOctavesInRange = (startPitch: number, endPitch: number) => {
  const octaves = Array.from(
    { length: Math.ceil(endPitch) - Math.floor(startPitch) + 1 },
    (_, i) => i + Math.floor(startPitch),
  )
  return octaves
}

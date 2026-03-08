// IELTS Band Score Conversion Tables

export const listeningScoreTable: { min: number; max: number; band: number }[] = [
  { min: 39, max: 40, band: 9.0 },
  { min: 37, max: 38, band: 8.5 },
  { min: 35, max: 36, band: 8.0 },
  { min: 33, max: 34, band: 7.5 },
  { min: 30, max: 32, band: 7.0 },
  { min: 27, max: 29, band: 6.5 },
  { min: 23, max: 26, band: 6.0 },
  { min: 20, max: 22, band: 5.5 },
  { min: 16, max: 19, band: 5.0 },
  { min: 13, max: 15, band: 4.5 },
  { min: 10, max: 12, band: 4.0 },
  { min: 6, max: 9, band: 3.5 },
  { min: 4, max: 5, band: 3.0 },
];

export const readingScoreTable: { min: number; max: number; band: number }[] = [
  { min: 39, max: 40, band: 9.0 },
  { min: 37, max: 38, band: 8.5 },
  { min: 35, max: 36, band: 8.0 },
  { min: 33, max: 34, band: 7.5 },
  { min: 30, max: 32, band: 7.0 },
  { min: 27, max: 29, band: 6.5 },
  { min: 23, max: 26, band: 6.0 },
  { min: 20, max: 22, band: 5.5 },
  { min: 15, max: 19, band: 5.0 },
  { min: 13, max: 14, band: 4.5 },
  { min: 10, max: 12, band: 4.0 },
  { min: 8, max: 9, band: 3.5 },
  { min: 6, max: 7, band: 3.0 },
];

export function correctAnswersToBand(
  correct: number,
  skill: 'listening' | 'reading'
): number {
  const table = skill === 'listening' ? listeningScoreTable : readingScoreTable;
  for (const row of table) {
    if (correct >= row.min && correct <= row.max) {
      return row.band;
    }
  }
  if (correct > 40) return 9.0;
  if (correct < 4) return 2.5;
  return 0;
}

export function calculateOverallBand(
  listening: number,
  reading: number,
  writing: number,
  speaking: number
): number {
  const avg = (listening + reading + writing + speaking) / 4;
  return Math.round(avg * 2) / 2; // Round to nearest 0.5
}

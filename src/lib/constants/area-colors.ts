import { AreaDTO } from '@/types/dtos';

// Define a fixed set of colors that work well together
export const AREA_COLORS = [
  '#4ade80', // green
  '#60a5fa', // blue
  '#f472b6', // pink
  '#facc15', // yellow
  '#a78bfa', // purple
  '#fb923c', // orange
  '#94a3b8', // gray
  '#f87171' // red
];

// Keep track of assigned colors to areas
const areaColorMap = new Map<string, string>();
let colorIndex = 0;

export function getAreaColor(areaName: string): string {
  // If area already has a color assigned, return it
  if (areaColorMap.has(areaName)) {
    return areaColorMap.get(areaName)!;
  }

  // Assign next color in sequence
  const color = AREA_COLORS[colorIndex % AREA_COLORS.length];
  areaColorMap.set(areaName, color);
  colorIndex++;

  return color;
}

// Reset color assignments (useful when component remounts)
export function resetAreaColors(): void {
  areaColorMap.clear();
  colorIndex = 0;
}

// Get all area colors for a dataset
export function getAreaColors(areas: string[]): string[] {
  resetAreaColors(); // Reset to ensure consistent ordering
  return areas.map((area) => getAreaColor(area));
}

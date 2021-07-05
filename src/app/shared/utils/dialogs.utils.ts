export type DialogSize = 'xxl' | 'xl' | 'l' | 'm' | 's' | 'xs' | 'xxs';

export function dialogWidth(size: DialogSize): string {
  return calculatePercents((window.innerWidth / 100), size);
}

export function dialogHeight(size: DialogSize): string {
  return calculatePercents((window.innerHeight / 100), size);
}

function calculatePercents(windowsPercent: number, size: DialogSize): string {
  const percents: [DialogSize, number][] = [['xxl', 97], ['xl', 90], ['l', 75], ['m', 50], ['s', 35], ['xs', 20], ['xxs', 10]];
  const windowsSize = windowsPercent * percents.find(p => p[0] === size)[1];
  return `${windowsSize}px`;
}

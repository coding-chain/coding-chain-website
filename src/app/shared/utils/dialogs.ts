export type DialogSize = 'xl' | 'l' | 'm' | 's' | 'xs';

export function dialogSize(size: DialogSize): string {
  const windowsPercent = (window.innerWidth / 100);
  const percents:[DialogSize, number][] = [['xl', 90], ['l', 75], ['m', 50], ['s', 35], ['xs', 20]];
  const windowsSize = windowsPercent * percents.find(p => p[0] == size)[1];
  return `${windowsSize}px`;
}

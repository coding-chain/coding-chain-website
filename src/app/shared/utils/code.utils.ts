export class CodeUtils {
  public static getStartingScopeIdx(text: string, endScopeIdx: number, startScopeChar: string, endScopeChar: string): number {
    let startScopeCharCnt = 0;
    let hasChanged = false;
    for (let i = endScopeIdx; i >= 0; i--) {
      if (text[i] === endScopeChar) {
        hasChanged = true;
        startScopeCharCnt--;
      } else if (text[i] === startScopeChar) {
        hasChanged = true;
        startScopeCharCnt++;
      }
      if (startScopeCharCnt === 0 && hasChanged) {
        return i;
      }
    }
    return -1;
  }

  public static getEndingScopeIdx(text: string, startScopeIdx: number, startScopeChar: string, endScopeChar: string): number {
    let endScopeCharCnt = 0;
    let hasChanged = false;
    for (let i = startScopeIdx; i < text.length; i++) {
      if (text[i] === endScopeChar) {
        hasChanged = true;
        endScopeCharCnt++;
      } else if (text[i] === startScopeChar) {
        hasChanged = true;
        endScopeCharCnt--;
      }
      if (endScopeCharCnt === 0 && hasChanged) {
        return i;
      }
    }
    return -1;
  }
}

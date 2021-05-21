export class ArrayUtils {
  public static toMatrix<T>(inArr: T[], colSize: number): T[][] {
    return inArr.reduce(
      (rows, key, index) => (index % colSize === 0 ? rows.push([key])
        : rows[rows.length - 1].push(key)) && rows,
      []);
  }

  public static trackById(index: number, el: any): any {
    return el?.id;
  }
}

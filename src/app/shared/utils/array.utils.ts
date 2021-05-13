export function toMatrix<T>(inArr: T[], colSize: number): T[][] {
  return inArr.reduce(
    (rows, key, index) => (index % colSize === 0 ? rows.push([key])
      : rows[rows.length - 1].push(key)) && rows,
    []);
}

export interface IObjectUpdateResume<T> {
  originalVersion: T;
  editedVersion: T;
  differentProperties: (keyof T)[];
}

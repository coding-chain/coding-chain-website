export class PaginationQuery {
  page:number;
  size:number;
  constructor(obj?: Partial<PaginationQuery>) {
    this.page = obj?.page ?? 0;
    this.size = obj?.size ?? 0;
  }
}

import {IPaginationQuery} from "./i-pagination-query";

export class PaginationQuery implements IPaginationQuery{
  page: number;
  size: number;
  constructor(obj?: Partial<PaginationQuery>) {
    this.page =  !obj?.page || obj?.page <=0 ? 1 :obj?.page;
    this.size = obj?.size ?? 10;
  }
}

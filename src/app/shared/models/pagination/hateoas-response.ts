import {Link} from './link';

export class HateoasResponse<T> {
  result: T;
  links: Link[];

  constructor(obj?: Partial<HateoasResponse<T>>) {
    this.result = obj?.result;
    this.links = obj?.links ?? [];
  }
}


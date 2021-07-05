import {Link} from './link';
import {HateoasResponse} from './hateoas-response';

export class HateoasPageResponse<T> extends HateoasResponse<HateoasResponse<T>[]> {
  result: HateoasResponse<T>[];
  links: Link[];
  total: number;

  constructor(obj?: Partial<HateoasPageResponse<T>>) {
    super(obj);
    this.total = obj.total;
  }

  get pageCount(): number {
    if (!this.total || !this.result.length) {
      return 0;
    }
    return Math.ceil(this.total / this.result.length);
  }

  get currentPage(): number {
    return this.getPage(this.currentLink.href);
  }

  get currentSize(): number {
    return this.getSize(this.currentLink.href);
  }

  get nextLink(): Link | undefined {
    return this.links.find(l => l.rel === 'nextPage');
  }

  get previousLink(): Link | undefined {
    return this.links.find(l => l.rel === 'previousPage');
  }

  get currentLink(): Link | undefined {
    return this.links.find(l => l.rel === 'currentPage');
  }

  clone<TNew>(subElements: TNew[], predicate: (pageElement: HateoasResponse<T>, subElement: TNew) => boolean): HateoasPageResponse<TNew> {
    const newElements = this.result.map((el: HateoasResponse<T>) => {
      const matchingEl: TNew = subElements.find(subEl => predicate(el, subEl));
      return new HateoasResponse<TNew>({result: matchingEl, links: el.links});
    });
    return new HateoasPageResponse<TNew>({result: newElements, total: this.total, links: this.links});
  }

  private getPage(href: string): number {
    return this.getPaginationInfo(href, 'page');
  }

  private getSize(href: string): number {
    return this.getPaginationInfo(href, 'size');
  }

  private getPaginationInfo(href: string, paginationParam: string): number {
    if (!href) {
      return -1;
    }
    const url = new URL(href);
    const info = url.searchParams.get(paginationParam);
    if (!info) {
      return 0;
    }
    return parseInt(info, 10);
  }
}

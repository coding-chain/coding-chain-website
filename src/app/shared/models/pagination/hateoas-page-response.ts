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

  nextLink(): Link | undefined {
    return this.links.find(l => l.rel == 'next');
  }

  previousLink(): Link | undefined {
    return this.links.find(l => l.rel == 'previous');
  }

  currentLink(): Link | undefined {
    return this.links.find(l => l.rel == 'current');
  }

  clone<TNew>(subElements: TNew[], predicate: (pageElement: HateoasResponse<T>, subElement: TNew) => boolean): HateoasPageResponse<TNew> {
    const newElements = this.result.map((el: HateoasResponse<T>) => {
      const matchingEl: TNew = subElements.find(subEl => predicate(el, subEl));
      return new HateoasResponse<TNew>({result: matchingEl, links: el.links});
    });
    return new HateoasPageResponse<TNew>({result: newElements, total: this.total, links: this.links});
  }
}

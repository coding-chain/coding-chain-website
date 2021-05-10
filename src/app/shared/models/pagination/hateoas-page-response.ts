import {Link} from "./link";
import {HateoasResponse} from "./hateoas-response";

export class HateoasPageResponse<T> extends HateoasResponse<T> {
    result: T;
    links: Link[];
    total: number;

    constructor(obj?: Partial<HateoasPageResponse<T>>) {
        super(obj);
        this.total = obj.total;
    }

    nextLink(): Link | undefined {
        return this.links.find(l => l.rel == "next");
    }

    previousLink(): Link | undefined {
        return this.links.find(l => l.rel == "previous");
    }

    currentLink(): Link | undefined {
        return this.links.find(l => l.rel == "current");
    }
}

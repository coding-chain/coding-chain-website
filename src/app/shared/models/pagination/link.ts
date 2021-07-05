import {HttpMethod} from '../http/http-method';
import {Rel} from './rel';

export interface Link {
  href: string;
  rel: Rel;
  method: HttpMethod;
}

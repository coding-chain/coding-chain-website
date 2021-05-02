import {HttpMethod} from '../http/http-method';
import {Rel} from './rel';

export interface Links{
  href: string;
  rel: Rel;
  method: HttpMethod;
}

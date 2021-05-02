import {Links} from './links';

export interface HateoasResponse<T>{
  result: T;
  links: Links[];
}

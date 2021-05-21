import {Directive, ElementRef} from '@angular/core';

@Directive({
  selector: '[appMatDialogExpandedContent]'
})
export class MatDialogExpandedContentDirective {

  constructor(public elementRef: ElementRef) {

  }

}

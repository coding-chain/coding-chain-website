import {Directive, ElementRef, OnInit, Renderer2} from '@angular/core';

@Directive({
  selector: '[appMatDialogExpanderDirective]'
})
export class MatDialogExpanderDirective implements OnInit {

  constructor(private readonly _renderer: Renderer2, private readonly _elementRef: ElementRef) {

  }

  get siblingHeights(): number {
    const parent = this._elementRef.nativeElement.parentElement as Element;
    let height = 0;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < parent.children.length; i++) {
      if (parent.children[i] !== this._elementRef.nativeElement) {
        height += parent.children[i].getBoundingClientRect().height;
      }
    }
    return height;
  }

  get contentHeight(): number {
    return this.dialogHeight - this.siblingHeights;
  }


  get dialog(): Element {
    return document.getElementsByClassName('mat-dialog-container')[0];
  }

  get dialogHeight(): number {
    const styles = window.getComputedStyle(this.dialog);
    const padBot = parseFloat(styles.paddingBottom.replace(/[^0-9]/g, ''));
    const padTop = parseFloat(styles.paddingTop.replace(/[^0-9]/g, ''));
    return this.dialog.getClientRects()[0].height - padBot - padTop;
  }

  ngOnInit(): void {
    if (this._elementRef) {
      this._renderer.setStyle(this._elementRef.nativeElement, 'height', `${this.contentHeight}px`);
    }
  }

}

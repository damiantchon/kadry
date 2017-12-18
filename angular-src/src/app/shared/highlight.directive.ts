import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
    '(mousedown)': 'onMouseDown()',
    '(mouseup)': 'onMouseUp()'
  }
})
export class HighlightDirective {

  private el: HTMLElement;
  private defaultColor = 'white';
  constructor(el: ElementRef) {
    this.el = el.nativeElement;
  }

  @Input('appHighlight') highlightColor: string;

  onMouseEnter() {
    this.highlight(this.highlightColor || this.defaultColor);
    this.el.style.cursor = 'pointer';
  }

  onMouseLeave() {
    this.highlight(null);
  }

  onMouseDown() {
    this.highlight('lightgray')
  }

  onMouseUp() {
    this.highlight(this.highlightColor || this.defaultColor);
    this.el.style.cursor = 'pointer';
  }


  private highlight(color: string) {
    this.el.style.backgroundColor = color;
  }

}

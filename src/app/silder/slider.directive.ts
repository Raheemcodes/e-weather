import {
  Directive,
  Input,
  OnInit,
  ElementRef,
  Renderer2,
  HostBinding,
} from '@angular/core';

@Directive({
  selector: '[slider]',
})
export class SliderDirective implements OnInit {
  @HostBinding('style.cursor') cursor!: string;
  @Input('pagination') paginationList!: HTMLUListElement;
  @Input() gap!: number;
  @Input() maxWidth!: number;

  screenWidth: number = innerWidth;
  isDragging: boolean = false;
  startPos: number = 0;
  startPosY: number = 0;
  currentTranslate: number = 0;
  prevTranslate: number = 16;
  curIdx: number = 0;

  slider!: HTMLElement;
  slideWidth!: number;
  threshold!: number;
  lastSlide!: number;

  constructor(
    private elRef: ElementRef<HTMLElement>,
    private render: Renderer2
  ) {}

  ngOnInit(): void {
    this.innitial();
    this.initializePagination();
  }

  innitial() {
    this.slider = <HTMLElement>this.elRef.nativeElement.firstElementChild;
    this.slideWidth = this.slider.firstElementChild!.clientWidth;
    this.threshold = this.slideWidth / 6;
    this.lastSlide = this.slider.children.length - 2;
  }

  initializePagination() {
    const featured = this.elRef.nativeElement.querySelectorAll('.featured');

    featured.forEach((el, idx) => {
      if (idx < featured.length - 1) {
        const li: HTMLLIElement = this.render.createElement('li');
        li.className = idx == 0 ? 'pagination active' : 'pagination';

        this.render.appendChild(this.paginationList, li);
      }
    });
  }

  getPositionX(event: MouseEvent | TouchEvent): number {
    return event.type.includes('mouse')
      ? (event as MouseEvent).pageX
      : (event as TouchEvent).touches[0].clientX;
  }

  getPositionY(event: MouseEvent | TouchEvent): number {
    return event.type.includes('mouse')
      ? (event as MouseEvent).pageY
      : (event as TouchEvent).touches[0].clientY;
  }

  setPositionByIndex() {
    if (this.screenWidth > this.maxWidth) {
      this.currentTranslate = 0;
    } else {
      if (this.curIdx >= 0 && this.curIdx <= this.lastSlide) {
        this.currentTranslate = this.curIdx * -this.slideWidth;
      }

      this.prevTranslate = this.currentTranslate;
    }

    this.setSliderPosition();
  }

  setSliderPosition() {
    this.slider!.style.transform = `translateX(${this.toRem(
      this.currentTranslate
    )}rem)`;
  }

  toRem(value: number) {
    return value / 16;
  }
}

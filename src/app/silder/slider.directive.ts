import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnInit,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[slider]',
})
export class SliderDirective implements OnInit {
  @HostBinding('style.cursor') cursor!: string;
  @Input('pagination') paginationList!: HTMLUListElement;
  @Input() pad!: number;
  @Input() maxWidth!: number;

  screenWidth: number = innerWidth;
  isDragging: boolean = false;
  startPos: number = 0;
  startPosY: number = 0;
  currentTranslate: number = 0;
  prevTranslate: number = 0;
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
    this.render.setStyle(this.slider, 'transition', '0.3s all ease-out');
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

  updatePagination() {
    Array.from(this.paginationList.children).forEach((el, idx) => {
      if (idx == this.curIdx) this.render.addClass(el, 'active');
      else this.render.removeClass(el, 'active');
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

  @HostListener('window:resize') resize() {
    this.innitial();
    this.screenWidth = innerWidth;
    this.setPositionByIndex();
  }

  @HostListener('dragstart', ['$event']) dragStart(event: Event) {
    event.preventDefault();
  }
  @HostListener('touchstart', ['$event'])
  @HostListener('mousedown', ['$event'])
  touchstart(event: MouseEvent | TouchEvent) {
    if (this.screenWidth > this.maxWidth) return;
    this.startPos = this.getPositionX(event);
    this.startPosY = this.getPositionY(event);
    this.isDragging = true;
    this.cursor = 'grabbing';
  }

  @HostListener('touchmove', ['$event'])
  @HostListener('mousemove', ['$event'])
  touchmove(event: MouseEvent | TouchEvent) {
    if (this.isDragging) {
      const currentPosition = this.getPositionX(event);
      const currentTranslateX = this.getPositionX(event) - this.startPos;
      const currentTranslateY = this.getPositionY(event) - this.startPosY;

      if (Math.abs(currentTranslateY) < Math.abs(currentTranslateX)) {
        if (event.cancelable) event.preventDefault();
        this.currentTranslate =
          this.prevTranslate + currentPosition - this.startPos;
        this.setSliderPosition();
      }
    }
  }

  @HostListener('touchend', ['$event'])
  @HostListener('mouseup', ['$event'])
  @HostListener('mouseleave', ['$event'])
  touchend() {
    this.isDragging = false;

    const movedBy = this.currentTranslate - this.prevTranslate;
    // if moved enough negative then snap to next slide if there is one

    if (movedBy < -this.threshold && this.curIdx < this.lastSlide) {
      this.curIdx++;
    }

    // if moved enough positive then snap to previous slide if there is one
    if (movedBy > this.threshold && this.curIdx > 0) this.curIdx--;

    this.setPositionByIndex();

    this.cursor = '';
  }

  setPositionByIndex() {
    if (this.screenWidth > this.maxWidth) {
      this.currentTranslate = 0;
    } else {
      if (this.curIdx == 0) {
        this.currentTranslate = this.pad + this.curIdx * -this.slideWidth;
      }
      if (this.curIdx > 0 && this.curIdx <= this.lastSlide) {
        this.currentTranslate = this.curIdx * -this.slideWidth;
      }

      this.prevTranslate = this.currentTranslate;
    }

    this.updatePagination();
    this.setSliderPosition();
  }

  setSliderPosition() {
    this.render.setStyle(
      this.slider,
      'transform',
      `translateX(${this.toRem(this.currentTranslate)}rem)`
    );
  }

  toRem(value: number) {
    return value / 16;
  }
}

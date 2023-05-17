import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { Error_Type, RestructureSearchRes } from '../shared/shared.model';
import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent implements OnInit, OnDestroy {
  subs: Subscription[] = [];
  result: RestructureSearchRes[] = [];
  _isLoading: boolean = false;
  isError: boolean = false;
  length!: number;
  key!: string;
  type: Error_Type = 'no_result';

  set isLoading(val: boolean) {
    if (val) this._isLoading = val;
    else {
      this.subs[0] = timer(3000).subscribe(() => {
        this._isLoading = val;
      });
    }
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  constructor(
    private sharedService: SharedService,
    private route: ActivatedRoute,
    @Inject('Window') private window: Window
  ) {}

  ngOnInit(): void {
    this.getParams();
  }

  getParams() {
    this.subs[1] = this.route.params.subscribe({
      next: ({ key }: Params) => {
        this.key = key;
        this.getSearchRes();
        this.postSearchRes(key);
      },
    });
  }

  postSearchRes(key: string) {
    this.isError = false;
    this.isLoading = true;
    this.sharedService.fetchLocation(key);
  }

  onRetry(type: Error_Type) {
    if (type == 'no_result') this.window.history.back();
    else {
      this.getSearchRes();
      this.postSearchRes(this.key);
    }
  }

  getSearchRes() {
    if (this.subs[2]) this.subs[2].unsubscribe();
    if (this.subs[4]) this.subs[4].unsubscribe();

    this.subs[2] = this.sharedService.fullSearchRes$.subscribe({
      next: (res) => {
        this.result = res;
        this.length = res.length;
        this.isLoading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.log('staus:', err.status);
        this.isLoading = false;
        this.type = this.sharedService.errorHandler(err.status);

        this.subs[4] = timer(100).subscribe(() => {
          this.isError = true;
        });
      },
    });
  }

  goBack() {
    this.window.history.back();
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => {
      if (sub) sub.unsubscribe();
    });
  }
}

import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { RestructureSearchRes } from '../shared/shared.model';
import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.scss'],
})
export class SearchResultComponent implements OnInit, OnDestroy {
  subs: Subscription[] = [];
  result!: RestructureSearchRes[];
  _isLoading: boolean = false;
  length!: number;
  key!: string;

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
    this.getSearchRes();
  }

  getParams() {
    this.subs[0] = this.route.params.subscribe({
      next: ({ key }: Params) => {
        this.key = key;
        this.postSearchRes(key);
      },
    });
  }

  postSearchRes(key: string) {
    this.isLoading = true;
    this.sharedService.fetchLocation(key);
  }

  getSearchRes() {
    this.subs[1] = this.sharedService.fullSearchRes$.subscribe({
      next: (res) => {
        this.result = res;
        this.length = res.length;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
      },
    });
  }

  goBack() {
    this.window.history.back();
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}

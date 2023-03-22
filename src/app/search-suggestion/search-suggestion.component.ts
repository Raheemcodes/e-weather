import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RestructureSearchRes } from '../shared/shared.model';
import { SharedService } from '../shared/shared.service';

@Component({
  selector: 'app-search-suggestion',
  templateUrl: './search-suggestion.component.html',
  styleUrls: ['./search-suggestion.component.scss'],
})
export class SearchSuggestionComponent implements OnInit, OnDestroy {
  result!: RestructureSearchRes[];
  isLoading: boolean = true;
  subs: Subscription[] = [];

  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    this.getLoadingStatus();
    this.getSearchRes();
  }

  getSearchRes() {
    this.result = this.sharedService.searchRes;
    if (this.result.length) this.isLoading = false;

    this.subs[0] = this.sharedService.searchRes$.subscribe({
      next: (res) => {
        this.result = res;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
      },
    });
  }

  getLoadingStatus() {
    this.subs[1] = this.sharedService.isLoading$.subscribe({
      next: (res) => {
        this.isLoading = res;
      },
      error: (err) => {
        this.isLoading = false;
      },
    });
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => {
      if (sub) sub.unsubscribe();
    });
  }
}

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
  sub!: Subscription;
  result!: RestructureSearchRes[];

  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    this.getSearchRes();
  }

  getSearchRes() {
    this.sub = this.sharedService.searchRes$.subscribe({
      next: (res) => {
        this.result = res;
      },
    });
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }
}

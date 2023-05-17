import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Error_Type, RestructureSearchRes } from '../shared/shared.model';
import { SharedService } from '../shared/shared.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-search-suggestion',
  templateUrl: './search-suggestion.component.html',
  styleUrls: ['./search-suggestion.component.scss'],
})
export class SearchSuggestionComponent implements OnInit, OnDestroy {
  result!: RestructureSearchRes[];
  isLoading: boolean = true;
  isError: boolean = false;
  subs: Subscription[] = [];

  errors = {
    no_result: {
      title: 'No Results Found!',
      desc: 'Try searching for a city, zip code or point of interest.',
    },
    server_error: {
      title: 'Server Error!',
      desc: 'Something wrong happened, please retry',
    },
    network_error: {
      title: 'Request Failed',
      desc: 'Please check your network and try again',
    },
    unknown_error: {
      title: 'Unknown Error Occured',
      desc: null,
    },
    invalid_params: {
      title: 'Invalid Parameter',
      desc: null,
    },
  };

  error!: { title: string; desc: string | null };

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
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        this.handleErr(err);
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

  handleErr(err: HttpErrorResponse) {
    const type: Error_Type = this.sharedService.errorHandler(err.status);
    this.error = this.errors[type];
    this.isError = true;
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => {
      if (sub) sub.unsubscribe();
    });
  }
}

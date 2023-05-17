import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ErrorMsg, Error_Type } from '../shared/shared.model';

@Component({
  selector: 'app-error-handler',
  templateUrl: './error-handler.component.html',
  styleUrls: ['./error-handler.component.scss'],
})
export class ErrorHandlerComponent implements OnInit {
  @Input() type: Error_Type = 'no_result';
  @Output('retry') error_action = new EventEmitter<Error_Type>();

  errorMsg = {
    no_result: {
      title: 'No Results Found!',
      desc: 'Try searching for a city, zip code or point of interest.',
      action: 'Go Back',
    },
    server_error: {
      title: 'Server Error!',
      desc: 'Something wrong happened, please retry',
      action: 'Retry',
    },
    network_error: {
      title: 'Request Failed',
      desc: 'Please check your network and try again',
      action: 'Retry',
    },
    unknown_error: {
      title: 'Unknown Error Occured',
      desc: null,
      action: 'Retry',
    },
    invalid_params: {
      title: 'Invalid Parameter',
      desc: null,
      action: 'Fix the query parameters in your search bar and try again.',
    },
  };

  handler!: ErrorMsg;

  constructor() {}

  ngOnInit(): void {
    this.handler = this.errorMsg[this.type];
  }

  goBack() {
    this.error_action.emit(this.type);
  }
}

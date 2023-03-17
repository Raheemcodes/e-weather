import { HttpClient, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { SharedService } from './shared.service';

describe('SharedService', () => {
  let service: SharedService;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    http = TestBed.inject(HttpClient);
    service = new SharedService(http);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // it('should have have propery ipres$ with value relative to fetchIPLocaion() res', () => {});
});

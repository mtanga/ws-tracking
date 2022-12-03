import { TestBed } from '@angular/core/testing';

import { DownloadedService } from './downloaded.service';

describe('DownloadedService', () => {
  let service: DownloadedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DownloadedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

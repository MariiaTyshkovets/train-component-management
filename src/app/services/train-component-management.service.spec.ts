import { TestBed } from '@angular/core/testing';

import { TrainComponentManagementService } from './train-component-management.service';

describe('TrainComponentManagementService', () => {
  let service: TrainComponentManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrainComponentManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';
import { TrainComponentManagementService } from './train-component-management.service';
import { ITrainComponent } from '../models/train-component.model';

const STORAGE_KEY = 'train-components';

describe('TrainComponentManagementService', () => {
  let service: TrainComponentManagementService;

  const mockComponents: ITrainComponent[] = [
    { id: 1, name: 'Wheel', uniqueNumber: 'U-001', canAssignQuantity: true, quantity: 4 },
    { id: 2, name: 'Engine', uniqueNumber: 'U-002', canAssignQuantity: false }
  ];

  beforeEach(() => {
    localStorage.clear();

    spyOnProperty(TrainComponentManagementService.prototype as any, 'initialData', 'get').and.returnValue(mockComponents);

    TestBed.configureTestingModule({});
    service = TestBed.inject(TrainComponentManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize localStorage on construction', () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    expect(stored).toBeTruthy();
    expect(JSON.parse(stored!)).toEqual(mockComponents);
  });

  it('should return all components via getAll()', () => {
    const all = service.getAll();
    expect(all.length).toBe(2);
    expect(all[0].name).toBe('Wheel');
  });

  it('should update component and persist to localStorage', () => {
    const updatedComponent: ITrainComponent = {
      id: 1,
      name: 'Wheel Updated',
      uniqueNumber: 'U-001',
      canAssignQuantity: true,
      quantity: 8
    };

    service.update(updatedComponent);

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(stored.find((c: ITrainComponent) => c.id === 1)).toEqual(updatedComponent);
  });

  it('should not update anything if component id not found', () => {
    const before = localStorage.getItem(STORAGE_KEY);

    const fakeComponent: ITrainComponent = {
      id: 999,
      name: 'Fake',
      uniqueNumber: 'Fake-999',
      canAssignQuantity: true,
      quantity: 99
    };

    service.update(fakeComponent);
    const after = localStorage.getItem(STORAGE_KEY);
    expect(after).toBe(before);
  });
});
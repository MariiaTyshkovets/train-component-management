import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainTableComponent } from './train-table.component';
import { TrainComponentManagementService } from '../../services/train-component-management.service';
import { ITrainComponent } from '../../models/train-component.model';
import { ReactiveFormsModule } from '@angular/forms';

describe('TrainTableComponent', () => {
  let component: TrainTableComponent;
  let fixture: ComponentFixture<TrainTableComponent>;
  let mockService: jasmine.SpyObj<TrainComponentManagementService>;

  const mockComponents: ITrainComponent[] = Array.from({ length: 15 }).map(
    (_, i) => ({
      id: i + 1,
      name: `Component ${i + 1}`,
      uniqueNumber: `U-${i + 1}`,
      canAssignQuantity: i % 2 === 0,
      quantity: i + 1,
    })
  );

  beforeEach(async () => {
    mockService = jasmine.createSpyObj('TrainComponentManagementService', [
      'getAll',
      'update',
    ]);
    mockService.getAll.and.returnValue(mockComponents);

    await TestBed.configureTestingModule({
      imports: [TrainTableComponent, ReactiveFormsModule],
      providers: [
        { provide: TrainComponentManagementService, useValue: mockService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TrainTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component and load data', () => {
    expect(component).toBeTruthy();
    expect(component.components().length).toBe(15);
    expect(component.paginated().length).toBe(10); // pageSize = 10
  });

  it('should paginate to next page', () => {
    component.nextPage();
    fixture.detectChanges();
    expect(component.currentPage()).toBe(2);
    expect(component.paginated().length).toBe(5); // remaining
  });

  it('should call startEdit and populate input', () => {
    const editable = component.paginated().find((c) => c.canAssignQuantity)!;
    component.startEdit(editable);
    fixture.detectChanges();

    expect(component.editingId()).toBe(editable.id);
    expect(component.quantityControl.value).toBe(String(editable.quantity));
  });

  it('should not allow invalid quantity values', () => {
    const editable = component.paginated().find((c) => c.canAssignQuantity)!;
    component.startEdit(editable);
    component.quantityControl.setValue('0'); // invalid
    component.finishEdit(editable);
    expect(mockService.update).not.toHaveBeenCalled();
    expect(component.editingId()).toBeNull(); // editing ended
  });

  it('should allow valid quantity and update component', () => {
    const editable = component.paginated().find((c) => c.canAssignQuantity)!;
    component.startEdit(editable);
    component.quantityControl.setValue('100'); // valid
    component.finishEdit(editable);
    expect(mockService.update).toHaveBeenCalledWith(
      jasmine.objectContaining({ id: editable.id, quantity: 100 })
    );
  });

  it('should not edit if canAssignQuantity is false', () => {
    const nonEditable = component
      .paginated()
      .find((c) => !c.canAssignQuantity)!;
    component.startEdit(nonEditable);
    expect(component.editingId()).not.toBe(nonEditable.id);
  });

  it('should save quantity on Enter keydown', () => {
    const editable = component.paginated().find((c) => c.canAssignQuantity)!;
    component.startEdit(editable);
    fixture.detectChanges();

    component.quantityControl.setValue('123');

    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    component.onKeydown(event, editable);

    expect(mockService.update).toHaveBeenCalledWith(
      jasmine.objectContaining({ id: editable.id, quantity: 123 })
    );
    expect(component.editingId()).toBeNull();
  });

  it('should cancel edit on Escape keydown', () => {
    const editable = component.paginated().find((c) => c.canAssignQuantity)!;
    component.startEdit(editable);
    fixture.detectChanges();

    component.quantityControl.setValue('777');
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    component.onKeydown(event, editable);

    expect(mockService.update).not.toHaveBeenCalled();
    expect(component.editingId()).toBeNull();
    expect(component.quantityControl.value).toBeNull();
  });

  it('should save on outside click if editing', () => {
    const editable = component.paginated().find((c) => c.canAssignQuantity)!;
    component.startEdit(editable);
    fixture.detectChanges();

    component.quantityControl.setValue('10');

    const fakeEvent = {
      target: document.createElement('div'),
    } as unknown as MouseEvent;

    spyOn(component['eRef'].nativeElement, 'contains').and.returnValue(false);

    component.handleClickOutside(fakeEvent);
    expect(mockService.update).toHaveBeenCalled();
    expect(component.editingId()).toBeNull();
  });

  it('should not call finishEdit if click inside component', () => {
    const editable = component.paginated().find(c => c.canAssignQuantity)!;
    component.startEdit(editable);
    fixture.detectChanges();
  
    component.quantityControl.setValue('10');
  
    const fakeEvent = {
      target: document.createElement('div')
    } as unknown as MouseEvent;
  
    spyOn(component['eRef'].nativeElement, 'contains').and.returnValue(true);
  
    component.handleClickOutside(fakeEvent);
    expect(mockService.update).not.toHaveBeenCalled();
    expect(component.editingId()).toBe(editable.id);
  });
});

import { CommonModule } from '@angular/common';
import { Component, computed, ElementRef, HostListener, signal, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ITrainComponent } from '../../models/train-component.model';
import { TrainComponentManagementService } from '../../services/train-component-management.service';

@Component({
  selector: 'app-train-table',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './train-table.component.html',
  styleUrl: './train-table.component.scss',
})
export class TrainTableComponent {
  @ViewChild('quantityInput') quantityInputRef!: ElementRef<HTMLInputElement>;

  components = signal<ITrainComponent[]>([]);
  paginated = signal<ITrainComponent[]>([]);

  pageSize = 10;
  currentPage = signal(1);
  totalPages = signal(1);

  totalPagesArray = computed(() => {
    return Array.from({ length: this.totalPages() }, (_, i) => i + 1);
  });

  editingId = signal<number | null>(null);
  quantityControl = new FormControl('', [
    Validators.required,
    Validators.pattern(/^[1-9]\d*$/),
  ]);

  constructor(
    private readonly service: TrainComponentManagementService,
    private readonly eRef: ElementRef
  ) {}

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const clickedInside = this.eRef.nativeElement.contains(event.target);
    if (!clickedInside && this.editingId() !== null) {
      const currentComponent = this.components().find(c => c.id === this.editingId());
      if (currentComponent) {
        this.finishEdit(currentComponent);
      }
    }
  }

  ngOnInit() {
    const data = this.service.getAll();
    this.components.set(data);
    this.totalPages.set(Math.ceil(data.length / this.pageSize));
    this.updatePage();
  }

  ngAfterViewChecked(): void {
    if (this.editingId !== null&& this.quantityInputRef) {
      this.quantityInputRef?.nativeElement.focus();
    }
  }

  updatePage() {
    const page = this.currentPage();
    const start = (page - 1) * this.pageSize;
    const end = start + this.pageSize;
    const allComponents = this.components();
    this.paginated.set(allComponents.slice(start, end));
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(n => n + 1);
      this.updatePage();
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(n => n - 1);
      this.updatePage();
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.updatePage();
    }
  }

  startEdit(component: ITrainComponent) {
    if (this.editingId() && this.quantityControl.invalid) {
      return;
    }
    if (this.editingId()) {
      this.finishEdit(component);
    }
    if (!component.canAssignQuantity) {
      return;
    }
    this.editingId.set(component.id);
    this.quantityControl.setValue(component.quantity?.toString() ?? '');
    this.quantityControl.markAsPristine();
    this.quantityControl.markAsUntouched();
  }

  finishEdit(component: ITrainComponent) {
    if (this.quantityControl.valid) {
      const val = parseInt(this.quantityControl.value ?? '', 10);
      if (component.canAssignQuantity && Number.isInteger(val) && val > 0) {
        component.quantity = val;
        this.service.update(component);
        const updated = this.components().map(c => (c.id === component.id ? component : c));
        this.components.set(updated);
      }
      this.editingId.set(null);
      this.quantityControl.reset();
    }
  }

  onKeydown(event: KeyboardEvent, component: ITrainComponent) {
    const key = event.key;
    if (key === 'Enter') {
      this.finishEdit(component);
    } else if (key === 'Escape') {
      this.editingId.set(null);
      this.quantityControl.reset();
    }
  }
}

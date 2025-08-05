import { Injectable } from '@angular/core';
import { ITrainComponent } from '../models/train-component.model';
import { TRAIN_COMPONENTS } from '../data/train-components';

const STORAGE_KEY = 'train-components';

@Injectable({
  providedIn: 'root',
})
export class TrainComponentManagementService {
  private initialData: ITrainComponent[] = TRAIN_COMPONENTS;

  constructor() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.initialData));
    }
  }

  getAll(): ITrainComponent[] {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)!);
  }

  update(component: ITrainComponent): void {
    const all = this.getAll();
    const idx = all.findIndex((c) => c.id === component.id);
    if (idx !== -1) {
      all[idx] = component;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    }
  }
}

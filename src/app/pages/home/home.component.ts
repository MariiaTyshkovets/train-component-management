import { Component } from '@angular/core';
import { TrainTableComponent } from "../../components/train-table/train-table.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TrainTableComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}

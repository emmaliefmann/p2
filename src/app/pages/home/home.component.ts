import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ViewChild } from '@angular/core';
import { Chart } from 'chart.js';

import { Olympic } from 'src/app/core/models/olympic.model';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild('chart') chart!: Chart;

  public olympics$: Observable<Olympic[] | null> = of(null);
  data!: any;
  labels: string[] = [];
  medalData: number[] = [];

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.olympicService.getOlympics().subscribe({
      next: (olympics) => {
        if (olympics) {
          this.createDatasets(olympics);
        }
      },
      error: (err) => console.warn(err),
      complete: () => {},
    });
  }

  createDatasets(olympics: Olympic[]) {
    olympics.forEach((olympic) => {
      this.labels.push(olympic.country);
      let medals = 0;
      olympic.participations.forEach((participation) => {
        medals += participation.medalsCount;
      });
      this.medalData.push(medals);
      console.log(`${olympic.country} : ${medals}`);
    });
    this.updateChart();
  }

  updateChart() {
    this.data = {
      labels: this.labels,
      datasets: [
        {
          data: [...this.medalData],
          // TODO add correct colors 
          // TODO Hover info
        },
      ],
    };
  }
}

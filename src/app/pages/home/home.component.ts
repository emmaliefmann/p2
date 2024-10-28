import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { Router } from '@angular/router';

import { Olympic } from 'src/app/core/services/models/olympic.model';
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
  
  constructor(private olympicService: OlympicService, private router: Router) {}
  
  ngOnInit(): void {
    // wierd to have two values 
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
  
  // fix any, PointerEvent index not correct
  handleClick($event: any) {
    const i: number = $event.element.index;
    const selected: string = this.data.labels[i];
    if (selected) {
      this.router.navigate([`/detail/${selected}`]);
    }
  }

  createDatasets(olympics: Olympic[]) {
    olympics.forEach((olympic) => {
      this.labels.push(olympic.country);
      let medals = 0;
      olympic.participations.forEach((participation) => {
        medals += participation.medalsCount;
      });
      this.medalData.push(medals);
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
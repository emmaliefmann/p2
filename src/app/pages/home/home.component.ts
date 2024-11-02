import { Component, OnInit } from '@angular/core';
import { Observable, of, Subject, takeUntil } from 'rxjs';
import { ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { Router } from '@angular/router';

import { Olympic } from 'src/app/core/models/olympic.model';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { ChartClickEvent } from 'src/app/core/models/ChartClickEvent.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit {
  @ViewChild('chart') chart!: Chart;

  public olympics$: Observable<Olympic[] | null> = of(null);
  public data!: any;
  public labels: string[] = [];
  public options: any;
  public nbOlympics: number = 0;
  
  private medalData: number[] = [];
  private countryColors: string[] = [];
  private destroy$ = new Subject<void>();
  
  constructor(private olympicService: OlympicService, private router: Router) { }

  ngOnInit(): void {
    this.olympics$ = this.olympicService.getOlympics();
    this.olympicService.getOlympics()
    .pipe(
      takeUntil(this.destroy$))
      .subscribe({
      next: (olympics) => {
        if (olympics) {
          this.createDatasets(olympics);
          this.getNumberOfJO(olympics);
        }
      },
      error: (err) => console.warn(err)
    });
  }

  handleClick($event: ChartClickEvent) {
    const i: number = $event.element.index;
    const selected: string = this.data.labels[i];
    if (selected) {
      this.router.navigate([`/detail/${selected}`]);
    }
  }

  getNumberOfJO(olympics: Olympic[]): void {
    const years: Set<number> = new Set(olympics.flatMap(country => country.participations.map(participation => participation.year)));
    this.nbOlympics = years.size;
  }

  createDatasets(olympics: Olympic[]) {
    olympics.forEach((olympic) => {
      // collects corresponding country color from styles.scss
      this.countryColors.push(this.getCountryColor(olympic.country));
      this.labels.push(olympic.country);
      let medals = 0;
      olympic.participations.forEach((participation) => {
        medals += participation.medalsCount;
      });
      this.medalData.push(medals);
    });
    this.updateChart();
  }

  getCountryColor(country: string): string {
    // collects corresponding country color from styles.scss
    const code = country.toLowerCase().split(' ').join('-');
    let get = getComputedStyle(document.documentElement).getPropertyValue(`--${code}-color`);
    // If color not found, highlight color provided as a fallback
    if (get === '') {
      get = getComputedStyle(document.documentElement).getPropertyValue(`--accent-color`);
    }
    return get;
  }

  updateChart() {
    this.data = {
      labels: this.labels,
      datasets: [
        {
          data: [...this.medalData],
          backgroundColor: [
            ...this.countryColors
          ]
        },
      ],
    };

    this.options = {
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--accent-color'),
          padding: 10,
          displayColors: false,
          titleAlign: 'center',
          bodyAlign: 'center',
        },
        elements: {
          arc: {
            borderColor: 'transparent'
          }
        }
      }
    }
  }
}
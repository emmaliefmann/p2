import { Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Chart } from 'chart.js';
import { Message } from 'primeng/api';
import { ChartClickEvent } from 'src/app/core/models/ChartClickEvent.model';
import { Olympic } from 'src/app/core/models/olympic.model';

@Component({
  selector: 'app-piechart',
  templateUrl: './piechart.component.html',
  styleUrl: './piechart.component.scss'
})

export class PiechartComponent {

  @Input()
  olympics!: Olympic[];

  @ViewChild('chart') chart!: Chart;

  public data!: any;
  public labels: string[] = [];
  public options: any;
  public messages: Message[] = [];
  
  private medalData: number[] = [];
  private countryColors: string[] = [];

  constructor(private router: Router) { }

  ngOnInit(): void {
    if (this.olympics.length > 0) {
      this.createDatasets(this.olympics);
    } else {
      this.messages = this.messages = [{
        severity: 'error',
        detail: 'An error occurred retrieving the data, try again later'
      }]
    }
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

  handleClick($event: ChartClickEvent) {
    const i: number = $event.element.index;
    const selected: string = this.data.labels[i];
    if (selected) {
      this.router.navigate([`/detail/${selected}`]);
    }
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

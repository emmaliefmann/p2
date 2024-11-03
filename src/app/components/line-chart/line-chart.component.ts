import { Component, Input } from '@angular/core';
import { Olympic } from 'src/app/core/models/olympic.model';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss'
})

export class LineChartComponent {
  @Input()
  countryData!: Olympic;
  public data: any;
  public options: any;

  private medalData: number[] = [];
  private chartLabels: string[] = [];

  ngOnInit(): void {
    if (this.countryData) {
      this.createChartData(this.countryData);
    }
  }

  createChartData(olympic: Olympic) {
    olympic.participations.forEach((participation) => {
      this.medalData.push(participation.medalsCount);
      this.chartLabels.push(participation.year.toString());
    });
    this.updateChart();
  }

  updateChart() {
    this.data = {
      labels: this.chartLabels,
      datasets: [
        {
          label: 'Medals per year',
          data: [...this.medalData],
          fill: false,
        },
      ],
    };

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
    };
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { Olympic } from '../../core/models/olympic.model';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-detail',
  standalone: false,
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})

export class DetailComponent implements OnInit {
  country!: string;
  nbEntries: number = 0;
  nbMedals: number = 0;
  nbAthletes: number = 0;
  medalData: number[] = [];
  chartLabels: string[] = [];
  data: any;
  options: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private olympicService: OlympicService
  ) {}

  ngOnInit(): void {
    if (this.route.snapshot.paramMap.get('id') !== null) {
      this.country = this.route.snapshot.paramMap.get('id')!;
      this.getDetailData();
    }
  }
  getDetailData() {
    this.olympicService.getOlympicByName(this.country).subscribe({
      next: (olympic) => {
        if (olympic) {
          this.createChartData(olympic);
        } else {
          this.router.navigate(['/notfound']);
        }
      },
      error: (err) => {
        console.warn(err);
        this.router.navigate(['/notfound']);
      },
    });
  }
  createChartData(olympic: Olympic) {
    this.nbEntries = olympic.participations.length;

    olympic.participations.forEach((participation) => {
      this.nbMedals += participation.medalsCount;
      this.medalData.push(participation.medalsCount);
      this.nbAthletes += participation.athleteCount;
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

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { Olympic } from '../../core/models/olympic.model';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})

export class DetailComponent implements OnInit {
  public country!: string;
  public nbEntries: number = 0;
  public nbMedals: number = 0;
  public nbAthletes: number = 0;
  public data: any;
  public options: any;
  public countryData!: Olympic; 

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
    this.olympicService.getOlympicByName(this.country)
    .pipe(take(1))
    .subscribe({
      next: (olympic) => {
        if (olympic) {
          this.countryData = olympic;
          this.nbEntries = olympic.participations.length;
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
      this.nbAthletes += participation.athleteCount;
    });
  }

}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, Subject, takeUntil } from 'rxjs';
import { ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { Router } from '@angular/router';

import { Olympic } from 'src/app/core/models/olympic.model';
import { OlympicService } from 'src/app/core/services/olympic.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild('chart') chart!: Chart;

  public olympics$: Observable<Olympic[] | null> = of(null);
  public data!: any;
  public labels: string[] = [];
  public options: any;
  public nbOlympics: number = 0;
  public olympicsData!: Olympic[];

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
            this.olympicsData = olympics;
            this.getNumberOfJO(olympics);
          }
        },
        error: (err) => console.warn(err)
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }

  getNumberOfJO(olympics: Olympic[]): void {
    const years: Set<number> = new Set(olympics.flatMap(
      country => country.participations.map(participation => participation.year)));
    this.nbOlympics = years.size;
  }
}
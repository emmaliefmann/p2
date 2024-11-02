import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { OlympicService } from './core/services/olympic.service';
import { Message } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  public isLoading = false;
  public errorMessage: string | null = null;
  public messages: Message[] = [];
  constructor(private olympicService: OlympicService) { }

  ngOnInit(): void {
    this.olympicService.loadInitialData().pipe(take(1)).subscribe();
    this.olympicService.loading$.subscribe((loading) => {
      this.isLoading = loading;
    });

    this.olympicService.errorMessage$.subscribe((error) => {
      this.errorMessage = error;
      if (error) {
        this.messages = [{
          severity: 'error',
          detail: error
        }]
      }
    })
  }
}

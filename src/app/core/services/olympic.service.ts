import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Olympic } from '../models/olympic.model';

@Injectable({
  providedIn: 'root',
})

export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[]>([]);
  private loadingSubject$ = new BehaviorSubject<boolean>(false);
  private errorMessageSubject$ = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) { }

  loadInitialData() {
    this.loadingSubject$.next(true);
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => {
        this.olympics$.next(value);
        this.loadingSubject$.next(false);
        // to clear error, if previously error
        this.errorMessageSubject$.next(null);
      }),
      catchError((error) => {
        console.error('Error loading Olympics data:', error);
        this.olympics$.next([]);
        this.loadingSubject$.next(false);
        this.errorMessageSubject$.next('Failed to load Olympics data. Please try again later.');
        return of([]);
      })
    );
  }

  get loading$() {
    return this.loadingSubject$.asObservable();
  }

  get errorMessage$() {
    return this.errorMessageSubject$.asObservable();
  }

  getOlympics(): Observable<Olympic[]> {
    return this.olympics$.asObservable();
  }

  getOlympicByName(name: string): Observable<Olympic | null> {
    this.loadingSubject$.next(true);
    return this.olympics$.pipe(
      map((olympics) => {
        const found = olympics?.find((olympic: Olympic) => olympic.country === name);
        this.loadingSubject$.next(false); 
        this.errorMessageSubject$.next(null); 
        return found || null;
      }),
      catchError((error) => {
        console.error('Error fetching Olympics data:', error);
        this.loadingSubject$.next(false);
        this.errorMessageSubject$.next(`Failed to fetch Olympic data for ${name}. Please try again later.`);
        return of(null);
      })
    );
  }
}

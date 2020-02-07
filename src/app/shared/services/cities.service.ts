import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { City } from '../models/city.model';
import { Observable, throwError } from 'rxjs';
import { NotificationService } from './notification.service';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CitiesService {

    constructor(
        private http: HttpClient,
        private notificationService: NotificationService,
    ) { }

    public getAll(): Observable<City[]> {
        return this.http.get<City[]>(`${environment.apiUrl}/cities`);
    }

    public get(id: number): Observable<City> {
        return this.http.get<City>(`${environment.apiUrl}/cities/${id}`);
    }

    public add(city: City): Observable<City> {
        return this.http.post<City>(`${environment.apiUrl}/cities`, city).pipe(
            tap(() => this.notificationService.success(`City ${city.name} added.`)),
            catchError(err => {
                this.notificationService.error(`Unable to add city ${city.name}.`);
                return throwError(err);
            })
        );
    }

    public update(city: City): Observable<City> {
        return this.http.put<City>(`${environment.apiUrl}/cities/${city.id}`, city).pipe(
            tap(() => this.notificationService.success(`City ${city.name} updated.`)),
            catchError(err => {
                this.notificationService.error(`Unable to update city ${city.name}.`);
                return throwError(err);
            })
        );
    }

    public delete(city: City): Observable<City> {
        return this.http.delete<City>(`${environment.apiUrl}/cities/${city.id}`).pipe(
            tap(() => this.notificationService.success(`City ${city.name} deleted.`)),
            catchError(err => {
                this.notificationService.error(`Unable to delete city ${city.name}.`);
                return throwError(err);
            })
        );
    }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { City } from '../models/city.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CitiesService {

    constructor(private http: HttpClient) {
    }

    public getAll(): Observable<City[]> {
        return this.http.get<City[]>(`${environment.apiUrl}/cities`);
    }

    public get(id: number): Observable<City> {
        return this.http.get<City>(`${environment.apiUrl}/cities/${id}`);
    }

    public add(city: City): Observable<City> {
        return this.http.post<City>(`${environment.apiUrl}/cities`, city);
    }

    public update(city: City): Observable<City> {
        return this.http.put<City>(`${environment.apiUrl}/cities/${city.id}`, city);
    }

    public delete(city: City): Observable<City> {
        return this.http.delete<City>(`${environment.apiUrl}/cities/${city.id}`);
    }

}

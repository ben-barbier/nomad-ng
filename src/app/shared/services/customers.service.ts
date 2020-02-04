import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Customer } from '../models/customer.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CustomersService {

    constructor(private http: HttpClient) {
    }

    public getAll(): Observable<Customer[]> {
        return this.http.get<Customer[]>(`${environment.apiUrl}/customers`);
    }

    public get(id: number): Observable<Customer> {
        return this.http.get<Customer>(`${environment.apiUrl}/customers/${id}`);
    }

    public add(customer: Customer): Observable<Customer> {
        return this.http.post<Customer>(`${environment.apiUrl}/customers`, customer);
    }

    public update(customer: Customer): Observable<Customer> {
        return this.http.put<Customer>(`${environment.apiUrl}/customers/${customer.id}`, customer);
    }

    public delete(customer: Customer): Observable<Customer> {
        return this.http.delete<Customer>(`${environment.apiUrl}/customers/${customer.id}`);
    }

}

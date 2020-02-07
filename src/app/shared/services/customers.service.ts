import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Customer } from '../models/customer.model';
import { Observable, throwError } from 'rxjs';
import { NotificationService } from './notification.service';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class CustomersService {

    constructor(
        private http: HttpClient,
        private notificationService: NotificationService,
    ) { }

    public getAll(): Observable<Customer[]> {
        return this.http.get<Customer[]>(`${environment.apiUrl}/customers`).pipe(
            catchError(err => {
                this.notificationService.error(`Unable to get customers.`);
                return throwError(err);
            }),
        );
    }

    public get(id: number): Observable<Customer> {
        return this.http.get<Customer>(`${environment.apiUrl}/customers/${id}`).pipe(
            catchError(err => {
                this.notificationService.error(`Unable to get customer ${id}.`);
                return throwError(err);
            }),
        );
    }

    public add(customer: Customer): Observable<Customer> {
        return this.http.post<Customer>(`${environment.apiUrl}/customers`, customer).pipe(
            tap(() => this.notificationService.success(`Customer ${customer.name} added.`)),
            catchError(err => {
                this.notificationService.error(`Unable to add customer ${customer.name}.`);
                return throwError(err);
            }),
        );
    }

    public update(customer: Customer): Observable<Customer> {
        return this.http.put<Customer>(`${environment.apiUrl}/customers/${customer.id}`, customer).pipe(
            tap(() => this.notificationService.success(`Customer ${customer.name} updated.`)),
            catchError(err => {
                this.notificationService.error(`Unable to update customer ${customer.name}.`);
                return throwError(err);
            }),
        );
    }

    public delete(customer: Customer): Observable<Customer> {
        return this.http.delete<Customer>(`${environment.apiUrl}/customers/${customer.id}`).pipe(
            tap(() => this.notificationService.success(`Customer ${customer.name} deleted.`)),
            catchError(err => {
                this.notificationService.error(`Unable to delete customer ${customer.name}.`);
                return throwError(err);
            }),
        );
    }

}

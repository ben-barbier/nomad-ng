import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from '../models/order.model';
import { environment } from '../../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { Customer } from '../models/customer.model';
import { catchError, tap } from 'rxjs/operators';
import { NotificationService } from './notification.service';

@Injectable({
    providedIn: 'root'
})
export class OrdersService {

    constructor(
        private http: HttpClient,
        private notificationService: NotificationService,
    ) { }

    public getAll(): Observable<Order[]> {
        throw Error('☠️ Unable to load all orders in same time !');
    }

    public get(id: number): Observable<Order> {
        return this.http.get<Order>(`${environment.apiUrl}/orders/${id}`).pipe(
            catchError(err => {
                this.notificationService.error(`Unable to get order ${id}.`);
                return throwError(err);
            }),
        );
    }

    public getByCustomer(customer: Customer): Observable<Order[]> {
        return this.http.get<Order[]>(`${environment.apiUrl}/customers/${customer.id}/orders`);
    }

    public add(order: Order): Observable<Order> {
        return this.http.post<Order>(`${environment.apiUrl}/orders`, order).pipe(
            tap(() => this.notificationService.success(`Order ${order.id} added.`)),
            catchError(err => {
                this.notificationService.error(`Unable to add order ${order.id}.`);
                return throwError(err);
            }),
        );
    }

    public update(order: Order): Observable<Order> {
        return this.http.put<Order>(`${environment.apiUrl}/orders/${order.id}`, order).pipe(
            tap(() => this.notificationService.success(`Order ${order.id} updated.`)),
            catchError(err => {
                this.notificationService.error(`Unable to update order ${order.id}.`);
                return throwError(err);
            }),
        );
    }

    public delete(order: Order): Observable<Order> {
        return this.http.delete<Order>(`${environment.apiUrl}/orders/${order.id}`).pipe(
            tap(() => this.notificationService.success(`Order ${order.id} deleted.`)),
            catchError(err => {
                this.notificationService.error(`Unable to delete order ${order.id}.`);
                return throwError(err);
            }),
        );
    }

}

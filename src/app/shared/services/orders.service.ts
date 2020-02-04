import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from '../models/order.model';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer.model';

@Injectable({
    providedIn: 'root'
})
export class OrdersService {

    constructor(public http: HttpClient) {
    }

    public getAll(): Observable<Order[]> {
        throw Error('☠️ Unable to load all orders in same time !');
    }

    public get(id: number): Observable<Order> {
        return this.http.get<Order>(`${environment.apiUrl}/orders/${id}`);
    }

    public getByCustomer(customer: Customer): Observable<Order[]> {
        return this.http.get<Order[]>(`${environment.apiUrl}/customers/${customer.id}/orders`);
    }

    public add(order: Order): Observable<Order> {
        return this.http.post<Order>(`${environment.apiUrl}/orders`, order);
    }

    public update(order: Order): Observable<Order> {
        return this.http.put<Order>(`${environment.apiUrl}/orders/${order.id}`, order);
    }

    public delete(order: Order): Observable<Order> {
        return this.http.delete<Order>(`${environment.apiUrl}/orders/${order.id}`);
    }

}

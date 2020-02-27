import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { SavingStatusEnum } from './saving-status.enum';
import { SavingIndicatorService } from './saving-indicator/saving-indicator.service';
import { BehaviorSubject, combineLatest, Observable, Subject, throwError } from 'rxjs';
import { catchError, concatMap, filter, map, pluck, retryWhen, tap } from 'rxjs/operators';
import { ConnectionService } from '../connection.service';

@Injectable({
    providedIn: 'root'
})
export class OfflineService {

    private requestQueue$ = new BehaviorSubject<HttpRequest<any>[]>(JSON.parse(localStorage.getItem('requestQueue')) || []);
    private resumeLoading$ = new Subject<void>();

    constructor(
        private savingIndicatorService: SavingIndicatorService,
        private connection: ConnectionService,
        private http: HttpClient,
    ) {
        combineLatest([
            this.requestQueue$,
            this.connection.isOnline$,
        ]).pipe(
            tap(([requestQueue, isOnline]) => !isOnline && this.savingIndicatorService.savingStatus.next(SavingStatusEnum.NOT_SAVING)),
            filter(([requestQueue, isOnline]) => isOnline && requestQueue.length > 0),
            tap(() => this.savingIndicatorService.savingStatus.next(SavingStatusEnum.SAVING)),
            map(([requestQueue]): HttpRequest<any> => requestQueue[0]),
            concatMap(request => this.sendRequest<any>(request).pipe(
                catchError(err => {
                    this.savingIndicatorService.savingStatus.next(SavingStatusEnum.FAILED);
                    return throwError(err);
                }),
                retryWhen(() => this.resumeLoading$),
            )),
            tap(() => this.savingIndicatorService.savingStatus.next(SavingStatusEnum.SAVING)),
            pluck('request'),
            map(request => this.requestQueue$.getValue().filter((elt) => elt !== request)),
            tap(newRequestQueue => localStorage.setItem('requestQueue', JSON.stringify(newRequestQueue))),
            tap(newRequestQueue => this.requestQueue$.next(newRequestQueue)),
            filter(newRequestQueue => newRequestQueue.length === 0),
            tap(() => this.savingIndicatorService.savingStatus.next(SavingStatusEnum.SUCCESS)),
        ).subscribe();
    }

    public addRequestToQueue(req: HttpRequest<any>) {
        const clone = req.clone({
            headers: req.headers
                .append('fromOfflineService', 'true')
                .delete('Authorization'),
            body: { ...req.body }, // 💡: clone() do not create a new reference of body.
        });
        const newRequestQueue = this.requestQueue$.getValue().concat(clone);
        localStorage.setItem('requestQueue', JSON.stringify(newRequestQueue));
        this.requestQueue$.next(newRequestQueue);
    }

    public isPendingRequest(req: HttpRequest<any>): boolean {
        return req.headers.get('fromOfflineService') === 'true';
    }

    public hasPendingRequest(): boolean {
        return this.requestQueue$.getValue().length > 0;
    }

    public resumeLoading(): void {
        this.resumeLoading$.next();
    }

    private sendRequest<T>(request: HttpRequest<T>): Observable<{ request: HttpRequest<T>, response: HttpResponse<T> }> {
        const { method, url, ...options } = request;
        return this.http.request(method, url, { ...options, observe: 'response' }).pipe(
            map(response => ({ request, response })),
        );
    }

}

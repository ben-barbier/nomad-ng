import { Component, EventEmitter, Input, Output } from '@angular/core';
import { finalize, tap } from 'rxjs/operators';
import { Customer } from '../../../shared/models/customer.model';
import { CustomersService } from '../../../shared/services/customers.service';
import { CacheService } from '../../../nomad/preload/cache.service';

@Component({
    selector: 'app-customer',
    templateUrl: './customer.component.html',
    styleUrls: ['./customer.component.scss']
})
export class CustomerComponent {

    @Input() public customer: Customer;
    @Output() public deleted = new EventEmitter<void>();

    public isPending = false;
    public isPristine = true;

    constructor(
        private customersService: CustomersService,
        private cacheService: CacheService,
    ) { }

    public updateCustomer() {
        this.isPending = true;
        this.customersService.update(this.customer).pipe(
            tap(() => this.cacheService.partialUpdateById('customers', this.customer, this.customer.id)),
            tap(() => this.isPristine = true),
            finalize(() => this.isPending = false),
        ).subscribe();
    }

    public deleteCustomer() {
        this.isPending = true;
        this.customersService.delete(this.customer).pipe(
            tap(() => this.cacheService.partialDeleteById('customers', this.customer.id)),
            tap(() => this.deleted.emit()),
            finalize(() => this.isPending = false),
        ).subscribe();
    }

    public change() {
        this.isPristine = false;
    }

}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { finalize, tap } from 'rxjs/operators';
import { Customer } from '../../../shared/models/customer.model';
import { CustomersService } from '../../../shared/services/customers.service';

@Component({
    selector: 'app-customer',
    templateUrl: './customer.component.html',
    styleUrls: ['./customer.component.scss']
})
export class CustomerComponent {

    @Input() public customer: Customer;
    @Output() public deleted = new EventEmitter<void>();

    public isPending = false;

    constructor(private customersService: CustomersService) { }

    public updateCustomer() {
        this.isPending = true;
        this.customersService.update(this.customer).pipe(
            finalize(() => this.isPending = false),
        ).subscribe();
    }

    public deleteCustomer() {
        this.isPending = true;
        this.customersService.delete(this.customer).pipe(
            tap(() => this.deleted.emit()),
            finalize(() => this.isPending = false),
        ).subscribe();
    }

}

import { Component } from '@angular/core';
import { CustomersService } from '../../shared/services/customers.service';
import { CitiesService } from '../../shared/services/cities.service';
import { OrdersService } from '../../shared/services/orders.service';
import { Customer } from '../../shared/models/customer.model';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {

    public customers$ = this.customersService.getAll();
    public cities$ = this.citiesService.getAll();
    public orders$ = this.ordersService.getByCustomer({id: 3} as Customer);

    constructor(private customersService: CustomersService,
                private citiesService: CitiesService,
                private ordersService: OrdersService,
    ) {
    }

}

import { Component } from '@angular/core';
import { CustomersService } from '../../shared/services/customers.service';
import { CitiesService } from '../../shared/services/cities.service';
import { OrdersService } from '../../shared/services/orders.service';
import { Customer } from '../../shared/models/customer.model';
import { City } from '../../shared/models/city.model';
import { StoreService } from '../../shared/services/store.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {

    public customers: Customer[] = [];
    public cities: City[] = [];
    public orders$ = this.ordersService.getByCustomer({ id: 3 } as Customer);

    constructor(private customersService: CustomersService,
                private citiesService: CitiesService,
                private ordersService: OrdersService,
                private store: StoreService,
    ) {
        this.store.customers$.subscribe(customers => this.customers = customers);
        this.store.cities$.subscribe(cities => this.cities = cities);
    }

    public updateCustomer(customer: Customer) {
        this.customersService.update(customer).subscribe(() => {
            this.customers = this.customers
                .filter(c => c.id !== customer.id)
                .concat(customer)
                .sort((c1, c2) => c1.id - c2.id);
        });
    }

    public deleteCustomer(customer: Customer) {
        this.customersService.delete(customer).subscribe(() => {
            this.customers = this.customers.filter(c => c.id !== customer.id);
        });
    }

    public updateCity(city: City) {
        this.citiesService.update(city).subscribe(() => {
            this.cities = this.cities
                .filter(c => c.id !== city.id)
                .concat(city)
                .sort((c1, c2) => c1.id - c2.id);
        });
    }

    public deleteCity(city: City) {
        this.citiesService.delete(city).subscribe(() => {
            this.cities = this.cities.filter(c => c.id !== city.id);
        });
    }

}

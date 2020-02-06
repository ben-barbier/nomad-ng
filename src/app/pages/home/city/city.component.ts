import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { City } from '../../../shared/models/city.model';
import { CitiesService } from '../../../shared/services/cities.service';
import { finalize, tap } from 'rxjs/operators';

@Component({
    selector: 'app-city',
    templateUrl: './city.component.html',
    styleUrls: ['./city.component.scss']
})
export class CityComponent {

    @Input() public city: City;
    @Output() public deleted = new EventEmitter<void>();

    public isPending = false;

    constructor(private citiesService: CitiesService) { }

    public updateCity() {
        this.isPending = true;
        this.citiesService.update(this.city).pipe(
            finalize(() => this.isPending = false),
        ).subscribe();
    }

    public deleteCity() {
        this.isPending = true;
        this.citiesService.delete(this.city).pipe(
            tap(() => this.deleted.emit()),
            finalize(() => this.isPending = false),
        ).subscribe();
    }

}

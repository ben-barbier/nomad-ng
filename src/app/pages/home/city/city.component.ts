import { Component, EventEmitter, Input, Output } from '@angular/core';
import { City } from '../../../shared/models/city.model';
import { CitiesService } from '../../../shared/services/cities.service';
import { finalize, tap } from 'rxjs/operators';
import { CacheService } from '../../../nomad/preload/cache.service';

@Component({
    selector: 'app-city',
    templateUrl: './city.component.html',
    styleUrls: ['./city.component.scss']
})
export class CityComponent {

    @Input() public city: City;
    @Output() public deleted = new EventEmitter<void>();

    public isPending = false;

    constructor(
        private citiesService: CitiesService,
        private cacheService: CacheService,
    ) { }

    public updateCity() {
        this.isPending = true;
        this.citiesService.update(this.city).pipe(
            tap(() => this.cacheService.partialUpdateById('cities', this.city, this.city.id)),
            finalize(() => this.isPending = false),
        ).subscribe();
    }

    public deleteCity() {
        this.isPending = true;
        this.citiesService.delete(this.city).pipe(
            tap(() => this.cacheService.partialDeleteById('cities', this.city.id)),
            tap(() => this.deleted.emit()),
            finalize(() => this.isPending = false),
        ).subscribe();
    }

}

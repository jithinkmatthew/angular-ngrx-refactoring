import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {Flight} from '../../../../core/api/models/flight';
import {FlightService} from '../../services/flight.service';
import {DOCUMENT} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styles: [`
    input.is-valid {
      border-width: 3px;
    }
    .url-state{
      font-size: 14px;
      width: 300px;
      overflow-x: scroll;
      display: block;
    }
    .bg-white {
      background-color: #fff;
    }
  `]
})
export class SearchComponent implements OnInit {

  searchResult$: Observable<Flight[]>
  isFindPending$: Observable<boolean>

  searchForm: FormGroup

  constructor(
    @Inject(DOCUMENT) private document: HTMLDocument,
    private fb: FormBuilder,
    private fs: FlightService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.searchForm = fb.group({
      from: [],
      to: []
    })

    this.route.params.subscribe(
      (data: { from: string, to: string }) => {
        const searchFormData = Object.assign({from: '', to: ''}, data)
        this.searchForm.patchValue(searchFormData)
      }
    )

    this.searchResult$ = this.fs.flights$
      .map(flights => flights.sort(this.orderByDate))

    this.isFindPending$ = this.fs.isFindPending$
  }

  ngOnInit() {

  }

  getUrl(): string {
    return this.document.location.href
  }

  trackByDate(index: number, item: Flight) {
    return item.id
  }

  searchFlights(form: FormGroup) {
    const data = form.value
    this.router.navigate(['./', {from: data.from, to: data.to}])
  }

  refreshFlights() {
    this.router.navigate(['./', {from: null, to: null}])
  }

  private orderByDate(a, b) {
    a = new Date(a.date).getTime();
    b = new Date(b.date).getTime();
    return a > b ? -1 : a < b ? 1 : 0;
  }

}

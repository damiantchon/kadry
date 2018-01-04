import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MinimumKadroweService } from '../minimum-kadrowe.service';
import { MinimumKadroweModel } from '../minimum-kadrowe.model';
import { Subscription } from 'rxjs/Subscription';
import { PracownicyService } from '../../pracownicy/pracownicy.service';

@Component({
  selector: 'app-minimum-kadrowe-list',
  templateUrl: './minimum-kadrowe-list.component.html',
  styleUrls: ['./minimum-kadrowe-list.component.css']
})
export class MinimumKadroweListComponent implements OnInit {

  dtOptions: any = {};

  minimaKadroweList: MinimumKadroweModel[] = [];

  subscriptions: Subscription[] = [];

  constructor(private router: Router,
              private minimumKadroweService: MinimumKadroweService,
              private pracownicyService: PracownicyService) { }

  ngOnInit() {
    this.subscriptions[0] = this.minimumKadroweService.minimaKadroweActivated
      .subscribe(
        (minimaKadrowe: MinimumKadroweModel[]) => {
          this.minimaKadroweList = minimaKadrowe;
        }
      );
    this.minimaKadroweList = this.minimumKadroweService.minimaKadroweList;

    this.dtOptions = {
      "columnDefs": [
        {"targets": [ 4 ],
          "visible": false},
        {"targets": [ 5 ],
          "visible": false}],
      order: [[0, "asc"]],
      language: {
        "processing":     "Przetwarzanie...",
        "search":         "Szukaj: ",
        "lengthMenu":     "Pokaż _MENU_ pozycji",
        "info":           "Pozycje od _START_ do _END_ z _TOTAL_ łącznie",
        "infoEmpty":      "Pozycji 0 z 0 dostępnych",
        "infoFiltered":   "(filtrowanie spośród _MAX_ dostępnych pozycji)",
        "infoPostFix":    "",
        "loadingRecords": "Wczytywanie...",
        "zeroRecords":    "Nie znaleziono pasujących pozycji",
        "emptyTable":     "Brak danych",
        "paginate": {
          "first":      "Pierwsza",
          "previous":   "Poprzednia",
          "next":       "Następna",
          "last":       "Ostatnia"
        },
        "aria": {
          "sortAscending": ": aktywuj, by posortować kolumnę rosnąco",
          "sortDescending": ": aktywuj, by posortować kolumnę malejąco"
        }
      },
      lengthMenu: [[10, 20 ,50 ,-1], [10, 20, 50, "All"]],
      initComplete: () => {
        $(".table").show();
      }
    };


  }

  onActivate(minimumKadrowe) {
    console.log(minimumKadrowe);
    this.router.navigate(['/minimum-kadrowe', minimumKadrowe._id]);
  }

  getPracownicyNamesByIds(ids: string[]) {
    return this.pracownicyService.getPracownicyNamesByIds(ids);
  }

}

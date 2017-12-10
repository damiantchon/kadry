import { Component, OnInit } from '@angular/core';
import { PracownicyService } from '../pracownicy.service';
import { PracownikModel } from '../pracownik.model';

@Component({
  selector: 'app-pracownicy-list',
  templateUrl: './pracownicy-list.component.html',
  styleUrls: ['./pracownicy-list.component.css']
})
export class PracownicyListComponent implements OnInit {

  dtOptions: DataTables.Settings = {};

  private pracownicyList: PracownikModel[] = [];

  constructor(private pracownicyService: PracownicyService) { }

  ngOnInit() {
      this.pracownicyList = this.pracownicyService.getPracownicy();

      this.dtOptions = {
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

        //Zapobieganie pokazywaniu się strony przed załadowaniem modułu datatable
        initComplete: () => {
          $(".table").show();
        }
      };
  }

  onActivate(pracownik: PracownikModel) {
    this.pracownicyService.pracownikActivated.next(pracownik);
  }
}

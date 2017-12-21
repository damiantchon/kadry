import { Component, OnDestroy, OnInit } from '@angular/core';
import { PracownicyService } from '../pracownicy.service';
import { PracownikModel } from '../pracownik.model';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pracownicy-list',
  templateUrl: './pracownicy-list.component.html',
  styleUrls: ['./pracownicy-list.component.css']
})
export class PracownicyListComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  editMode: boolean = false;
  // dtOptions: DataTables.Settings = {};
  dtOptions: any = {};
  tableIsReady = false;
  private pracownicyList: PracownikModel[] = [];

  constructor(private pracownicyService: PracownicyService,
              private router: Router) { }

  ngOnInit() {
    this.subscription = this.pracownicyService.pracownikActivated
      .subscribe(
        (pracownicy: PracownikModel[]) => {
          this.pracownicyList = pracownicy;
        }
      );
    this.pracownicyList = this.pracownicyService.pracownicyList;

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
        lengthMenu: [[10, 20 ,50 ,-1], [10, 20, 50, "All"]],
        //Zapobieganie pokazywaniu się strony przed załadowaniem modułu datatable
        initComplete: () => {
          this.tableIsReady = true;
          $(".table").show();
        }
      };
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onActivate(pracownik: PracownikModel) {
    this.router.navigate(['/pracownicy', pracownik._id]);
    //this.pracownicyService.pracownikActivated.next(pracownik);
  }
}

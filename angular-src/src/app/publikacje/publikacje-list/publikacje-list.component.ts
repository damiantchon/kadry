import { Component, OnInit } from '@angular/core';
import { PublikacjaModel } from '../publikacja.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-publikacje-list',
  templateUrl: './publikacje-list.component.html',
  styleUrls: ['./publikacje-list.component.css']
})
export class PublikacjeListComponent implements OnInit {

  dtOptions: any = {};

  publikacje: PublikacjaModel[] = [
    new PublikacjaModel(
      'abcd1234',
      ['autorWewnetrzny1', 'autorWewnetrzny2'],
      ['Sławek', 'Juzio'],
      'Przykładowy Tytuł Publikacji',
      'FAKT',
      '10',
      '4',
      '2017',
      '20-23',
      'doi:10.2105/AJPH.2009.160184',
      50)
  ];

  constructor(private router: Router) { }

  ngOnInit() {

    this.dtOptions = {
      //ordering: false,
      order: [[0, "desc"]],
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

  onActivate(publikacja) {
    this.router.navigate(['/publikacje', publikacja._id]);
  }

}

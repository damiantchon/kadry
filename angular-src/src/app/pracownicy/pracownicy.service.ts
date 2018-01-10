import { PracownikModel } from './pracownik.model';
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';

import * as pdfMake from 'pdfmake/build/pdfmake.js';
import * as pdfFonts from 'pdfmake/build/vfs_fonts.js';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable()
export class PracownicyService {

  constructor(private http: HttpClient) {
    this.przedmioty.sort();
    this.getPracownicy()
      .subscribe(
        (pracownicy: PracownikModel[]) => {
          this.pracownicyList = pracownicy;
          this.pracownikActivated.next(this.pracownicyList);
        }
      );
  }
  stopnieWojskowe: any = [
    {"nazwa": "brak",
      "skrot": ""},
    {"nazwa": "szeregowy",
      "skrot": "szer."},
    {"nazwa": "starszy szeregowy",
      "skrot": "st. szer."},
    {"nazwa": "kapral",
      "skrot": "kpr."},
    {"nazwa": "starszy kapral",
      "skrot": "st. kpr."},
    {"nazwa": "plutonowy",
      "skrot": "plut."},
    {"nazwa": "sierżant",
      "skrot": "sierż."},
    {"nazwa": "starszy sierżant",
      "skrot": "st. sierż."},
    {"nazwa": "młodszy chorąży",
      "skrot": "mł. chor."},
    {"nazwa": "chorąży",
      "skrot": "chor."},
    {"nazwa": "starszy chorąży",
      "skrot": "st. chor."},
    {"nazwa": "starszy chorąż sztabowy",
      "skrot": "st. chor. szt"},
    {"nazwa": "podporucznik",
      "skrot": "ppor."},
    {"nazwa": "porucznik",
      "skrot": "por."},
    {"nazwa": "kapitan",
      "skrot": "kpt."},
    {"nazwa": "major",
      "skrot": "mjr"},
    {"nazwa": "podpułkownik",
      "skrot": "ppłk"},
    {"nazwa": "pułkownik",
      "skrot": "płk"},
    {"nazwa": "generał brygady",
      "skrot": "gen. bryg."},
    {"nazwa": "generał dywizji",
      "skrot": "gen. dyw."},
    {"nazwa": "generał broni",
      "skrot": "gen. broni"},
    {"nazwa": "generał",
      "skrot": "gen"},

  ];

  tytuly: any = [
    {"nazwa": "magister",
      "skrot": "mgr"},
    {"nazwa": "magister inżynier",
      "skrot": "mgr inż."},
    {"nazwa": "doktor",
      "skrot": "dr"},
    {"nazwa": "doktor inżynier",
      "skrot": "dr inż."},
    {"nazwa": "doktor habilitowany",
      "skrot": "dr hab."},
    {"nazwa": "doktor habilitowany inżynier",
      "skrot": "dr hab. inż."},
    {"nazwa": "profesor nadzwyczajny doktor habilitowany",
      "skrot": "prof. nadzw. dr hab."},
    {"nazwa": "profesor nadzwyczajny doktor habilitowany inżynier",
      "skrot": "prof. nadzw. dr hab. inż."},
    {"nazwa": "profesor doktor habilitowany",
      "skrot": "prof. dr hab."},
    {"nazwa": "profesor doktor habilitowany inżynier",
      "skrot": "prof. dr hab. inż."},
  ];

  przedmioty: string[] = [
    "Filozofia",
    "Bezpieczeństwo pracy i ergonomia",
    "Podstawy zarządzania",
    "Psychologia",
    "Wychowanie fizyczne",
    "Bezpieczeństwo i higiena pracy",
    "Algebra liniowa",
    "Fizyka",
    "Matematyka dyskretna I",
    "Analiza matematyczna I",
    "Matematyka dyskretna II",
    "Analiza matematyczna II",
    "Teoria grafów i sieci",
    "Rachunek prawodopodobieństwa",
    "Podstawy elektroniki i miernictwa",
    "Statystyka matematyczna",
    "Wprowadzenie do programowania",
    "Architektura i organizacja komputerów I",
    "Podstawy techniki komputerów",
    "Podstawy układów cyfrowych",
    "Architektura i organizacja komputerów II",
    "Algorytmy i strutury danych",
    "Teoretyczne podstawy informatyki",
    "Teoria informacji kodowania",
    "Programowanie niskopoziomowe i analiza kodu",
    "Wprowadzenie do automatyki",
    "Wstęp do kryptologii",
    "Programowanie obiektowe",
    "Grafika komputerowa",
    "Bazy danych",
    "Podstawy optymalizacji",
    "Sztuczna inteligencja",
    "Ochrona własności intelektualnej",
    "Systemy wejścia-wyjścia komputerów",
    "Języki i techniki programowania",
    "Modelowanie matematyczne",
    "Systemy operacyjne",
    "Inżynieria oprogramowania",
    "Systemy wbudowane",
    "Sieci komputerowe",
    "Programowanie współbieżne",
    "Podstawy bezpieczeństwa informacji",
    "Niezawodność systemów komputerowych",
    "Podstawy symulacji",
    "Etyka zawodowa",
    "Komunikacja człowiek-komputer",
    "Analiza i wizualizacja danych",
    "Metody numeryczne",
    "Metody eksploracji danych",
    "Sieci neuronowe",
    "Hurtownie danych",
    "Języki formalne i kompilatory",
    "Systemy pracy grupowej",
    "Podstawy ekonometrii",
    "Aplikacje internetowe",
    "Metody i narzędzia informatycznego wspomagania decyzji",
    "Podstawy inżynierii systemów",
    "Komputerowe wsparcie wytwarzania oprogramowania",
    "Programowanie zdarzeniowe",
    "Metodyki wytwarzania systemów informatycznych",
    "Obliczenia równoległe i rozproszone",
    "Projekt zespołowy SI"
  ];

  public pracownikActivated = new Subject<PracownikModel[]>();

  public pracownikUpdated = new Subject<PracownikModel>();

  public pracownicyList: PracownikModel[] = [];

  getPracownicy() {

    interface pracownicyResponse {
      lista: PracownikModel[];
    }

    return this.http.get<pracownicyResponse>('http://localhost:3000/pracownicy/get')
      .map((pracownicyList) => {
        console.log(pracownicyList);
         const pracownicy = pracownicyList.lista;
         let pracownicyTransformed: PracownikModel[] = [];

         for (let pracownik of pracownicy) {
           pracownicyTransformed.push(new PracownikModel(
             pracownik._id,
             pracownik.imie,
             pracownik.nazwisko,
             pracownik.stopien,
             pracownik.tytul,
             pracownik.specjalnosc,
             pracownik.email,
             pracownik.przedmioty,
             pracownik.funkcje
           ));
         }
         this.pracownicyList = pracownicyTransformed;
         return pracownicyTransformed;
      })
      .catch((error: Response) => Observable.throw(error));
  }

  getPracownikById(id: string) {
    return this.pracownicyList.find((pracownik) => {return pracownik._id === id});
  }

  getPracownicyNamesByIds(ids: string[]) {
    let pracownicyNames: string[] = [];
    ids.forEach((id) => {

      let tempPracownik = this.getPracownikById(id);
      pracownicyNames.push(tempPracownik.nazwisko + ' ' + tempPracownik.imie);
    });
    return pracownicyNames;
  }

  addPracownik(pracownik: PracownikModel) {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const token = sessionStorage.getItem('token')
      ? '?token=' + sessionStorage.getItem('token')
      : '';
    return this.http.post<PracownikModel>('http://localhost:3000/pracownicy' + token, pracownik, {headers: headers})
      .catch((error: Response) => {
        bootbox.alert('Pracownik o podanym adresie e-mail juz istnieje!');
        return Observable.throw(error);
      });
  }

  updatePracownik(pracownik: PracownikModel) {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const token = sessionStorage.getItem('token')
      ? '?token=' + sessionStorage.getItem('token')
      : '';
    return this.http.put<PracownikModel>('http://localhost:3000/pracownicy' + token, pracownik, {headers: headers})
      .catch((error: Response) => {
        bootbox.alert('Pracownik o podanym adresie e-mail juz istnieje!');
        return Observable.throw(error);
      });
  }

  deletePracownik(pracownik: PracownikModel) {
    const token = sessionStorage.getItem('token')
      ? '?token=' + sessionStorage.getItem('token')
      : '';
    return this.http.delete<PracownikModel>('http://localhost:3000/pracownicy/' + pracownik._id + token)
      .catch((error: Response) => Observable.throw(error));
  }

  getPrzedmiotRaport(przedmiot: string) {
    interface Response {
      lista: any[]
    }
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const token = sessionStorage.getItem('token')
      ? '?token=' + sessionStorage.getItem('token')
      : '';
    return this.http.get<Response>('http://localhost:3000/pracownicy/przedmiot-raport/'+ przedmiot + token,{headers: headers})
      .catch((error: Response) => {
        bootbox.alert('Pracownik o podanym adresie e-mail juz istnieje!');
        return Observable.throw(error);
      });
  }

  generatePrzedmiotRaport(przedmiot: string, action: string) {

    this.getPrzedmiotRaport(przedmiot).subscribe((tempPracownicy) => {
      let pracownicy: PracownikModel[] = tempPracownicy.lista;

      let date = this.getCurrentDate();

      let pracownicyString: string = '';

      pracownicy.sort((pracownikA, pracownikB) => {
        if(pracownikA.nazwisko > pracownikB.nazwisko) return 1;
        else if (pracownikA.nazwisko < pracownikB.nazwisko) return -1;
        else return 0;
      });

      pracownicy.forEach((pracownik) => {
        if(pracownik.stopien !== '') {
          pracownicyString += '- ' + pracownik.stopien + ' ' + pracownik.tytul + ' ' + pracownik.imie + ' ' + pracownik.nazwisko + '\n';
        } else {
          pracownicyString += '- ' + pracownik.tytul + ' ' + pracownik.imie + ' ' + pracownik.nazwisko + '\n';
        }
      });
      if(pracownicyString === '') pracownicyString = 'brak';

      let docDefinition = {

        header: function(currentPage, pageCount) {
          return { text: 'Warszawa, ' + date, alignment: 'right'};
        },
        content: [
          {text: '\nWydział Cybernetyki WAT - raport przedmiotu', style: 'header'},
          {text: '\n\nPrzedmiot:   ' + przedmiot, style: 'normalBold'},
          {text: 'Liczba prowadzących:   ' + pracownicy.length, style: 'normalBold'},

          {text: '\nProwadzacy:', style: 'normalBold'},
          {text: pracownicyString, style: 'normalMargin'},
        ],
        styles: {
          header: {
            fontSize: 24,
            fontFamily: 'arial',
            bold: true,
            alignment: 'center'
          },
          normalBold: {
            fontSize: 16,
            fontFamily: 'arial',
            bold: true,
          },
          normalMargin: {
            fontSize: 16,
            fontFamily: 'arial',
            bold: false,
            marginTop: 5,
            marginBottom: 5
          },
        }
      };

      let fileName: string = 'raport-przedmiotu';

      if(action === 'print') {
        pdfMake.createPdf(docDefinition).print();
      } else if (action === 'download') {
        pdfMake.createPdf(docDefinition).download(fileName);
      } else if (action === 'open') {
        pdfMake.createPdf(docDefinition).open();
      }
    });
  }

  getCurrentDate() {
    let today = new Date();
    let dd:string = today.getDate().toString();
    let mm:string = (today.getMonth()+1).toString(); //January is 0!

    let yyyy = today.getFullYear();
    if(today.getDate()<10){
      dd='0'+dd;
    }
    if((today.getMonth()+1)<10){
      mm='0'+mm;
    }
    return dd+'.'+mm+'.'+yyyy;
  }

}

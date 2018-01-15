import { PublikacjaModel } from './publikacja.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { PracownikModel } from '../pracownicy/pracownik.model';
import * as pdfMake from "pdfmake/build/pdfmake.js";

@Injectable()
export class PublikacjeService {
  constructor(private http: HttpClient) {
    this.getPublikacje()
      .subscribe(
        (publikacje: PublikacjaModel[]) => {
          console.log(publikacje);
          this.publiakcjeList = publikacje;
          this.publikacjeActivated.next(this.publiakcjeList);
        }
      )
  }

  public publiakcjeList: PublikacjaModel[] = [];

  headers = new HttpHeaders({'Content-Type': 'application/json'});

  publikacjeActivated = new Subject<PublikacjaModel[]>();

  isAnAuthor(pracownik: PracownikModel) {
    for (let publikacja of this.publiakcjeList){
      for (let id of publikacja.autorzyWewnetrzniId) {
        if(id === pracownik._id) {
          return true;
        }
      }
    }
    return false;
  }

  getPublikacje() {
    interface publikacjeResponse{
      lista: PublikacjaModel[];
    }

    return this.http.get<publikacjeResponse>('http://localhost:3000/publikacje/get')
      .map((publikacjeList) => {
        console.log(publikacjeList);

        const publikacje = publikacjeList.lista;
        let publikacjeTransformed: PublikacjaModel[] = [];

        for(let publikacja of publikacje) {
          publikacjeTransformed.push(new PublikacjaModel(
            publikacja._id,
            publikacja.rodzajPublikacji,
            publikacja.autorzyWewnetrzniId,
            publikacja.autorzyZewnetrzni,
            publikacja.redaktorzyWewnetrzniId,
            publikacja.redaktorzyZewnetrzni,
            publikacja.tytulPublikacji,
            publikacja.rokPublikacji,
            publikacja.jezykPublikacji,
            publikacja.tytulCzasopisma,
            publikacja.zeszyt,
            publikacja.strony,
            publikacja.tytulRozdzialu,
            publikacja.ISSN,
            publikacja.ISBN,
            publikacja.wydawnictwo,
            publikacja.DOI,
            publikacja.punkty
          ));
        }
          this.publiakcjeList = publikacjeTransformed;
          return publikacjeTransformed;
      })
      .catch((error: Response) => Observable.throw(error));
  }

  getPublikacjaById(id: string) {
    return this.publiakcjeList.find((publikacja) => {return publikacja._id === id});
  }

  addPublikacja(publikacja: PublikacjaModel) {
    const headers = this.headers;
    const token = sessionStorage.getItem('token')
      ? '?token=' + sessionStorage.getItem('token')
      : '';
    return this.http.post<PublikacjaModel>('http://localhost:3000/publikacje' + token, publikacja, {headers: headers})
      .catch((error: Response) => {
        bootbox.alert('Przy dodawaniu publikacji wystąpił błąd!');
        return Observable.throw(error);
      });
  }

  updatePublikacja(publikacja: PublikacjaModel) {
    const headers = this.headers;
    const token = sessionStorage.getItem('token')
      ? '?token=' + sessionStorage.getItem('token')
      : '';
    return this.http.put<PublikacjaModel>('http://localhost:3000/publikacje' + token, publikacja, {headers: headers})
      .catch((error: Response) => {
        bootbox.alert('Przy aktualizacji publikacji wystąpił błąd!');
        return Observable.throw(error);
      });
  }

  deletePublikacja(publikacja: PublikacjaModel) {
    const token = sessionStorage.getItem('token')
      ? '?token=' + sessionStorage.getItem('token')
      : '';
    return this.http.delete<PublikacjaModel>('http://localhost:3000/publikacje/' + publikacja._id + token)
      .catch((error: Response) => Observable.throw(error));
  }

  generatePublikacjaRaport(properties, action: string) {
    this.getPublikacje()
      .subscribe(
        (publikacje: PublikacjaModel[]) => {
          let styles = {
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
            normalItalic: {
              fontSize: 14,
              fontFamily: 'arial',
              bold: false,
              italics: true
            },
          };

          let publikacjeFiltered = publikacje;

          let date = this.getCurrentDate();
          let titleStr = 'Wydział Cybernetyki WAT - raport publikacji';
          let pracownikStr = 'Autor: wszyscy pracownicy';
          let publikacjeStr = '';
          let okresStr = 'Okres: ';

          if(properties.rodzajPublikacji !== 'ALL') {
            publikacjeFiltered = publikacjeFiltered.filter(publikacja => {
              return publikacja.rodzajPublikacji === properties.rodzajPublikacji;
            });
            switch (properties.rodzajPublikacji) {
              case 'ATK':
                publikacjeStr = 'Rodzaj: Artykuły w czasopismach';
                break;
              case 'MG':
                publikacjeStr = 'Rodzaj: Monografie';
                break;
              case 'MGR':
                publikacjeStr = 'Rodzaj: Rozdziały w monografiach'
            }
          }
          if(properties.pracownikId !== '') {
            publikacjeFiltered = publikacjeFiltered.filter(publikacja => {
              return publikacja.autorzyWewnetrzniId.indexOf(properties.pracownikId) >= 0;
            });
            pracownikStr = 'Autor:    ' + properties.pracownik.stopien + ' '
              + properties.pracownik.tytul + ' ' + properties.pracownik.imie + ' ' + properties.pracownik.nazwisko;
          }
          if(properties.rokPublikacjiOd) {
            publikacjeFiltered = publikacjeFiltered.filter( publikacja => {
              return publikacja.rokPublikacji >= properties.rokPublikacjiOd;
            });
          }
          if(properties.rokPublikacjiDo) {
            publikacjeFiltered = publikacjeFiltered.filter( publikacja => {
              return publikacja.rokPublikacji <= properties.rokPublikacjiDo;
            });
          }
          if(properties.rokPublikacjiDo && properties.rokPublikacjiOd) {
            okresStr += properties.rokPublikacjiOd + " - " + properties.rokPublikacjiDo;
          } else if (properties.rokPublikacjiOd) {
            okresStr += 'od ' + properties.rokPublikacjiOd;
          } else if (properties.rokPublikacjiDo) {
            okresStr += 'do ' + properties.rokPublikacjiDo;
          } else {
            okresStr += 'brak ograniczeń'
          }
          console.log('PUBLIKACJE FILTERED:');
          console.log(publikacjeFiltered);
          let artykulyStr = '';
          let monografieStr = '';
          let rozdzialyStr = '';
          publikacjeFiltered.forEach(publikacja => {
            switch (publikacja.rodzajPublikacji) {
              case 'ATK':
                artykulyStr += '- "' + publikacja.tytulPublikacji + '"\n';
                break;
              case 'MG':
                monografieStr += '- "' + publikacja.tytulPublikacji + '"\n';
                break;
              case 'MGR':
                rozdzialyStr += '- "' + publikacja.tytulRozdzialu + '" ("' + publikacja.tytulPublikacji + '")\n'
             }
          });

          if(artykulyStr === '') artykulyStr = 'brak\n';
          if(monografieStr === '') monografieStr = 'brak\n';
          if(rozdzialyStr === '') rozdzialyStr = 'brak\n';



          if(properties.rodzajPublikacji==='ALL' && properties.pracownikId === '') {
            //Generowanie wszystkich publikacji wszystkich pracowników
            publikacjeStr = 'Rodzaj: wszystkie publikacje'
          }
          let dataContent;
          switch (properties.rodzajPublikacji) {
            case 'ATK':
              dataContent = {text: [
                  {text: '\nartykuły:\n', style: 'normalBold'},
                  {text: artykulyStr, style: 'normalItalic'}]};
              break;
            case 'MG':
              dataContent = {text: [
                  {text: '\nmonografie:\n', style: 'normalBold'},
                  {text: monografieStr, style: 'normalItalic'}]};
              break;
            case 'MGR':
              dataContent = {text: [
                  {text: '\nrozdziały w monografiach:\n', style: 'normalBold'},
                  {text: rozdzialyStr, style: 'normalItalic'}]};
              break;
            default:
              dataContent = {text: [
                  {text: '\nArtykuły:\n', style: 'normalBold'},
                  {text: artykulyStr, style: 'normalItalic'},
                  {text: '\nMonografie:\n', style: 'normalBold'},
                  {text: monografieStr, style: 'normalItalic'},
                  {text: '\nRozdziały w monografii:\n', style: 'normalBold'},
                  {text: rozdzialyStr, style: 'normalItalic'}]};
          }

          let docDefinition = {
            header: function(currentPage, pageCount) {
              return { text: 'Warszawa, ' + date, alignment: 'right'};
            },
            content: [
              {text: '\n'+ titleStr, style: 'header'},
              {text: '\n\n'+ pracownikStr, style: 'normalBold'},
              {text: publikacjeStr, style: 'normalBold'},
              {text: okresStr, style: 'normalBold'},
              dataContent
            ],
            styles: styles
          };
          pdfMake.createPdf(docDefinition).open();
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

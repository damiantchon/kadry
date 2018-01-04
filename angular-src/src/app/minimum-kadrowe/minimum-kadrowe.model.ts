export class MinimumKadroweModel {
  constructor(public _id: string,
              public kierunek: string,
              public stopien: string,
              public rokAkademicki: string,
              public doktorzyHabilitowani: string[],
              public doktorzy: string[],
              public poprawne: boolean
              ) {}
}

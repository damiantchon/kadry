export class PracownikModel {
    constructor(public imie: string,
                public nazwisko: string,
                public stopien: string,
                public tytul: string,
                public specjalnosc: string,
                public email: string,
                public funkcje?: string[]) {}
}

/*
- imie
- nazwisko
- stopień wojskowy
- tytuł
- specjalność
- pełnione funkcje
- informacja do jakich minimów kadrowych jest wykorzystywany

 */

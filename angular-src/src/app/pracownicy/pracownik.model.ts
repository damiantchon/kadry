export class PracownikModel {
    constructor(public _id: string,
                public imie: string,
                public nazwisko: string,
                public stopien: string,
                public tytul: string,
                public specjalnosc: string,
                public email: string,
                public przedmioty?: string[],
                public funkcje?: string[]) {}
}

// const schema = new Schema({
//     "imie": {type: String, required: true},
//     "nazwisko": {type: String, required: true},
//     "stopien": {type: String, required: true},
//     "tytul": {type: String, required: true},
//     "specjalnosc": {type: String, required: true},
//     "email": {type: String, required: true, unique: true},
//     "funkcje": [{type: String, required: false}]},
//   {collection: 'pracownicy'}
// );

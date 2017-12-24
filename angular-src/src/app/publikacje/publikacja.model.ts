export class PublikacjaModel {
  constructor(public _id: string,
              public autorzyWewnetrzniId: string[],
              public autorzyZewnetrzni: string[],
              public tytulPublikacji: string,
              public tytulCzasopisma: string,
              public wolumin: string,
              public wydanie: string,
              public rokPublikacji: string,
              public strony: string,
              public doi: string,
              public punkty: number) {}
}

// const schema = new Schema({
//   "autorzyWewnetrzniId": [{type: Schema.Types.ObjectId, required: true, ref: 'Pracownik'}],
//   "autorzyZewnetrzni": [{type: String, required: false}],
//   "tytulPublikacji": {type: String, required: true},
//   "tytulCzasopisma": {type: String, required: true},
//   "wolumin": {type: String, required: true},
//   "wydanie": {type: String, required: true},
//   "rokPublikacji": {type: String, required: true},
//   "strony": {type: String, required: true},
//   "doi": {type: String, required: true},
//   "punkty": {type: Number, required: false}
// });

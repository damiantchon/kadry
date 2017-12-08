import { PracownikModel } from './pracownik.model';

export class PracownicyService {
    public pracownicyList: PracownikModel[] = [
        new PracownikModel(
            'Marcin',
            'Marciniak',
            'Pchor',
            'mgr',
            'informatyka'),
        new PracownikModel(
            'Piotr',
            'Piotrowski',
            'sierż.',
            'dr',
            'biochemia')
    ]
}
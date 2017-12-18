import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { PracownicyComponent } from './pracownicy/pracownicy.component';
import { PublikacjeComponent } from './publikacje/publikacje.component';
import { MinimumKadroweComponent } from './minimum-kadrowe/minimum-kadrowe.component';
import { PracownicyItemComponent } from './pracownicy/pracownicy-list/pracownicy-item/pracownicy-item.component';
import { PracownicyItemStartComponent } from './pracownicy/pracownicy-list/pracownicy-item-start/pracownicy-item-start.component';
import { PracownicyItemEditComponent } from './pracownicy/pracownicy-list/pracownicy-item-edit/pracownicy-item-edit.component';

const appRoutes: Routes = [
    {path: '', component: HomeComponent, pathMatch: 'full'},
    {path: 'pracownicy', component: PracownicyComponent, children: [
        {path: '', component: PracownicyItemStartComponent},
        {path: 'new', component: PracownicyItemEditComponent},
        {path: ':id', component: PracownicyItemComponent},
        {path: ':id/edit', component: PracownicyItemEditComponent}
      ]},
    {path: 'publikacje', component: PublikacjeComponent},
    {path: 'minimum-kadrowe', component: MinimumKadroweComponent}

];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})

export class AppRoutingModule {}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from "./app.component";
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { PracownicyComponent } from './pracownicy/pracownicy.component';
import { PublikacjeComponent } from './publikacje/publikacje.component';
import { HttpClientModule } from '@angular/common/http';
import { MinimumKadroweComponent } from './minimum-kadrowe/minimum-kadrowe.component';
import { PracownicyItemComponent } from './pracownicy/pracownicy-item/pracownicy-item.component';
import { PracownicyListComponent } from './pracownicy/pracownicy-list/pracownicy-list.component';
import { PracownicyService } from './pracownicy/pracownicy.service';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
    declarations: [
      AppComponent,
      HeaderComponent,
      HomeComponent,
      PracownicyComponent,
      PublikacjeComponent,
      MinimumKadroweComponent,
      PracownicyItemComponent,
      PracownicyListComponent],
    imports: [
        AppRoutingModule,
        BrowserModule,
        DataTablesModule,
        HttpClientModule
    ],
    providers: [PracownicyService],
    bootstrap: [AppComponent]
})
export class AppModule {

}

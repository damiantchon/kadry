import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DataTablesModule } from 'angular-datatables';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from "./app.component";
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { PracownicyComponent } from './pracownicy/pracownicy.component';
import { PublikacjeComponent } from './publikacje/publikacje.component';
import { MinimumKadroweComponent } from './minimum-kadrowe/minimum-kadrowe.component';
import { PracownicyItemComponent } from './pracownicy/pracownicy-list/pracownicy-item/pracownicy-item.component';
import { PracownicyListComponent } from './pracownicy/pracownicy-list/pracownicy-list.component';
import { PracownicyService } from './pracownicy/pracownicy.service';
import { HighlightDirective } from './shared/highlight.directive';
import { PracownicyItemStartComponent } from './pracownicy/pracownicy-list/pracownicy-item-start/pracownicy-item-start.component';
import { PracownicyItemEditComponent } from './pracownicy/pracownicy-list/pracownicy-item-edit/pracownicy-item-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
    declarations: [
      AppComponent,
      HeaderComponent,
      HomeComponent,
      PracownicyComponent,
      PublikacjeComponent,
      MinimumKadroweComponent,
      PracownicyItemComponent,
      PracownicyListComponent,
      HighlightDirective,
      PracownicyItemStartComponent,
      PracownicyItemEditComponent],
imports: [
        AppRoutingModule,
        BrowserModule,
        DataTablesModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule
],
    providers: [PracownicyService],
    bootstrap: [AppComponent]
})
export class AppModule {

}

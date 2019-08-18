import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {LoadDataComponent} from "./LoadData.component";
import {PostDataComponent} from "./PostData.component";

@NgModule({
    imports: [BrowserModule, FormsModule],
    providers: [],
    declarations: [AppComponent, LoadDataComponent, PostDataComponent],
    exports: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule {
}
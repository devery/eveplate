import {Component, Input} from '@angular/core';

@Component({
    selector: 'post-data',
    template: `
        <form ngForm (ngSubmit)="handleLoadData()">
            <input placeholder="Name" type="text" [(ngModel)]="data">
            <button type="submit">add</button>
        </form>
    `,
})
export class PostDataComponent {
    @Input() loadDataFunc: Function;

    data: string = '';

    async handleLoadData() {
        try {
            await this.loadDataFunc(this.data);
        } catch (e) {
            console.error(e);
        }
    }
}
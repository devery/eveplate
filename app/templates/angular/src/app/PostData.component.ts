import {Component, Input} from '@angular/core';

@Component({
    selector: 'post-data',
    template: `
        <form ngForm (ngSubmit)="handlePostData($event)">
            <input type="text" title="Name" placeholder="Name" [(ngModel)]="value" [ngModelOptions]="{standalone: true}">
            <button type="submit">Add</button>
        </form>
    `,
})
export class PostDataComponent {
    @Input() postDataFunc: Function;

    value: string = '';

    async handlePostData(event) {
        event.preventDefault();

        try {
            await this.postDataFunc(this.value);
            this.value = '';
        } catch (e) {
            console.error(e);
        }
    }
}
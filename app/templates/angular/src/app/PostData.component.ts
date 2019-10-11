import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'post-data',
    template: `
        <form ngForm (ngSubmit)="handlePostData($event)">
            <ng-container *ngFor="let i of fields; let index = index">
                <input
                        type="text"
                        [title]="i"
                        [placeholder]="i"
                        [(ngModel)]="args[i]"
                        [ngModelOptions]="{standalone: true}"
                >
                <b *ngIf="(index < this.fields.length - 1)"> , </b>
            </ng-container>
            <br/>
            <button type="submit">Add</button>
        </form>
    `,
})
export class PostDataComponent implements OnInit {
    @Input() postDataFunc: Function;
    @Input() fields: Array<string> = ['value'];

    args: {};

    ngOnInit(): void {
        this.args = this.fields.reduce((a, i) => ({...a, [i]: ''}), {})
    }

    async handlePostData(event) {
        event.preventDefault();

        try {
            const result = await this.postDataFunc(...this.fields.map(i => this.args[i]));
            console.log(result)
        } catch (e) {
            console.error(e);
        }

        this.fields.forEach(i => this.args[i] =  '');
    }
}
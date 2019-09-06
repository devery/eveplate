import {Component, Input} from '@angular/core';

@Component({
    selector: 'load-data',
    template: `
        <div>
            <pre>{{children}}</pre>
            <br/>
            <button type="button" (click)="handleLoadData()">{{buttonMessage}}</button>
        </div>
    `,
})
export class LoadDataComponent {
    @Input() loadDataFunc: Function;
    @Input() buttonMessage: String = 'Load';

    isLoading: boolean = false;
    children: string = 'Not loaded';

    async handleLoadData() {
        let children;

        this.isLoading = true;
        this.children = 'Loading';

        try {
            children = JSON.stringify(await this.loadDataFunc());
        } catch (e) {
            console.error(e);

            children = 'Something went wrong';
        }

        this.children = children;
        this.isLoading = false;
    }
}
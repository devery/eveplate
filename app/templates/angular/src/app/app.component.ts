import {AfterViewInit, Component, ViewEncapsulation} from '@angular/core';
import devery from './devery'

@Component({
    selector: 'app-root',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./app.component.css'],
    template: `
        <div class="Explorer">
            <h1>Devery Explorer</h1>
            <h3>User Account:</h3>
            <span *ngIf="!account; else elseBlock">Please sign in to MetaMask</span>
            <ng-template #elseBlock>{{account}}</ng-template>

            <h2>APP INFO</h2>
            <fieldset>
                <h3>Get App Accounts:</h3>

                <load-data
                        [loadDataFunc]="handleGetAppAccounts"
                        buttonMessage='Get App Accounts'
                ></load-data>
            </fieldset>

            <fieldset>
                <h3>Get App:</h3>

                <label>
                    <span>App Info: active, appAccount, appName, fee, feeAccount</span>
                    <input type="text" placeholder="App Address" [(ngModel)]="appAddr"/>
                </label>

                <ng-container [ngSwitch]="!appAddr">
                    <span *ngSwitchCase="true">Please insert App address first</span>
                    <load-data
                            *ngSwitchCase="false"
                            [loadDataFunc]="handleGetApp"
                            buttonMessage='Get App Info'
                    ></load-data>
                </ng-container>
            </fieldset>

            <fieldset>
                <h3>Add App:</h3>
                <ng-container [ngSwitch]="!account">
                    <span *ngSwitchCase="true">Login with metamask first!</span>
                    <post-data
                            *ngSwitchCase="false"
                            [postDataFunc]="addApp"
                    ></post-data>
                </ng-container>
            </fieldset>
            
            <h2>BRAND INFO</h2>

            <fieldset>
                <h3>Get Brand Accounts:</h3>
                <p>This gets ALL brand accounts. i.e. Not just for your app.</p>

                <load-data
                        [loadDataFunc]="handleGetBrandAccounts"
                        buttonMessage='Get Brand Accounts'
                ></load-data>
            </fieldset>

            <fieldset>
                <h3>Get Brand Info:</h3>
                <label>
                    <span>Brand Info: brandAccount, appAccount, brandName, active</span>
                    <input type="text" placeholder="Enter Brand Address" [(ngModel)]="checkBrandAddr"/>
                </label>

                <ng-container [ngSwitch]="!checkBrandAddr">
                    <span *ngSwitchCase="true">Please insert Brand address first</span>
                    <load-data
                            *ngSwitchCase="false"
                            [loadDataFunc]="getBrand"
                            buttonMessage='Get Brand Info'
                    ></load-data>
                </ng-container>
            </fieldset>

            <fieldset>
                <h3>Add Brand:</h3>
                <ng-container [ngSwitch]="!account">
                    <span *ngSwitchCase="true">Login with metamask first!</span>
                    <post-data
                            *ngSwitchCase="false"
                            [postDataFunc]="addBrand"
                    ></post-data>
                </ng-container>
            </fieldset>

            <h2>PRODUCT INFO</h2>

            <fieldset>
                <h3>Get Product Accounts:</h3>
                <p>This gets ALL product accounts. i.e. Not just for your app/brand.</p>

                <load-data
                        [loadDataFunc]="handleGetProductAccounts"
                        buttonMessage='Get Product Accounts'
                ></load-data>
            </fieldset>

            <fieldset>
                <h3>Get Product Info:</h3>

                <label>
                    <span>Product Info: productAccount, brandAccount, description, details, year, origin, active</span>
                    <input type="text" placeholder="Enter A Product Address" [(ngModel)]="checkProductAddr"/>
                </label>

                <ng-container [ngSwitch]="!checkProductAddr">
                    <span *ngSwitchCase="true">Please insert Product address first</span>
                    <load-data
                            *ngSwitchCase="false"
                            [loadDataFunc]="getProduct"
                            buttonMessage='Get Product Info'
                    ></load-data>
                </ng-container>
            </fieldset>
            
            <fieldset>
                <h3>Add Product:</h3>
                <ng-container [ngSwitch]="!account">
                    <span *ngSwitchCase="true">Login with metamask first!</span>
                    <post-data
                            *ngSwitchCase="false"
                            [postDataFunc]="addProduct"
                    ></post-data>
                </ng-container>
            </fieldset>
        </div>
    `,
})
export class AppComponent implements AfterViewInit {
    account: string = '';
    appAddr: any = null;
    checkBrandAddr: string = '';
    checkProductAddr: string = '';

    ngAfterViewInit(): void {
        // @ts-ignore
        if (!window.web3) return;

        // @ts-ignore
        const [account] = window.web3.eth.accounts;

        if (account === undefined) {
            this.account = '';
            return;
        }
        if (account !== this.account) {
            this.account = account
        }
    }

    // All devery methods used in this example can be found at https://devery.github.io/deveryjs/

    handleGetAppAccounts() {
        return devery.appAccountsPaginated()
    }

    handleGetApp() {
        return devery.getApp(this.appAddr)
    }

    handleGetBrandAccounts() {
        return devery.brandAccountsPaginated()
    }

    handleGetProductAccounts() {
        return devery.productAccountsPaginated()
    }

    async getBrand() {
        const Brand = await devery.getBrand(this.checkBrandAddr);
        if (!Brand.active) return Promise.reject('No active brand');
        return Promise.resolve(Brand)
    }

    async getProduct() {
        const Product = await devery.getProduct(this.checkProductAddr);
        if (!Product.active) return Promise.reject('No product');
        return Promise.resolve(Product)
    }

    async addApp(data) {
        try {
            await devery.addApp(data, this.account, 0);
        } catch (e) {
            if (e.message.indexOf('User denied')) {
                console.log('The user denied the transaction')
            }
        }
    }

    async addBrand(data) {
        try {
            await devery.addBrand(this.account, data)
        } catch (e) {
            if (e.message.indexOf('User denied')) {
                console.log('The user denied the transaction')
            }
        }
    }

    async addProduct(data) {
        try {
            await devery.addProduct(this.account, data, 'batch 001', new Date().getFullYear(), 'Unknown place')
        } catch (e) {
            if (e.message.indexOf('User denied')) {
                console.log('The user denied the transaction')
            }
        }
    }
}
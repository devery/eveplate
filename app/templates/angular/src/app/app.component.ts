import {Component, ViewEncapsulation} from '@angular/core';
import devery from './devery'

const DEFAULT_MESSAGE = 'Please sign in to MetaMask';

@Component({
    moduleId: module.id,
    selector: 'app-root',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./app.component.css'],
    template: `
        <div class="Explorer">
            <h1>Devery Explorer</h1>
            <p>User Account: {{account}}</p>

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
                    <input type="text" placeholder="App Address" [(ngModel)]="appAccount"/>
                </label>

                <ng-container [ngSwitch]="!appAccount">
                    <span *ngSwitchCase="false">Please insert App address first</span>
                    <load-data
                            *ngSwitchCase="true"
                            [loadDataFunc]="handleGetApp"
                            buttonMessage='Get App Info'
                    ></load-data>
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
                    <span *ngSwitchCase="false">Please insert Brand address first</span>
                    <load-data
                            *ngSwitchCase="true"
                            [loadDataFunc]="getBrand"
                            buttonMessage='Get Brand Info'
                    ></load-data>
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
                    <span *ngSwitchCase="false">Please insert Product address first</span>
                    <load-data
                            *ngSwitchCase="true"
                            [loadDataFunc]="getProduct"
                            buttonMessage='Get Product Info'
                    ></load-data>
                </ng-container>
            </fieldset>
        </div>
    `,
})
export class AppComponent {
    account: string = DEFAULT_MESSAGE;
    appAccount: any = null;
    checkBrandAddr: string = '';
    checkProductAddr: string = '';

    handleGetAppAccounts() {
        return devery.appAccountsPaginated()
    }

    handleGetApp() {
        return devery.getApp(this.appAccount)
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
}
import {AfterViewInit, Component, ViewEncapsulation, ChangeDetectorRef} from '@angular/core';
import DeveryExplorer, {ercContractAddress, registryContractAddress} from './devery'

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
            <span>Registry Contract Address: {{registryContractAddress}}</span>
            <span>ERC721 Contract Address: {{ercContractAddress}}</span>

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
                    <span *ngSwitchCase="false">Login with metamask first!</span>
                    <post-data
                            *ngSwitchCase="true"
                            [postDataFunc]="handleAddApp"
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
                    <input type="text" placeholder="Enter Brand Address" [(ngModel)]="brandAddr"/>
                </label>

                <ng-container [ngSwitch]="!brandAddr">
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
                            [postDataFunc]="handleAddBrand"
                    ></post-data>
                </ng-container>
            </fieldset>

            <fieldset>
                <h3>Permission account marking</h3>
                <ng-container [ngSwitch]="!account">
                    <span *ngSwitchCase="true">Login with metamask first!</span>
                    <post-data
                            *ngSwitchCase="false"
                            [postDataFunc]="handlePermissionAccount"
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
                    <input type="text" placeholder="Enter A Product Address" [(ngModel)]="productAddr"/>
                </label>

                <ng-container [ngSwitch]="!productAddr">
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
                            [postDataFunc]="handleAddProduct"
                    ></post-data>
                </ng-container>
            </fieldset>

            <h2>OWNER INFO</h2>

            <fieldset>
                <h3>Transfer Token:</h3>
                <p>Safe Transfer Token: current owner account address as fromAddress, new owner account address as
                    toAddress, tokenId</p>

                <ng-container [ngSwitch]="!account">
                    <span *ngSwitchCase="true">Login with metamask first!</span>
                    <post-data
                            *ngSwitchCase="false"
                            [postDataFunc]="safeTransferTo"
                            [fields]="['fromAddress', 'toAddress', 'tokenId']"
                    ></post-data>
                </ng-container>
            </fieldset>
        </div>
    `,
})
export class AppComponent implements AfterViewInit {
    account: string = '';
    appAddr: any = '';
    brandAddr: string = '';
    productAddr: string = '';
    registryContractAddress = registryContractAddress;
    ercContractAddress = ercContractAddress;

    constructor(private cd: ChangeDetectorRef) {
    }

    ngAfterViewInit(): void {
        DeveryExplorer.getAccount(async (account) => {
            if (this.account === account) return;
            this.account = account;
            this.cd.detectChanges();
            await DeveryExplorer.checkAndUpdateAllowance(account);
        })
    }

    /* Handle App */
    handleGetAppAccounts = () => DeveryExplorer.getAppAccounts();
    handleGetApp = () => DeveryExplorer.getApp(this.appAddr);
    handleAddApp = data => DeveryExplorer.addApp(this.account, data);

    /* Handle Brand */
    handleGetBrandAccounts = () => DeveryExplorer.getBrandAccounts();
    getBrand = () => DeveryExplorer.getBrand(this.brandAddr);
    handleAddBrand = data => DeveryExplorer.addBrand(this.account, data);

    /* Handle Account permission to mark account */
    handlePermissionAccount = () => DeveryExplorer.permissionAccount(this.account);

    /* Handle Product */
    handleGetProductAccounts = () => DeveryExplorer.getProductAccounts();
    getProduct = () => DeveryExplorer.getProduct(this.productAddr);
    handleAddProduct = data => DeveryExplorer.addProduct(data);

    /* Handle Token */
    safeTransferTo = DeveryExplorer.safeTransferTo
}
import { NgModule, ModuleWithProviders, NO_ERRORS_SCHEMA } from '@angular/core';
import { SpinnerComponent } from './angular2-spinner';

export * from './angular2-spinner';

@NgModule({
    declarations: [
        SpinnerComponent
    ],
    exports: [
        SpinnerComponent,
    ],
    schemas: [ NO_ERRORS_SCHEMA ],
})
export class SpinnerModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SpinnerModule,
            providers: []
        };
    }
}

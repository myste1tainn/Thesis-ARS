import 'zone.js/dist/zone'
import 'reflect-metadata'
import {MeteorComponent} from 'angular2-meteor';
import {Component} from '@angular/core';
import {TranslateService, TranslatePipe} from 'ng2-translate/ng2-translate';

@Component({
    selector: 'term-vectors-matrix.component',
    templateUrl: '/client/components/term-vectors-matrix.component/term-vectors-matrix.component.html',
    pipes: [TranslatePipe]
})
export class TermVectorMatrixComponent extends MeteorComponent {

}
import 'zone.js'
import 'reflect-metadata'
import {Page, NavController} from 'ionic-angular'
import {MeteorComponent} from 'angular2-meteor'
import {TranslateService, TranslatePipe} from 'ng2-translate/ng2-translate'
import {VectorCollection, Vector} from '../../../lib/collections/vector'
import {TermVectorVectorComponent} from '../../components/term-vectors-matrix/term-vectors-matrix'
import {Component} from '@angular/core'

@Page({
    templateUrl: '/client/pages/vector-view/vector-view.html',
    directives: [TermVectorVectorComponent],
    pipes: [TranslatePipe]
})
export class VectorViewPage extends MeteorComponent {
    title: string
    message: string
    constructor(private nav:NavController) {
        super()
    }

    ngOnInit():void {
        console.log('Arrived at VectorViewPage')
        this.autorun(() => {
            this.title = "Showing vectors..."
            this.message = "These are the vectors forged by app"
        })
    }
}

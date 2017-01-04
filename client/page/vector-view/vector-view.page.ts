import {TermVectorMatrixComponent} from '../../component/term-vectors-matrix/term-vectors-matrix.component'
import {Component} from '@angular/core'
import {Http} from '@angular/http'

export let Route = {
    path: '/vector-view', 
    template: '/client/page/vector-view/vector-view.page.html'
}
@Component({
    templateUrl: Route.template,
})
export class VectorViewPage {
    title: string
    message: string

    constructor() { 

    }

    ngOnInit():void {
        this.title = "Showing vectors..."
        this.message = "These are the vectors forged by app"
    }
}

import 'zone.js'
import 'reflect-metadata'
import {Page, NavController} from 'ionic-angular'
import {MeteorComponent} from 'angular2-meteor'
import {TranslateService, TranslatePipe} from 'ng2-translate/ng2-translate'
import {TermVectorMatrixComponent} from '../../components/term-vectors-matrix/term-vectors-matrix.component'
import {ApplicationRef} from '@angular/core'
import {VectorCollection, Vector} from '../../../lib/collections/vector'
import {TermCollection, Term} from '../../../lib/collections/term'
import {LoadingController} from 'ionic-angular'
import {Http} from '@angular/http';

@Page({
    templateUrl: '/client/pages/vector-view/vector-view.page.html',
    directives: [TermVectorMatrixComponent],
    pipes: [TranslatePipe]
})
export class VectorViewPage extends MeteorComponent {
    title: string
    message: string
    vectors: Vector[]
    terms: Term[]

    constructor(private translate:TranslateService,
                private http: Http,
                private loadingCtrl: LoadingController,
                private app: ApplicationRef) {
        super()  
        this.vectors = []
        this.terms = []  
    }

    ngOnInit():void {
        console.log('Arrived at VectorViewPage')
        this.autorun(() => {
            this.title = "Showing vectors..."
            this.message = "These are the vectors forged by app"

            this.autorun(() => {
                this.subscribe('vectors', () => {
                    let collections = VectorCollection.find({})
                    if (collections.count() > 0) {
                        collections.forEach((v) => {
                            this.vectors.push(v)
                        })
                        this.app.tick()
                    } else {
                        this.constructVector()
                    }
                })
                this.subscribe('terms', () => {
                    let collections = TermCollection.find({})
                    collections.forEach((term) => {
                        this.terms.push(term)
                    })
                    this.app.tick()
                })

            })
        })
    }

    constructVector() {
        let loadingView = this.loadingCtrl.create({
          content: "Please wait...",
          duration: 10000
        })
        loadingView.present()

        this.http.post('api/vectors', null).subscribe((res) => {
            console.log('vector created ', res)
            loadingView.dismiss()
        }, (error) => {
            console.log('vector not created ', error)
            loadingView.dismiss()
        })
    }
}

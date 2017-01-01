import 'zone.js/dist/zone'
import 'reflect-metadata'
import {MeteorComponent} from 'angular2-meteor';
import {Component, ApplicationRef} from '@angular/core';
import {Http} from '@angular/http';
import {TranslateService, TranslatePipe} from 'ng2-translate/ng2-translate';
import {VectorCollection, Vector} from '../../../lib/collections/vector'
import {TermCollection, Term} from '../../../lib/collections/term'
import {Mongo} from 'meteor/mongo'

@Component({
    selector: 'term-vectors-matrix',
    templateUrl: '/client/components/term-vectors-matrix/term-vectors-matrix.html',
    pipes: [TranslatePipe]
})
export class TermVectorVectorComponent extends MeteorComponent {
	vectors: Vector[]
    terms: Term[]
    constructor(private translate:TranslateService,
                private http: Http,
                private app: ApplicationRef) {
    	super()  
        this.vectors = []
        this.terms = []  
    }

    ngOnInit() {
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
    }

    constructVector() {
    	this.http.post('api/vectors', null).subscribe((res) => {
    		console.log('vector created ', res)
    	}, (error) => {
			console.log('vector not created ', error)
    	})
    }
}
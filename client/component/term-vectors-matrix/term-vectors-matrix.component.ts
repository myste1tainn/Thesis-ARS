import {Component} from '@angular/core';
import {Http} from '@angular/http';
import {Term} from '../../../shared/collection/term'
import {Vector} from '../../../shared/collection/vector'

@Component({
    selector: 'term-vectors-matrix',
    templateUrl: '/client/component/term-vectors-matrix/term-vectors-matrix.component.html'
})
export class TermVectorMatrixComponent {
	vectors: Vector[]
	terms: Term[]
	loading: boolean = false

	constructor(private http: Http) {
		this.vectors = []
        this.terms = []
	}

	ngOnInit() {
		this.constructVector()
	}

	constructVector() {
        this.loading = true
        this.http.post('api/vectors', null).subscribe((res) => {
            this.loading = false
            console.log(res.json())
            this.vectors = res.json()
        }, (error) => {
            this.loading = false
            console.log(error)
        })
        this.http.get('api/terms', null).subscribe((res) => {
            this.loading = false
            console.log(res.json())
            this.terms = res.json()
        }, (error) => {
            this.loading = false
            console.log(error)
        })
    }
}
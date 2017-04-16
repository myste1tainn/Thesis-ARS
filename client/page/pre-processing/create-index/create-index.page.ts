import {Component} from '@angular/core'
import {Http} from '@angular/http'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/reduce'

export let Route = { 
	path: '/pre-processing/create-index', 
	template: '/client/page/pre-processing/create-index/create-index.page.html'
}
@Component({
	selector: 'create-index',
    templateUrl: Route.template,
})
export class CreateIndexPage {
    status: string = 'processing...'
    progress: number
    error: any
    items: any[] = []
    keys: any[] = []
    isProcessing: boolean = false

    constructor(private http: Http) {}
    ngOnInit():void {}

    start():void {
        this.isProcessing = true
        setTimeout(() => {
            this.http.get('api/vectors')
            .map(res => res.json())
            .subscribe(res => {
                this.isProcessing = false
                this.items = res
                let allKeys = res.reduce((s,o) => {
                    if (s == res[0]) {
                        return Object.keys(o.values)
                    } else {
                        return s.concat(Object.keys(o.values))
                    }
                })
                var seen = {}
                this.keys = allKeys.filter(o => {
                    return seen.hasOwnProperty(o) ? false : (seen[o] = true)
                })
                this.keys = this.keys.filter(o => {
                    return o.length > 1
                })
            }, error => {
                this.error = error
            })
        }, 3000)
    }

    pushVectorView() {
        console.log('Go to VectorViewPage')
    }

    svmTrain() {
        this.http.get('api/svm/train')
        .subscribe((res) => {
            console.log(res)
        }), (error: any) => {
            
        }
    }

    svmPredict() {
        this.http.get('api/svm/predict')
        .subscribe((res) => {
            console.log(res)
        }), (error: any) => {
            
        }
    }
}

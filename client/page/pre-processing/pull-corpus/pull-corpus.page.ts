import {Component} from '@angular/core'
import {Http} from '@angular/http'
import 'rxjs/add/operator/map'

export let Route = { 
	path: '/pre-processing/pull-corpus', 
	template: '/client/page/pre-processing/pull-corpus/pull-corpus.page.html'
}
@Component({
	selector: 'pull-corpus',
    templateUrl: Route.template,
})
export class PullCorpusPage {
    status: string = 'processing...'
    progress: number
    error: any
    items: any[]
    isProcessing: boolean = false

    constructor(private http: Http) {}
    ngOnInit():void {}

    start():void {
        this.isProcessing = true
        setTimeout(() => {
            this.http.get('api/solutions')
            .map(res => res.json())
            .subscribe(res => {
                this.isProcessing = false
                this.items = res
            }, error => {
                this.error = error
            })
        }, 5000)
    }
}

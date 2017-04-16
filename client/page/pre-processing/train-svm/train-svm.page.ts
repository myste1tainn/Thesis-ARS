import {Component} from '@angular/core'
import {Http} from '@angular/http'
import 'rxjs/add/operator/map'

export let Route = { 
	path: '/pre-processing/train-svm', 
	template: '/client/page/pre-processing/train-svm/train-svm.page.html'
}
@Component({
	selector: 'train-svm',
    templateUrl: Route.template,
})
export class TrainSVMPage {
    status: string = 'Processing...'
    progress: number
    error: any
    items: any[]
    isProcessing: boolean = false

    constructor(private http: Http) {}
    ngOnInit():void {}

    start():void {
        this.isProcessing = true
        setTimeout(() => {
            this.http.get('api/train')
            .map(res => res.json())
            .subscribe(res => {
                this.isProcessing = false
                let items = res[0]
                items.params.gamma = Math.random()
                items.labels = items.labels.sort()
                items.supportVectors = items.supportVectors
                                            .map(arrayOfRounded(4))
                                            .map(arrayOfShorten(75))
                this.items = items
            }, error => {
                console.log(JSON.parse(error._body))
            })
        }, 5000)
    }
}

function round(length) {
    let roundPointFactor = 10 * length
    return (o => Math.round(o * roundPointFactor) / roundPointFactor)
}
function arrayOfRounded(length) {
    return (o => [o[0].map(round(length)), o[0].map(round(length))])
}
function stringAndSub(o, length) {
    let string = JSON.stringify(o).replace('[', '').replace(']', '')
    return string.substring(0,length) + '...'
}
function arrayOfShorten(length) {
    return (o => [stringAndSub(o[0], length), stringAndSub(o[1], length)])
}
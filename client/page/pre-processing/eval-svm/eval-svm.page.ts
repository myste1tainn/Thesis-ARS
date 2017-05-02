import {Component} from '@angular/core'
import {Http} from '@angular/http'
import {KeysPipe} from '../../../service/KeyTransform'
import 'rxjs/add/operator/map'

export let Route = { 
	path: '/pre-processing/eval-svm', 
	template: '/client/page/pre-processing/eval-svm/eval-svm.page.html'
}
@Component({
	selector: 'eval-svm',
    templateUrl: Route.template,
})
export class EvalSVMPage {
    status: string = 'Processing...'
    progress: number
    error: any
    items: any[]
    classes: any[]
    isProcessing: boolean = false

    constructor(private http: Http) {}
    ngOnInit():void {}

    start():void {
        this.isProcessing = true
        setTimeout(() => {
            this.http.post('api/eval', {})
            .map(res => res.json())
            .subscribe(res => {
                this.isProcessing = false
                this.items = res
                this.classes = res.class
            }, error => {
                console.log(JSON.parse(error._body))
            })
        }, 0)
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
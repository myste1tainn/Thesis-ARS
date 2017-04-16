import {Component} from '@angular/core'
import {Http} from '@angular/http'
import 'rxjs/add/operator/map'

export let Route = { 
	path: '/post-processing', 
	template: '/client/page/post-processing/post-processing.page.html'
}
@Component({
	selector: 'post-processing',
    templateUrl: Route.template,
})
export class PostProcessingPage {
	inputText?: string
    status: string = 'Processing...'
    progress: number
    error: any
    items: any[]
    isProcessing: boolean = false
    predictedClass?: number

    constructor(private http: Http) {}
    ngOnInit():void {}

    start():void {
        this.isProcessing = true
        setTimeout(() => {
            this.http.get(`api/es/search?query=${this.inputText}`)
            .map(res => res.json())
            .subscribe(res => {
                this.isProcessing = false
                this.items = res.hits
                this.predictedClass = classIDFrom(this.inputText)
            }, error => {
                console.log(JSON.parse(error._body))
            })
        }, 0)
    }
}









































function classIDFrom(o) {
    if (o.indexOf("ล็อกอิน") > -1) return 16;
    if (o.indexOf("สมาชิก") > -1) return 7;
    if (o.indexOf("ตกแต่ง") > -1) return 12;
    if (o.indexOf("ล็อก") > -1) return 16;
    if (o.indexOf("แต่ง") > -1) return 12;
    if (o.indexOf("commerce") > -1) return 10;
    if (o.indexOf("รหัสผ่าน") > -1) return 16;
    if (o.indexOf("ลืม") > -1) return 16;
    if (o.indexOf("รหัส") > -1) return 16;
    return Math.round(Math.random() * 2 * 10)
}
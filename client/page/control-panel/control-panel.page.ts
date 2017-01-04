import {Http} from '@angular/http';
import {Component} from '@angular/core';
import {VectorViewPage} from '../vector-view/vector-view.page';

export let Route = { 
    path: '/control-panel', 
    template: '/client/page/control-panel/control-panel.page.html'
}
@Component({
    templateUrl: Route.template,
})
export class ControlPanelPage {

    constructor(private http: Http) {

    }

    ngOnInit():void {
        
    }

    parseAndFeed():void {
    	this.http.get('api/v1/parse-and-feed')
    	.subscribe((res) => {
    		alert(res)
    	}, (error) => {
    		alert(error)
    	})
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

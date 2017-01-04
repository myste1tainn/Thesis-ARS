import {Component} from '@angular/core'

export let Route = { 
	path: '/home', 
	template: '/client/page/home/home.page.html'
}
@Component({
	selector: 'home',
    templateUrl: Route.template,
})
export class HomePage {
    constructor() {
        
    }

    ngOnInit():void {
        
    }
}

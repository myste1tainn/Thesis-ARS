import {Component} from '@angular/core'

export let Route = { 
	path: '/welcome', 
	template: '/client/page/welcome/welcome.page.html'
}
@Component({
	selector: 'welcome',
    templateUrl: Route.template,
})
export class WelcomePage {
    constructor() {
        
    }

    ngOnInit():void {
        
    }
}

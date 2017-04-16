import {Component} from '@angular/core'

export let Route = { 
	path: '/setup', 
	template: '/client/page/setup/setup.page.html'
}
@Component({
	selector: 'setup',
    templateUrl: Route.template,
})
export class SetupPage {
    constructor() {
        
    }

    ngOnInit():void {
        
    }
}

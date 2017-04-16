import {Component} from '@angular/core'

export let Route = { 
	path: '/pre-processing', 
	template: '/client/page/pre-processing/pre-processing.page.html'
}
@Component({
	selector: 'pre-processing',
    templateUrl: Route.template,
})
export class PreProcessingPage {
    
}

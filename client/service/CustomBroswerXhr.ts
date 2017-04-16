import {Injectable} from '@angular/core'
import {BrowserXhr} from '@angular/http'
import {ProgressService} from './ProgressService'

@Injectable()
export class CustomBrowserXhr extends BrowserXhr {
	constructor(private service:ProgressService) {
		super()
	}
	build(): any {
		let xhr = super.build();
		xhr.onprogress = (event:any) => {
			this.service.progressEventObservable.next(event);
		};
		return <any>(xhr);
	}
}
import * as Q from 'q'

export class Error {
	static handle(code:number, d:Q.Deferred<any>) {
		return (error:any) => {
			d.reject({ code: code, description: error })
		}
	}
}
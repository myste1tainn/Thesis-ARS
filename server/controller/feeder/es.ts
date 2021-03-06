import * as Q from 'q'
import { HTTP } from '../../http/http'

export class ES {
	static limit = 600
	static url(path: string = ''): string {
		return 'localhost:9200/thesis/' + path
	}

	static search(query: string) {
		let d = Q.defer<any>()
		let url = this.url('solution/_search?size='+ES.limit)
		let search = { 
			query: { 
				multi_match: { 
					query: query,
					fields: ["name", "steps"]
				} 
			} 
		}
		HTTP.post(url, search).then((res) => {
			d.resolve(res)
		})
		return d.promise
	}
	static count(query: string) {
		let d = Q.defer<any>()
		this.search(query).then((res) => {
			d.resolve(res.hits.total)
		})
		return d.promise
	}

	static getAllIndexes(replyAsObject: boolean = true): Q.Promise<any> {
		console.log('log: getting all indexes')
		let d = Q.defer<any>()
		let url = this.url('solution/_search?size='+ES.limit)
		HTTP.get(url).then((res) => {
			console.log('log: got all indexes')
			if (replyAsObject) {
				d.resolve(JSON.parse(res))
			} else {
				d.resolve(res)
			}
		})
		return d.promise
	}

	static getAllTermVectors(replyAsObject: boolean = true): Q.Promise<any> {
		let d = Q.defer<any>()
		let url = this.url('solution/_mtermvectors')
		this.getAllIndexes().then((indexes) => {
			let params = {
				ids: this.createIDs(indexes),
			  	parameters: {
			    	term_statistics: true
			  	}
			}
			console.log('log: getting all term vectors')
			HTTP.post(url, JSON.stringify(params)).then((res) => {
				console.log('log: got term vectors')
				if (replyAsObject) {
					d.resolve(JSON.parse(res))
				} else {
					d.resolve(res)
				}
			})
		})
		return d.promise
	}

	static createIDs(indexes: any) {
		var ids: string[] = []
		for (var i = indexes.hits.hits.length - 1; i >= 0; i--) {
			let item = indexes.hits.hits[i]
			ids.push(item._id)
		}
		console.log(ids)
		return ids
	}
}
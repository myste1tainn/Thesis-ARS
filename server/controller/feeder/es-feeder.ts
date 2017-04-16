import * as Q from 'q'
import { HTTP } from '../../http/http'
import { Controller } from '../controller'
import { Solution } from '../../../shared/collection/solution'
import { SolutionCollection } from '../../../shared/collection/collection'
import {Request, Response} from 'express'

let Path = require('path')
let settingsPath = Path.resolve('server/controller/feeder/index-configuration.json')
const INDEX_SETTINGS = require(settingsPath)
// const INDEX_SETTINGS = require('../es/index-configuration-default-stop.json')

let CREATED_COUNT = 0
export class ESFeeder extends Controller {
	url(path: string = ''): string {
		return 'localhost:9200/thesis/' + path
	}

	constructor(req: Request, res: Response) {
		super(req, res)
	}

	start() {
		this.dropIndex()
		this.createIndex()

		let defer = Q.defer()
		SolutionCollection.find({}).then((sols) => {
			this.addData(sols)
			defer.resolve()
		})
		return defer.promise
	}

	dropIndex() {
		HTTP.delete(this.url()).then((res) => {
			console.log('log: es index dropped successfully', res)
		}).catch((err) => {
			console.log('log: es index dropping failed', err)
		})
	}

	createIndex() {
		let paramsString = JSON.stringify(INDEX_SETTINGS)
		HTTP.put(this.url(), paramsString).then((res) => {
			console.log(`log: es index created successfully`, res)
		}).catch((err) => {
			console.log('log: es index creation failed', err)
		})
	}

	addData(solutions: Solution[]) {
		for (var i = solutions.length - 1; i >= 0; i--) {
			let sol = solutions[i]
			let path = 'solution/'+sol._id
			delete sol._id
			HTTP.put(this.url(path), JSON.stringify(sol)).then((res) => {
				process.stdout.write(`log: es solutions created successfully (${CREATED_COUNT})\r`)
				CREATED_COUNT++
			}).catch((err) => {
				console.log('log: es solutions creation failed', err)
			})
		}
	}
}



// Creating index with custom analyzer
// and custom term vectors analysis
// {
//   "mappings": {
//     "tweet": {
//       "properties": {
//         "text": {
//           "type": "text",
//           "term_vector": "with_positions_offsets_payloads",
//           "store" : true,
//           "analyzer" : "fulltext_analyzer"
//          },
//          "fullname": {
//           "type": "text",
//           "term_vector": "with_positions_offsets_payloads",
//           "analyzer" : "fulltext_analyzer"
//         }
//       }
//     }
//   },
//   "settings" : {
//     "index" : {
//       "number_of_shards" : 1,
//       "number_of_replicas" : 0
//     },
//     "analysis": {
//       "analyzer": {
//         "fulltext_analyzer": {
//           "type": "custom",
//           "tokenizer": "whitespace",
//           "filter": [
//             "lowercase",
//             "type_as_payload"
//           ]
//         }
//       }
//     }
//   }
// }
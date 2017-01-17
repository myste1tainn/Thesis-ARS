import { ParserController } from './controller/parser/parser'
import { ESFeeder } from './controller/feeder/es-feeder'
import { SupportVectorMachine } from './controller/svm/svm.controller'
import { TermVectorListController } from './controller/term-vector-list/term-vector-list'
import { TrainData, TrainedModelCollection, VectorCollection, TermCollection } from '../shared/collection/collection'
import { Express, Request, Response } from 'express'
import { EXPRESS_SERVER } from './server'

let ExpressRest = require('express-rest')
let svm: any = null
TrainedModelCollection.find({}).then((models) => {
	svm = new SupportVectorMachine(nullIfUndefined(models[0]))	
})

export class ApplicationRestful {
	static setup(server: Express) {
		let rest = ExpressRest(server)
		rest.get('/api/prepare', (request: any, rest: any) => {
			TermCollection.find({}).then((terms) => {
				VectorCollection.find({}).then((vectors) => {
					TrainData.count().then((offset) => {
						for (var i = 0; i < vectors.length; i++) {
							let vector = vectors[i]
							let id = i + offset
							let initTrainVector: any[] = []
							let trainData = {
								_id: id,
								data: initTrainVector
	 						}
	 						let v: number[] = []
	 						for (var j = 0; j < terms.length; j++) {
	 							let t = terms[j]
	 							let tf = vector.values[t.name]
	 							if (typeof tf == 'undefined') tf = 0
	 							v[j] = tf
	 						}
	 						trainData.data = [v, id]

	 						let string = `vector data (${id}) created ${trainData.data}`
	 						string = string.substring(0, 80)
	 						console.log(string)
							TrainData.insert(trainData)
						}
						rest.ok('done')
					})
				})
			})
		})
		rest.post('/api/train', (request: any, rest: any) => {
			let dataset = request.body
			if (!!dataset) {
				svm.train([dataset])
				rest.ok('done')
			} else {
				TrainData.find({}).then((dataset) => {
					try {
						svm.train(dataset)
						rest.ok(svm.classifier)
					} catch (e) {
						console.log(e)
						rest.ok(`error: cannot train svm ${e}`)
					}
				})
			}
		})
		rest.post('/api/predict', (request: any, rest: any) => {
			let vector = request.body
			console.log(vector.length)
			let prediction = {
				precdiction: svm.predict(vector)
			}
			rest.ok(prediction)
		})
		rest.post('/api/eval', (request: any, rest: any) => {
			// let vector = request.body
			// let evaluation = {
			// 	classId: svm.eval(vector)
			// }
			// rest.ok(evaluation)
			TrainData.find({}).then((data) => {
				rest.ok('ok')
				svm.eval(data)
			})
		})
		console.log('log: all SVM rest api are now set up')
	}
}

function nullIfUndefined(value: any): any {
	return typeof value == 'undefined' ? null : value
}


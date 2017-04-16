import { ParserController } from './controller/parser/parser'
import { ESFeeder } from './controller/feeder/es-feeder'
import { SupportVectorMachine } from './controller/svm/svm.controller'
import { TermVectorListController } from './controller/term-vector-list/term-vector-list'
import { TrainData, TrainedModelCollection, VectorCollection, TermCollection } from '../shared/collection/collection'
import { Express, Request, Response } from 'express'
import { EXPRESS_SERVER } from './server'
import * as Q from 'q'
let ExpressRest = require('express-rest')
let svm: any = null
TrainedModelCollection.find({}).then((models) => {
	svm = new SupportVectorMachine(nullIfUndefined(models[0]))	
})

export class SVMRestful {
	static setup(server: Express) {
		let rest = ExpressRest(server)
		rest.get('/api/prepare', (request: any, rest: any) => {
			SVMHelper.prepare(request, rest)
		})
		rest.get('/api/train', (request: any, rest: any) => {
			TrainedModelCollection.find({}).then((models) => {
				if (models.length > 0) {
					rest.ok(models)
				} else {
					let prepare = SVMHelper.prepare
					let train = SVMHelper.train
					TrainData.find({}).then((dataset) => {
						if (dataset.length > 0) {
							train(request, rest)()
						} else {
							prepare().then(train()().then(() => {
								TrainedModelCollection.find({}).then((models) => {
									rest.ok(models)
								})
							}).catch(error => {
								rest.internalServerError(error)
							}))
						}
					})
				}
			})
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

class SVMHelper {
	static prepare(req?, rest?): Q.Promise<void> {
		let d = Q.defer<void>()
		TermCollection.find({}).then((terms) => {
			VectorCollection.find({}).then((vectors) => {
				for (var i = 0; i < vectors.length; i++) {
					let vector = vectors[i]
					let initTrainVector: any[] = []
					let trainData = {
						data: initTrainVector
						}
						let v: number[] = []
						for (var j = 0; j < terms.length; j++) {
							let t = terms[j]
							let tf = vector.values[t.name]
							if (typeof tf == 'undefined') tf = 0
							v[j] = tf
						}
						trainData.data = [v, vector.classID]

						let string = `vector data (${vector.classID}) created ${trainData.data}`
						string = string.substring(0, 80)
						console.log(string)
					TrainData.insert(trainData)
				}
				!!rest ? rest.ok('done') : d.resolve()
			})
		})
		return d.promise
	}

	static train(request?, rest?): any {
		return (): Q.Promise<void> => {
			let d = Q.defer<void>()
			TrainData.find({}).then((dataset) => {
				try {
					svm.train(dataset)
					(!!rest) ? rest.ok(svm.classifier) : d.resolve()
				} catch (e) {
					(!!rest) ? rest.badRequest({ code: 400, message: `error: cannot train svm ${e}` }) : d.reject(e)
				}
			})
			return d.promise
		}
	}
}
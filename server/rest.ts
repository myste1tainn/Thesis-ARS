import { ParserController } from './controller/parser/parser'
import { ESFeeder } from './controller/feeder/es-feeder'
import { SupportVectorMachine } from './controller/svm/svm.controller'
import { TermVectorListController } from './controller/term-vector-list/term-vector-list'
import { VectorCollection, TermCollection } from '../shared/collection/collection'
import { Express, Request, Response } from 'express'
import { EXPRESS_SERVER } from './server'

let ExpressRest = require('express-rest')

let svm = new SupportVectorMachine()
svm.train()

export class ApplicationRestful {
	static setup(server: Express) {
		let rest = ExpressRest(server)
		rest.post('/api/vectors', (request: any, rest: any) => {
			var findAndReturn = () => {
				VectorCollection.find({}).then((vectors) => {
					if (vectors.length > 0) {
						rest.ok(vectors)
					} else {
						let ctrl = new TermVectorListController(null, null);
						ctrl.vector().then(() => {
							findAndReturn()
						})
					}
				})	
			}
			findAndReturn()
		})

		rest.get('/api/terms', (request: any, rest: any) => {
			TermCollection.find({}).then((terms) => {
				rest.ok(terms)
			})
		})

		rest.get('/api/parse-and-feed', (request: any, rest: any) => {
			let parser = new ParserController(null, null)
			parser.parse().then(() => {
				
			})
		})

		rest.get('/api/svm/train', (request: any, rest: any) => {
			rest.ok('svm trained')
		})
		rest.get('/api/svm/predict', (request: any, rest: any) => {
			rest.ok('svm predicted')	
		})

		console.log('log: all rest api are now set up')
	}
}
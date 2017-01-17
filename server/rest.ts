import { ParserController } from './controller/parser/parser'
import { ESFeeder } from './controller/feeder/es-feeder'
import { SupportVectorMachine } from './controller/svm/svm.controller'
import { TermVectorListController } from './controller/term-vector-list/term-vector-list'
import { TrainData, TrainedModelCollection, TermCollection, SolutionCollection } from '../shared/collection/collection'
import { Express, Request, Response } from 'express'
import { EXPRESS_SERVER } from './server'

let ExpressRest = require('express-rest')

export class ApplicationRestful {
	static setup(server: Express) {
		let rest = ExpressRest(server)
		rest.post('/api/vectors', (request: any, rest: any) => {
			let ctrl = new TermVectorListController(null, null);
			ctrl.vector().then((vectors) => {
				rest.ok(vectors)
			})
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

		rest.get('/api/assign-group-id', (request: any, rest: any) => {
			var urlAndGroupID: any = {}
			SolutionCollection.find({}).then((sols) => {
				for (var i = sols.length - 1; i >= 0; i--) {
					let sol = sols[i]
					var groupID = urlAndGroupID[sol.superUrl]
					if (typeof groupID == 'undefined') {
						groupID = Object.keys(urlAndGroupID).length
						urlAndGroupID[sol.superUrl] = groupID
					}
					sol.groupID = groupID
					SolutionCollection.update({_id: sol._id}, sol)
				}

				rest.ok('done')
			})
		})

		console.log('log: all rest api are now set up')
	}
}

function nullIfUndefined(value: any): any {
	return typeof value == 'undefined' ? null : value
}
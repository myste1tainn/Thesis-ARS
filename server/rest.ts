import { ParserController } from './controller/parser/parser'
import { ESFeeder } from './controller/feeder/es-feeder'
import { SupportVectorMachine } from './controller/svm/svm.controller'
import { TermVectorListController } from './controller/term-vector-list/term-vector-list'
import { TrainData, TrainedModelCollection, TermCollection, SolutionCollection, MessageCollection } from '../shared/collection/collection'
import { Express, Request, Response } from 'express'
import { EXPRESS_SERVER } from './server'
import { ES } from './controller/feeder/es'
import { GMAIL_USER_ID } from './controller/gmail/gmail-client'
import { createTransport } from 'nodemailer'

let ExpressRest = require('express-rest')

export class ApplicationRestful {
	static setup(server: Express) {
		let rest = ExpressRest(server)

		rest.get('/api/solutions', (request: any, rest: any) => {
			SolutionCollection.find({}).then(solutions => {
				rest.ok(solutions)
			})
		})

		rest.get('/api/vectors', (request: any, rest: any) => {
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

		server.get('/api/parse-and-feed', (request: any, response: Response) => {
			let parser = new ParserController(null, null)
			let promises = parser.parseAndFeed()
			response.setHeader('Content-Length', '600')
			response.send()
			promises.progress.then(() => {
				response.write(' ')
			})
			promises.end.then(() => {
				response.end()
			})
		})

		rest.get('/api/html/parse', (request: any, rest: any) => {
			let parser = new ParserController(null, null)
			parser.parse().end.then(() => {
				rest.ok('done')
			})
		})

		rest.get('/api/es/feed', (request: any, rest: any) => {
			let feeder = new ESFeeder(request, rest)
			feeder.start().then(() => {
				rest.ok('done')
			})
		})

		rest.get('/api/es/search', (request, rest) => {
			ES.limit = 10
			ES.search(request.query.query).then((results) => {
				rest.ok(JSON.parse(results).hits)
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

		rest.get('/api/try-send-email', (request, rest) => {
			let options = {
				from: GMAIL_USER_ID, // sender address
				to: GMAIL_USER_ID, // list of receivers
				subject: `ทดสอบการตั้งค่าระบบ`, // Subject line
				html: 'ทดสอบการตั้งค่าระบบ' // html body
			}

			let transporter = createTransport({
				service: 'gmail',
				auth: {
					user: 's5807021857075@email.kmutnb.ac.th',
					pass: '5807021857075'
				}
			})

			transporter.sendMail(options, (error:any, info:any) => {
				if (!!error) {
					console.log('ERROR: send mail error', error)
					rest.badRequest(error)
				} else {
					console.log('LOG: message sent')
					rest.ok({message: 'message sent'})
				}
			})
		})

		rest.post('/api/messages/mark-as-read', (request, rest) => {
			let messages = request.body
			for (var i = messages.length - 1; i >= 0; i--) {
				let id = messages[i].id
				MessageCollection.insert({ _id: id, isReplied: true })
			}
			rest.ok()
		})

		console.log('log: all rest api are now set up')
	}
}

function nullIfUndefined(value: any): any {
	return typeof value == 'undefined' ? null : value
}
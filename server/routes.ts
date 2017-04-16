import { Express, Request, Response } from 'express'
import { GmailClient, GMAIL_USER_ID } from './controller/gmail/gmail-client'
import { GmailInfoCollection } from '../shared/collection/collection'
import { GmailInfo } from '../shared/collection/gmail-info'
import { AutomaticResponse } from './controller/cron/AutoReplyCron'

let Path = require('path')

export class ApplicationRouter {
	static routes: any = [
		require('../client/page/home/home.page').Route,
		require('../client/page/control-panel/control-panel.page').Route,
		require('../client/page/vector-view/vector-view.page').Route,
		require('../client/page/gmail/gmail.page').Route,
		require('../client/page/pre-processing/pre-processing.page').Route,
		require('../client/page/pre-processing/pull-corpus/pull-corpus.page').Route,
		require('../client/page/pre-processing/create-index/create-index.page').Route,
		require('../client/page/pre-processing/train-svm/train-svm.page').Route,
		require('../client/page/post-processing/post-processing.page').Route,
		require('../client/page/setup/setup.page').Route,
		require('../client/page/welcome/welcome.page').Route,
	]

	static setup(server: Express) {
		console.log('log: bootstrapping server routes')
		server.get('', (request: Request, response: Response) => {
			let path = __dirname + '/../' + 'index.html'
			let safePath = Path.resolve(path)
			response.sendFile(safePath)
		})

		for (var i = this.routes.length - 1; i >= 0; i--) {
			let route = this.routes[i]
			server.get(route.path, (request: Request, response: Response) => {
				let path = __dirname + '/../' + 'index.html'
				let safePath = Path.resolve(path)
				response.sendFile(safePath)
			})
			let logPath = route.path == '' ? '/' : route.path
			console.log('log: route ', logPath, ' to ', route.template, 'is created.')
		}

		console.log('log: all application routes has been setup')

		let ExpressSession = require('express-session')
		server.use(ExpressSession({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))

		server.get('/oauthcallback', (request: any, response: Response) => {
			let id = GMAIL_USER_ID
			let code = request.query.code
			let info = new GmailInfo()
			info._id = id,
			info.userCode = code
			GmailInfoCollection.upsert({ _id: id }, info).then(() => {
				response.redirect(`/setup?id=${id}&code=${code}`)
			})
			.catch((error) => {
				console.log(error)
			})
		})

		// GMAIL Routing
		server.get('/gmail-access', (request: any, response: Response) => {
			let client = new GmailClient(GMAIL_USER_ID)
			response.send({
				url: client.authenticationURL,
				code: request.session.code
			})
		})

		server.get('/gmail-try', (request: any, response: Response) => {
			let ars = new AutomaticResponse()
			ars.start().then((res:any) => {
				response.send('ok')
			})
			.catch((error) => {
				response.status(error.code).send(error)
			})
		})

		server.get('/gmail-list', (request: any, response: Response) => {
			let client = new GmailClient(GMAIL_USER_ID)
			client.getMessageList().then((messages) => {
				response.send(messages)
			})
			.catch((error) => {
				response.status(error.code).send(error)
			})
		})
	}
}
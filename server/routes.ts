import { Express, Request, Response } from 'express'

let Path = require('path')

export class ApplicationRouter {
	static routes: any = [
		require('../client/page/home/home.page').Route,
		require('../client/page/control-panel/control-panel.page').Route,
		require('../client/page/vector-view/vector-view.page').Route
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
				// let path = __dirname + '/../' + route.template
				// let safePath = Path.resolve(path)
				// response.sendFile(safePath)
				let path = __dirname + '/../' + 'index.html'
				let safePath = Path.resolve(path)
				response.sendFile(safePath)
			})
			let logPath = route.path == '' ? '/' : route.path
			console.log('log: route ', logPath, ' to ', route.template, 'is created.')
		}

		console.log('log: all application routes has been setup')
	}

}
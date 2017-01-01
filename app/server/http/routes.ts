import { Controller } from '../controller/controller'
import { ParserController } from '../controller/parser/parser'
import { TermVectorListController } from '../controller/term-vector-list/term-vector-list'

export class RequestObject {
	requestObject: any
	constructor() {}
	get(key: string): any {
		return this.requestObject(key)
	}
}

export let Request = new RequestObject()

export class RouteItem {
	type: string
	path: string
	controller: any
	method: string
	constructor(type: string, path: string, controller: typeof Controller, method?: string) {
		this.type = type
		this.path = path
		this.controller = controller
		this.method = method
	}
}
export function Route(type: string, path: string, controller: typeof Controller, method?: string): RouteItem {
	return new RouteItem(type, path, controller, method)
}

export let ROUTES: RouteItem[] = [
	Route('get', '/parse', ParserController, 'parse'),
	Route('get', '/termvectors/list', TermVectorListController, 'list'),
	Route('get', '/termvectors/vector', TermVectorListController, 'vector'),
]
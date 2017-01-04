import * as e from 'express'

export class Controller {
	request: e.Request
	response: e.Response
	constructor(req: e.Request, res: e.Response) {
		this.request = req
		this.response = res
	}

	reply(string: string) {
		this.response.write(string)
		this.response.end()
	}
	replyJSON(any: any) {
		this.response.contentType('application/json; charset=utf8')
		this.reply(JSON.stringify(any))
	}
}
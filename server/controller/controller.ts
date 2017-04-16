import {Request, Response} from 'express'

export class Controller {
	request: Request
	response: Response
	constructor(req: Request, res: Response) {
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
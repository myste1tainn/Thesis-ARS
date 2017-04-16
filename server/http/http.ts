import * as Q from 'q'
import * as http from 'http'
import * as Convert from 'iconv-lite'
import { Errors, Error } from '../collection/errors'

// http.globalAgent.maxSockets = 100

export class HTTP {
	static _options = {
	  host: 'manual.readyplanet.com',
	  port: 80,
	  path: '',
	  method: 'GET',
	  encoding: 'utf8'
	}

	static constructOptions(url: string, options?: any) {
		let i = url.indexOf('/')
		if (i > -1) {
			this._options.host = url.substr(0, i)
			this._options.path = encodeURI(url.substr(i))

			let strings = url.split(':')
			if (strings.length > 1) {
				this._options.host = strings[0]
				var port = 80
				let slashIndex = strings[1].indexOf('/')
				if (slashIndex > -1) {
					port = +strings[1].substr(0, slashIndex)
				}
				this._options.port = port
			}
		} else {
			this._options.host = url
		}
		this._options.encoding = (!!options) ? options.encoding : 'utf8'
	}

	static get(url: string, options?: any) {
		this.constructOptions(url, options)
		this._options.method = 'GET'
		return this.performRequest()
	}
	static post(url: string, param: any, options?: any) {
		this.constructOptions(url, options)
		this._options.method = 'POST'
		return this.performRequest(param)
	}
	static put(url: string, param: any, options?: any) {
		this.constructOptions(url, options)
		this._options.method = 'PUT'
		return this.performRequest(param)
	}
	static delete(url: string, param?: any, options?: any) {
		this.constructOptions(url, options)
		this._options.method = 'DELETE'
		return this.performRequest(param)
	}

	static performRequest(body: any = ''): Q.Promise<string> {
		var deferred = Q.defer<string>()
		// var strings = ''
		if (typeof body != 'string') {
			body = JSON.stringify(body)
		}
		var data: Buffer[] = []
		var req = http.request(this._options, (res) => {
		    // res.setEncoding('utf8');

			res.on('data', (chunk: Buffer) => {
				data.push(chunk)
			})
			res.on('end', () => {
				let buffer = Buffer.concat(data)
				var string = Convert.decode(buffer, this._options.encoding)
				deferred.resolve(string)
				req.end()
			})
			res.on('error', (error) => {
				deferred.reject(error)
			})
		})
		req.setHeader('Content-Type', 'text/html; charset=utf8')
		req.write(body)
		req.on('error', (error: any) => {
			deferred.reject(error)
			req.end()
		})
		req.end()
		return deferred.promise
	}
}
import * as Q from 'q'
import { Controller } from '../controller'
import { LinkParser } from './link-parser'
import { SolutionParser } from './solution-parser'
import { Solution } from '../../../shared/collection/solution'
import { SolutionCollection } from '../../../shared/collection/collection'
import { Errors, Error } from '../../collection/errors'
import { HTTP } from '../../http/http'
import { ESFeeder } from '../feeder/es-feeder'
import {Request, Response} from 'express'

let terminal = require('terminal-kit').terminal
let linkParser = new LinkParser()
let solutionParser = new SolutionParser()
var __solutionCount = 0
var __consumptionPool = 1

function __consume() {
	__consumptionPool--
	// console.log('log: pool DECREASED, ', __consumptionPool)
}
function __produce(num: number = 1) {
	__consumptionPool += num
	// console.log('log: pool ADDED, ', __consumptionPool, ' (' + num + ')')
}

let TARGET_URL = 'manual-velaclassic-th.readyplanet.com'
var END_PARSING: any;

export class ParserControllerResponse {
	dProgress: Q.Deferred<any>
	dEnd: Q.Deferred<void>
	progress: Q.Promise<any>
	end: Q.Promise<void>
	constructor() {
		this.dProgress = Q.defer()
		this.dEnd = Q.defer<void>()
		this.progress = this.dProgress.promise
		this.end = this.dEnd.promise
	}
}

export class ParserController extends Controller {
	processedURLs: string[]
	solutions: Solution[]
	defers = new ParserControllerResponse()

	constructor(req: Request, res: Response) {
		super(req, res)
		this.processedURLs = []
		this.solutions = []
	}

	parse() {
		this.start(TARGET_URL, null, true)
		return this.defers
	}

	parseAndFeed() {
		this.defers.dProgress = Q.defer()
		this.start(TARGET_URL, null, true)
		this.defers.dProgress.promise.then(() => {
			terminal.moveTo(1, 1)
			terminal.eraseDisplayBelow()
			terminal('STARTING ElasticSearch Feeder...')
			let feeder = new ESFeeder(this.request, this.response)
			feeder.start().then(() => {
				this.defers.dEnd.resolve()
			})
		})
		return this.defers
	}

	catchError(errorMessage: string) {
		console.log((new Date) + ' ::: ERROR ::: ' + errorMessage.substr(0, 80))
		let error = new Error()
		error.message = errorMessage
		Errors.insert(error)
		this.defers.dProgress.notify(null)
	}

	start(url: string, superUrl?: string, parseSideBar: boolean = false) {
		__consume()
		if (this.processedURLs.indexOf(url) > -1) {
			return
		}
		this.processedURLs.push(url)
		let parse = this.doParseHandler(url, superUrl, parseSideBar)
		HTTP.get(url, { encoding: 'tis-620' })
		.then(parse)
		.catch((error) => {
			var string = '' 
			if (error.code == 'ECONNRESET' || error.code == 'ETIMEDOUT') {
				string = 'connection reset occurred, RESTARTING...'
				this.restart(url, superUrl, parseSideBar)
			} else if (error.code == 'ENOTFOUND') {
				string = `request not found occurred ${url}`
			} else {
				string = `other error occurred ${error}`
			}
			console.log('log: ' + string)
			console.log('log: ', error)
			this.catchError(string)
		})
	}

	restart(url: string, superUrl?: string, parserSidebar: boolean = false) {
		console.log('log: an ECONNRESET error occurred, restarting...')
		return () => {
			let seconds = 5
			console.log('log: waiting for 5 seconds before restarting')
			setTimeout(() => {
				console.log('log: restarting crawler from ' + url)
				this.start(url, superUrl)
			}, seconds * 1000)
		}
	}

	doParseHandler(url: string, superUrl?: string, parseSideBar: boolean = false) {
		return (html: any) => {
			linkParser.parseSideBar = parseSideBar
			let links = this.linksFromHtml(html, url)
			this.parseSolution(html, url, superUrl, links)
		}
	}

	linksFromHtml(html: string, ownerUrl?: string) {
		let links = linkParser.parse(html)
		__produce(links.length)
		for (var i = links.length - 1; i >= 0; i--) {
			var link = links[i]
			if (link.indexOf('http://') > -1) {
				link = link.substr(7)
			}
			this.start(link, ownerUrl)
		}
		return links
	}

	parseSolution(html: string, url: string, superUrl?: string, links?: string[]) {
		solutionParser.parse(html).then((solution) => {
			solution.url = url
			solution.childUrls = links
			solution.superUrl = superUrl
			this.solutions.push(solution)
			__solutionCount++
			this.saveToDb(solution)
		}).catch(this.catchError)
	}

	saveToDb(solution: Solution) {
		clearTimeout(END_PARSING)

		SolutionCollection.upsert({ _id: solution._id }, solution)
		var string = ""
		string += 'log: solution parsed and save, total ' + __solutionCount + ', processed URL ' + this.processedURLs.length
		string += `\nname: ${solution.name}`
		string += `\nurl: ${solution.url}`
		string += `\nstepsCount: ${solution.steps.length}`
		terminal.moveTo(1, 1)
		terminal.eraseDisplayBelow()
		terminal(string)
		this.defers.dProgress.notify(null)

		END_PARSING = setTimeout(() => {
			this.defers.dProgress.resolve()
		}, 60000)
	}
}
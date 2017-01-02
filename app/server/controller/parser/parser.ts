import * as Q from 'q'
import { Controller } from '../controller'
import { LinkParser } from './link-parser'
import { SolutionParser } from './solution-parser'
import { Solutions, Solution } from '../../collection/solutions'
import { Errors, Error } from '../../collection/errors'
import { HTTP } from '../../http/http'
import { ESFeeder } from '../feeder/es-feeder'

let term = require('terminal-kit').terminal
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

var END_PARSING: any;

export class ParserController extends Controller {
	processedURL: string[]
	solutions: Solution[]
	defer: Q.Deferred<any>

	constructor(req, res) {
		super(req, res)
		this.processedURL = []
		this.solutions = []
	}

	parse() {
		let endDefer = Q.defer()
		this.defer = Q.defer()
		this.start('manual-velaclassic-th.readyplanet.com', null, true)
		this.defer.promise.then(() => {
			term.moveTo(1, 1)
			term.eraseDisplayBelow()
			term('STARTING ElasticSearch Feeder...')
			let feeder = new ESFeeder(this.request, this.response)
			feeder.start().then(() => {
				endDefer.resolve()
			})
		})
		return endDefer.promise
	}

	catchError(errorMessage: string) {
		console.log((new Date) + ' ::: ERROR ::: ' + errorMessage.substr(0, 80))
		let error = new Error()
		error.message = errorMessage
		Errors.insert(error)
	}

	start(url: string, superUrl?: string, parseSideBar: boolean = false) {
		__consume()
		if (this.processedURL.indexOf(url) > -1) {
			return
		}
		this.processedURL.push(url)
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
		return (html) => {
			linkParser.parseSideBar = parseSideBar
			let links = this.parseLinks(html, url)
			this.parseSolution(html, url, superUrl, links)
		}
	}

	parseLinks(html: string, ownerUrl?: string) {
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

		Solutions.upsert({ _id: solution._id }, solution)
		var string = ""
		string += 'log: solution parsed and save, total ' + __solutionCount + ', processed URL ' + this.processedURL.length
		string += `\nname: ${solution.name}`
		string += `\nurl: ${solution.url}`
		string += `\nstepsCount: ${solution.steps.length}`
		term.moveTo(1, 1)
		term.eraseDisplayBelow()
		term(string)

		END_PARSING = setTimeout(() => {
			this.defer.resolve()
		}, 60000)
	}
}
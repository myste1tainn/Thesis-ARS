import * as Q from 'q'
import * as Cheerio from 'cheerio'
import * as Crypto from 'crypto'
import { Solution } from '../../../shared/collection/solution'
import { Errors, Error } from '../../collection/errors'

var _this: SolutionParser = null
export class SolutionParser {
	deferred: Q.Deferred<Solution>
	foundPotentialSpan: boolean
	foundContent: boolean
	isScript: boolean

	constructor() {
		_this = this
	}

	init() {
		this.deferred = Q.defer<Solution>()
	}

	parse(html: string) {
		this.init()

		setTimeout(() => {
			let sol = _this.solutionFrom(html)
			if (!!sol) {
				_this.deferred.resolve(sol)	
			} else {
				_this.deferred.reject(`Solution cannot be parsed from html\n\n${html}`)
			}
		}, 0)

		return this.deferred.promise
	}

	solutionFrom(html: string): Solution {
		let sol = new Solution()

		let $ = Cheerio.load(html)
		let name = _this.solutionNameFrom($)
		if (name == null || name.trim() == "") {
			return null
		}
		sol.name = name
		sol._id = Crypto.createHash('md5').update(name).digest('hex')

		let steps = _this.solutionStepsFrom($)
		for (var i = 0; i < steps.length; i++) {
			let step = steps[i]
			if (step.trim() != "") {
				sol.steps.push(step)
			}
		}

		return sol
	}

	solutionNameFrom($: CheerioStatic) {
		let el = $('td.content span.h3')
		if (el.length == 0 || el == null) {
			el = $('td.content span.h2')
		}
		return el.text()
	}

	solutionStepsFrom($: CheerioStatic) {
		let steps: string[] = null
		let contentEl = $('div.article_detail_div')
		if (contentEl.length == 0 || contentEl == null) {
			var text = $('td.content').children('table').first().text()
			text = text.replace('\r', '')
			steps = text.split('\n')
		} else {
			steps = contentEl.text().split('\n') 
		}
		return steps
	}

	hasPrefixedNumber(string: string): boolean {
		return string.indexOf('1.') > -1 ||
		string.indexOf('2.') > -1 ||
		string.indexOf('3.') > -1 ||
		string.indexOf('4.') > -1 ||
		string.indexOf('5.') > -1 ||
		string.indexOf('6.') > -1 ||
		string.indexOf('7.') > -1 ||
		string.indexOf('8.') > -1 ||
		string.indexOf('9.') > -1 ||
		string.indexOf('10.') > -1
	}
}
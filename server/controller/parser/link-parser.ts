import * as Cheerio from 'cheerio'
import * as Q from 'q'

export class LinkParser {
	parseSideBar: boolean
	get deferred(): Q.Deferred<string[]> {
		return Q.defer<string[]>()
	}

	constructor(parseSideBar: boolean = false) {
		this.parseSideBar = parseSideBar
	}

	parse(html: string) {
		var links: string[] = []
		let $ = Cheerio.load(html)
		if (!this.parseSideBar) {
			$('td.side').remove()
		}
		let linkTags = $('a')
		for (var i = linkTags.length - 1; i >= 0; i--) {
			let link = linkTags[i].attribs['href']
			if (link.indexOf('#') > -1) {
				continue
			}
			
			if (link.indexOf('/') == 0) {
				link = 'manual-velaclassic-th.readyplanet.com' + link
			} else if (link.indexOf('manual') == -1) {
				continue
			}
			
			links.push(link)
		}
		return links
	}
}
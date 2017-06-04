import { CronJob } from 'cron'
import { GmailClient, GMAIL_USER_ID } from '../gmail/gmail-client'
import { GmailInfoCollection, MessageCollection } from '../../../shared/collection/collection'
import { Message } from '../../../shared/collection/message'
import { ES } from '../feeder/es'
import { createTransport } from 'nodemailer'
import { Error } from '../../../shared/error'
import * as Q from 'q'

new CronJob('*/5 * * * * *', function() {
  let ars = new AutomaticResponse()
	ars.start().then((res:any) => {
		console.log('reply done')
	})
	.catch((error) => {
		console.log('reply error', error)	
	})
}, null, true);

function intersectInverse<T>(aa: T[], bb: T[], evaluate: (a: T, b: T) => boolean) {
	var results: T[] = aa.map((a): T => { return a })
	for (var i = bb.length - 1; i >= 0; i--) {
		let b = bb[i]
		results = results.filter((r) => { return evaluate(r, b) })
	}
	return results
}

export class AutomaticResponse {

	start() {
		let d = Q.defer()
		let client = new GmailClient(GMAIL_USER_ID)
		client.getMessageList().then((apiResponse:any) => {
			if (apiResponse.response == null) {
				console.log('response is null')
				return
			}
			let allIds = apiResponse.response.messages.map((o:any) => { return o.id })

			MessageCollection.find({}).then((repliedMessages) => {
				let repliedIds = repliedMessages.map((o): string => { return o._id })
				let unrepliedIds = intersectInverse(allIds, repliedIds, (a, b) => { return a != b })
				if (unrepliedIds.length > 0) {
					for (var i = unrepliedIds.length - 1; i >= 0; i--) {
						let id = unrepliedIds[i]
						console.log('replying to message id', id)
						this.getDetailAndSendMessage(id, client)
					}	
				} else {
				}
			})
		})
		return d.promise
	}

	getDetailAndSendMessage(id:any, client:any) {
		let d = Q.defer()
		client.getMessageDetail(id).then((apiResponse:any) => {
			let m = new Message()
			m._id = id
			m.isReplied = true

			if (apiResponse.response == null || typeof apiResponse.response.payload == 'undefined') {
				console.log('ERROR: apiResponse response/payload is not there')
				return
			}
			let payload = apiResponse.response.payload
			let message = this.messageFromPayload(payload)
			let query = this.queryFromMessage(message)
			if (query == "") {
				console.log('ERROR: query is empty')
				return
			} else {
				console.log(payload.headers)
				let froms = payload.headers.filter((o:any) => { return o.name == 'From' })
				let subjects = payload.headers.filter((o:any) => { return o.name == 'Subject' })
				let ids = payload.headers.filter((o:any) => { return o.name == 'Message-Id' })
				let senderAddress = froms[0].value
				if (ids.length == 0) {
					ids = payload.headers.filter((o:any) => { return o.name == 'Message-ID' })
				}
				ES.limit = 10

				console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
				console.log("search with")
				console.log(query)
				console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")

				ES.search(query).then((results) => {
					console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
					console.log("result is coming")
					console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")					
					let sources = this.sources(results)
					let html = this.html(sources)

					console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
					console.log("HTML")
					console.log(html)
					console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")					

					console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
					console.log("SOURCE")
					console.log(GMAIL_USER_ID)
					console.log(senderAddress)
					console.log(ids)
					console.log(`Re: ${subjects[0].value}`)
					console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")					

					let options = {
						from: GMAIL_USER_ID, // sender address
						to: senderAddress, // list of receivers
						replyTo: senderAddress,
						inReplyTo: ids[0].value,
						messageId: ids[0].value,
						subject: `Re: ${subjects[0].value}`, // Subject line
						html: html // html body
					}

					console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
					console.log("trying to send mail with")
					console.log(options)
					console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")

					this.transporter.sendMail(options, (error:any, info:any) => {
						console.log(error, info)
						if (!!error) {
							console.log('ERROR: send mail error', error)
						} else {
							console.log('LOG: replied to message id', id)
						}
					})

				}, error => {
					console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
					console.log("ERROR")
					console.log(error)
					console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
				})
			}
			console.log('####################################################')
		})
		return d.promise
	}

	messageFromPayload(payload:any) {
		if (typeof payload.body.data != 'undefined' && payload.body.data.length != 0) {
			return Buffer.from(payload.body.data, 'base64').toString('utf8')
		} else if (typeof payload.parts[0] != 'undefined' && typeof payload.parts[0].body.data != 'undefined' && payload.parts[0].body.data.length != 0) {
			return Buffer.from(payload.parts[0].body.data, 'base64').toString('utf8')
		} else {
			throw 'COULD NOT GET THE MESSAGE !@#'
		}
	}

	queryFromMessage(message:string) {
		return message
		// if (message.indexOf('ล็อกอิน') > -1) {
		// 	return 'ล็อกอิน'
		// } else if (message.indexOf('สมาชิก') > -1) {
		// 	return 'สมาชิก'
		// } else if (message.indexOf('ตกแต่ง') > -1) {
		// 	return 'ตกแต่ง'
		// } else if (message.indexOf('รหัสผ่าน') > -1) {
		// 	return 'รหัสผ่าน'
		// } else if (message.indexOf('commerce') > -1 || message.indexOf('ขาย') > -1 || message.indexOf('สินค้า') > -1) {
		// 	return 'commerce'
		// } else {
		// 	return ""
		// }
	}

	sources(results:string): any[] {
		var sources:any[] = []
		let object = JSON.parse(results)
		let hitsObject = object.hits.hits
		var sources:any[] = []
		for (var i = hitsObject.length - 1; i >= 0; i--) {
			delete hitsObject[i]._source.steps
			delete hitsObject[i]._source.childUrls
			delete hitsObject[i]._source.superUrl
			sources.push(hitsObject[i]._source)
		}
		return sources
	}

	html(sources: any[]): string {
		let alertTH = '<div style="color:red">อีเมล์นี้เป็นการทดสอบระบบตอบกลับอัตโนมัติหากท่านเป็นผู้รับที่ไม่ถูกวัตถุประสงค์กรุณาลบอีเมล์ฉบับนี้ กราบขออภัยมา ณ ที่นี้</div>'
		let alertEN = '<div style="color:red">This e-mail is a test system of auto-reply system, if this e-mail finds wrong recipient please disregard & kindly deleted, sorry for the inconvenience</div>'
		var html = '<div>' + alertTH + alertEN + '<br/><b>เรียนคุณลูกค้า</b>,<br/>&nbsp;&nbsp;&nbsp;&nbsp;ทางบริษัทได้รับอีเมล์ของท่านแล้วและกำลังดำเนินงาน หาวิธีช่วยเหลือ<br/>&nbsp;&nbsp;&nbsp;&nbsp;ในระหว่างนี้ท่านสามารถศึกษา Page ช่วยเหลือที่ได้จัดเตรียมไว้ให้ก่อนเพื่อความสะดวกรวดเร็วได้ค่ะ<br/>&nbsp;&nbsp;&nbsp;&nbsp;';
        html += '<ul>'
        for (var i = 0; i < sources.length; ++i) {
            let link = '<li><a href="http://' + sources[i].url + '">' + sources[i].name + '</a></li>'
            html += link;
        }
        html += '</ul>'
        html += '</div>';
        return html
	}

	get transporter(): any {
		return createTransport({
			service: 'gmail',
			auth: {
				user: 's5807021857075@email.kmutnb.ac.th',
				pass: '5807021857075'
			}
		})
	}
}
import { GmailInfo, isTokenValid, credentialsObject } from '../../../shared/collection/gmail-info'
import { Message } from '../../../shared/collection/message'
import { MessageCollection, GmailInfoCollection } from '../../../shared/collection/collection'
import * as Q from 'q'
import { Error } from '../../../shared/error'

let OAuth2 = require('googleapis').auth.OAuth2
let session = require('express-session')
let GmailAPI = new (require('googleapis')).GoogleApis().gmail("v1")
export let GMAIL_USER_ID = 's5807021857075@email.kmutnb.ac.th'

export class GmailClient {
	apiClient: any
	userId: string
	info?: GmailInfo
	authClient = new OAuth2(
	  G_API_CREDENTIALS.web.client_id,
	  G_API_CREDENTIALS.web.client_secret,
	  G_API_CREDENTIALS.web.redirect_uris[0]
	);

	scopes = ['https://mail.google.com/'];
	get authenticationURL(): string {
		return this.authClient.generateAuthUrl({
		  access_type: 'offline',
		  scope: this.scopes,
		});
	}

	constructor(userId: string) {
		this.userId = userId
	}

	getInfo(): Q.Promise<GmailInfo> {
		let d = Q.defer<GmailInfo>()
		if (!!this.info) {
			d.resolve(this.info)
		} else {
			GmailInfoCollection.findOne({ _id: this.userId }).then((info) => {
				this.info = info
				d.resolve(info)
			})
		}
		return d.promise
	}

	saveInfo(userId:string, userCode:string, credentials:any) {
		let info = new GmailInfo()
		info._id = userId
		info.userCode = userCode
		info.accessToken = credentials.access_token
		info.tokenType = credentials.token_type
		info.expiryDate = new Date(credentials.expiry_date)
		GmailInfoCollection.upsert({ _id: userId }, info)
	}

	private getCredentialsWithInfo(info: GmailInfo) {
		let d = Q.defer()
		this.authClient.getToken(info.userCode, (error: any, credentials: any) => {
			if (!!error) {
				console.log('get cred ERROR', error)
				Error.handle(404, d)(error)
			} else {
				console.log('got cred', credentials)
				this.saveInfo(info._id, info.userCode, credentials)
				d.resolve(credentials)
			}
		})
		return d.promise
	}

	getCredentials() {
		let d = Q.defer()
		this.getInfo().then((info) => {
			if (isTokenValid(info)) {
				console.log('token still valids')
				let cred = credentialsObject(info)
				d.resolve(cred)
			} else {
				console.log('token is not valid anymore')
				this.getCredentialsWithInfo(info).then((credentials:any) => {
					d.resolve(credentials)
				})
			}
		})
		return d.promise
	}

	getAuthenticatableClient() {
		let d = Q.defer()
		this.getCredentials().then((credentials:any) => {
			this.authClient.setCredentials(credentials)
			d.resolve(this.authClient)
		})
		.catch(Error.handle(500, d))
		return d.promise
	}

	getMessageList() {
		let d = Q.defer()
		this.getAuthenticatableClient().then((client) => {
			let params = {userId: this.info._id, labelIds: 'INBOX', auth: client}
			GmailAPI.users.messages.list(params, {}, (error:any,response:any,httpResponse:any) => {
				if (!!error) {
					console.log('its error', error)
					d.reject(error)
				} else {
					console.log('its success')
					d.resolve({
						token: this.info.accessToken,
						response: response,
						httpResponse: httpResponse
					})
				}
			}) 
		}, Error.handle(500, d))
		return d.promise
	}

	getMessageDetail(messageId:string) {
		let d = Q.defer()
		this.getAuthenticatableClient().then((client:any) => {
			let params = {userId: this.info._id, id: messageId, auth: client}
			GmailAPI.users.messages.get(params, (error:any,response:any,httpResponse:any) => {
				if (!!error) {
					Error.handle(400, d)(error)
				} else {
					d.resolve({
						token: this.info.accessToken,
						response: response,
						httpResponse: httpResponse
					})
				}
			})
		}, Error.handle(500, d))
		return d.promise
	}
}

let G_API_CREDENTIALS = {
    "web": {
        "client_id": "741944166721-v1beq482nbsdg05p67i1dtedpp95v61g.apps.googleusercontent.com",
        "project_id": "thesis-162705",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://accounts.google.com/o/oauth2/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_secret": "-sgMWuS8kIizrT-DlJI8MlAH",
        "redirect_uris": [
            "http://myste1tainn.com:3000/oauthcallback"
        ],
        "javascript_origins": [
            "http://localhost:8080",
            "http://localhost:3000"
        ]
    }
}
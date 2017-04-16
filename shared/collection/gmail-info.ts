import 'reflect-metadata'
import {Model} from './model'

export class GmailInfo extends Model {
	_id: any
	userCode: string
	accessToken?: string
	refreshToken?: string
	tokenType?: string
	expiryDate?: Date
}

export function isTokenValid(info: GmailInfo): boolean {
		if (!!info.expiryDate) {
			let now = new Date()
			console.log('COMPARING DATE', info.expiryDate, now)
			return info.expiryDate > now
		} if (info.accessToken == null) {
			return false
		} else {
			return false
		}
	}

export function credentialsObject(info: GmailInfo): any {
	return {
		access_token: info.accessToken,
		token_type: info.tokenType,
		expiry: (!!info.expiryDate) ? info.expiryDate.getTime() : null
	}
}
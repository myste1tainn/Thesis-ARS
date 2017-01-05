import { Collection, Model } from '../../shared/collection/model'

// Database Collections
export let Errors = new Collection<Error>('errors')

// Data model
export class Error extends Model {
	message: string
	date: Date

	constructor() {
		super()
		this.date = new Date()
	}
}
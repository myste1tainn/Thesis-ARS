import { Collection, Model } from './model'

// Database Collections
export let Solutions = new Collection<Solution>('solutions')

// Data model
export class Solution extends Model {
	url: string
	childUrls: string[]
	superUrl: string
	name: string
	steps: string[]

	constructor() {
		super()
		this.steps = []
	}
}
import { Collection, Model } from './model'

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
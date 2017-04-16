import 'reflect-metadata'
import {Model} from './model'
import {MessageCollection} from './collection'

export class Message extends Model {
	_id?: any

	set isReplied(replied: boolean) {
		if (replied) {
			MessageCollection.upsert({ _id: this._id }, this)
		} else {
			MessageCollection.delete({ _id: this._id })
		}
	}
}
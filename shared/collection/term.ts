import 'reflect-metadata'
import {MongoClient, Collection} from 'mongodb'
import {Model} from './model'

export class Term extends Model {
	_id?: any
	name: any
}
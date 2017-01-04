import * as Q from 'q'
import * as Mongo from 'mongodb'
import { DB } from '../../server/collection/db'

export interface Indexable {
	_id?: string
}
export class Model implements Indexable {
	_id?: string
}

export class Collection<T extends Indexable> {
	collectionName: string
	collection: Mongo.Collection

	constructor(collectionName?: string) {
		this.collectionName = collectionName
		console.log('log:', collectionName, 'instantiated')
		DB.default().connect().then((db) => {
			console.log('log: connection to mongodb established')
			this.collection = db.collection(this.collectionName)
		}).catch((err) => {
			console.log('log: connection to db cannot be establised', err)
		})
	}

	find(query: Object, fields?: Object, skip?: number, limit?: number, timeout?: number): Q.Promise<T[]> {
		let d = Q.defer<T[]>()
		console.log('finding ', this.collectionName)
		this.collection.find(query, fields, skip, limit, timeout).toArray((err, docs) => {
			if (err) {
				d.reject(err)
			} else {
				let objects = <T[]>docs
				d.resolve(objects)
			}
		})
		return d.promise
	}

	insert(object: T, options?: Mongo.CollectionInsertOneOptions): Q.Promise<T> {
		let d = Q.defer<T>()
		this.collection.insertOne(object, options, (err, res) => {
			if (err || res.insertedCount == 0) {
				err == null && res.insertedCount == 0 ? 
				(err = new Mongo.MongoError('Nothing get inserted, unknow error')) : null;
				d.reject(err)
			} else {
				object._id = res.insertedId.toString()
				d.resolve(object)
			}
		})
		return d.promise
	}

	update(filter: Object, update: T, options?: Mongo.ReplaceOneOptions): Q.Promise<T> {
		let d = Q.defer<T>()
		this.collection.updateOne(filter, update, options, (err, res) => {
			if (err) {
				d.reject(err)
			} else {
				if (res.upsertedId) {
					// update._id = res.upsertedId._id.toString()
				}
				d.resolve(update)
			}
		})
		return d.promise
	}

	upsert(filter: Object, update: T, options?: Mongo.ReplaceOneOptions): Q.Promise<T> {
		(!!options) ? options.upsert = true : options = { upsert: true }
		return this.update(filter, update, options)
	}

	delete(filter: Object, options?: {
		    w?: string | number;
		    wtimmeout?: number;
		    j?: boolean;
		    bypassDocumentValidation?: boolean;
		}) {
		let d = Q.defer<void>()
		this.collection.deleteOne(filter, options, (err, res) => {
			if (err) {
				d.reject(err)
			} else {
				d.resolve()
			}
		})
		return d.promise
	}
}
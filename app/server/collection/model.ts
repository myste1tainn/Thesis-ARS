import * as Q from 'q'
import * as Mongo from 'mongodb'
import { DB } from './db'

export interface Indexable {
	_id: string
}
export class Model implements Indexable {
	_id: string
}

export class Collection<DataModel extends Indexable> {
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

	find(query: Object, fields?: Object, skip?: number, limit?: number, timeout?: number): Q.Promise<DataModel[]> {
		let d = Q.defer<DataModel[]>()
		this.collection.find(query, fields, skip, limit, timeout).toArray((err, docs) => {
			if (err) {
				d.reject(err)
			} else {
				let objects = <DataModel[]>docs
				d.resolve(objects)
			}
		})
		return d.promise
	}

	insert(object: DataModel, options?: Mongo.CollectionInsertOneOptions): Q.Promise<DataModel> {
		let d = Q.defer<DataModel>()
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

	update(filter: Object, update: DataModel, options?: Mongo.ReplaceOneOptions): Q.Promise<DataModel> {
		let d = Q.defer<DataModel>()
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

	upsert(filter: Object, update: DataModel, options?: Mongo.ReplaceOneOptions): Q.Promise<DataModel> {
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
import * as Q from 'q'
import { MongoClient, Db, Collection } from 'mongodb'

export class DB {
	private static DEFAULT_DB: DB
	client: MongoClient
	uri: string
	db: Db

	static default(): DB {
		if (!this.DEFAULT_DB) {
			this.DEFAULT_DB = new DB()
		}
		return this.DEFAULT_DB
	}

	constructor() {
		this.uri = 'mongodb://localhost:27017/thesis'
		this.client = new MongoClient()
		this.connect()
	}
	connect(): Q.Promise<Db> {
		var d = Q.defer<Db>()
		if (this.db) {
			d.resolve(this.db)
			return d.promise
		}
		this.client.connect(this.uri, (err, db: Db) => {
			this.db = db
			d.resolve(db)
		})
		return d.promise
	}
	collection(name: string): Collection {
		return this.db.collection(name)
	}

}

DB.default()
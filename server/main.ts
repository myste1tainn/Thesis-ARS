/**
 * Created by mjwheatley on 3/23/16.
 */
import 'zone.js'
import 'reflect-metadata'
import '../lib/methods'
import './publish'
import { Meteor } from 'meteor/meteor'
import { HTTP } from 'meteor/http'
import { ESFeeder } from './controller/feeder/es-feeder'
import { ParserController } from './controller/parser/parser'
import { TermVectorListController } from './controller/term-vector-list/term-vector-list'
import { VectorCollection, Vector } from '../lib/collections/vector'

let sync = require('sync')
console.log(sync)

declare class Restivus {
    constructor (options?: any);
    public addCollection<T>(collection: Mongo.Collection<T>);
    public addRoute<T>(path: string, conf: {}, routes: {});
}

if (Meteor.isServer) {
	let API = new Restivus()
	API.addRoute('parse-and-feed', { authRequired: false }, {
		get: () => {
			let parser = new ParserController(null, null)
			parser.parse().then(() => {
				this.response.end('done')
			})
		}
	})
	API.addRoute('vectors', { authRequired: false }, {
		post: () => {
			let vector = VectorCollection.findOne()
			console.log('Checking vector state...')
			if (!vector) {
				console.log('Getting term vectors to create vector')
				let ctrl = new TermVectorListController(null, this.response);
				ctrl.vector().then(Meteor.bindEnvironment((m) => {
					
				}))
			} else {
				console.log('Existing vector is already there')
			}
			
			return { success: true }
		}
	})

	API.addRoute('svm/train', { authRequired: false }, {
		get: () => {
			this.response.end('done') 
		}
	})

	API.addRoute('svm/predict', { authRequired: false }, {
		get: () => {
			this.response.end('done')
		}
	})
}
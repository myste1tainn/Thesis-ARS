import * as Q from 'q'
import {Meteor} from 'meteor/meteor';
import { Controller } from '../controller'
import { ES } from '../feeder/es'
import { VectorCollection, Vector } from '../../../lib/collections/vector'
import { TermCollection, Term } from '../../../lib/collections/term'
import 'zone.js'
import 'reflect-metadata'

export class TermVectorListController extends Controller {
	static self: TermVectorListController

	constructor(req, res) {
		super(req, res)
		TermVectorListController.self = this
	}

	list() {
		ES.getAllTermVectors().then((termVectors) => {
			this.replyJSON(termVectors)
		})
	}

	vector() {	
		var q = Q.defer()
		ES.getAllTermVectors().then(Meteor.bindEnvironment((termVectorsInfo) => {
			this.createVectors(termVectorsInfo)
		}))
		return q.promise
	}

	createVectors(termVectorsInfo) {
		for (var i = termVectorsInfo.docs.length - 1; i >= 0; i--) {
			let doc = termVectorsInfo.docs[i]
			var id = <string>doc._id
			id = id.replace(/\./g, '_')
			let termVectors = doc.term_vectors
			var vectorObj = {}
			for (let termVectorKey in termVectors) {
				let terms = termVectors[termVectorKey].terms
				for (let termKey in terms) {
					var newTermKey = termKey
					if (termKey.indexOf('.') > -1) {
						newTermKey = termKey.replace(/\./g, '_')
					}
					let freq = terms[termKey].term_freq

					if (!vectorObj) {
						vectorObj = {}
					}
					if (!vectorObj[newTermKey]) {
						vectorObj[newTermKey] = 0
					}
					vectorObj[newTermKey] += freq
					TermCollection.upsert({ _id: termKey }, { _id: termKey, name: termKey })
				}
			}
			let vector = new Vector()
			vector._id = id
			vector.values = vectorObj
			VectorCollection.upsert({ _id: id }, vector)
		}
	}
}
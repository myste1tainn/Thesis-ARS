import * as Q from 'q'
import { Controller } from '../controller'
import { ES } from '../feeder/es'
import { Vector } from '../../../shared/collection/vector'
import { Term } from '../../../shared/collection/term'
import { VectorCollection, TermCollection } from '../../../shared/collection/collection'
import {Request, Response} from 'express'
import 'zone.js'
import 'reflect-metadata'

export class TermVectorListController extends Controller {
	static self: TermVectorListController

	constructor(req: Request, res: Response) {
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
		VectorCollection.find({}).then((vectors) => {
			if (vectors.length > 0) {
				q.resolve(vectors)
			} else {
				ES.getAllTermVectors().then((esResult) => {
					vectors = this.createVectors(esResult)
					q.resolve(vectors)
				})	
			}
		})	
		return q.promise
	}

	createVectors(esResult: any): Vector[] {
		var vectors: Vector[] = []
		for (var i = esResult.docs.length - 1; i >= 0; i--) {
			let doc = esResult.docs[i]
			let id = <string>doc._id
			var vectorObj = {}
			let terms = doc.term_vectors.steps.terms
			let termsCount = this.termsCountFor(terms)
			for (let key in terms) {
				let term = terms[key]
				let score = this.createTermIfNeeded(key, term, vectorObj, termsCount, id)
				vectorObj[key] = score
			}
			vectors.push(this.createVector(id, vectorObj))
		}
		return vectors
	}

	termsCountFor(terms: any[]): number {
		var count = 0
		for (let key in terms) {
			let term = terms[key]
			count += term.term_freq
		}
		return count
	}

	createTermIfNeeded(key: any, term: any, vectorObj: any, termsCount: number, id: any): any {
		key = key.replace(/\./g, '_')
		let DOC_COUNT = 638
		let termObject = { 
			_id: key, 
			name: key,
		}
		termObject[id] = {
			termCount: term.term_freq,
			docTermsCount: termsCount,
			docCount: term.doc_freq,
			totalDocCount: DOC_COUNT,
			tf: 0,
			idf: 0,
			tfidf: 0
		}
		termObject[id].tf = termObject[id].termCount / termObject[id].docTermsCount
		termObject[id].idf = Math.log(DOC_COUNT / termObject[id].docCount)
		termObject[id].tfidf = termObject[id].tf * termObject[id].idf
		TermCollection.upsert({ _id: key }, termObject)
		return termObject[id].tfidf
	}

	createVector(id: string, vectorObj: any) {
		let vector = new Vector()
			vector._id = id
			vector.values = vectorObj
			VectorCollection.upsert({ _id: id }, vector)

		return vector
	}
}
import 'reflect-metadata'
import {Meteor} from 'meteor/meteor'
import {Mongo} from 'meteor/mongo'

export let TermCollection = new Mongo.Collection<Term>('terms')

export class Term {
	_id?: any
	name: any
}
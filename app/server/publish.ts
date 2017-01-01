import {Meteor} from 'meteor/meteor';
import {MeteorComponent} from 'angular2-meteor';
import {VectorCollection, Vector} from '../lib/collections/vector';
import {TermCollection, Term} from '../lib/collections/term';

if (Meteor.isServer) {
	Meteor.publish('vectors', () => {
		return VectorCollection.find()
	})

	VectorCollection.allow({
		insert: (userId, doc) => {
			return true
		},
		update: (userId, doc) => {
			return true
		}
	})

	Meteor.publish('terms', () => {
		return TermCollection.find()
	})

	TermCollection.allow({
		insert: (userId, doc) => {
			return true
		},
		update: (userId, doc) => {
			return true
		}
	})

	console.log(Meteor.settings)
}
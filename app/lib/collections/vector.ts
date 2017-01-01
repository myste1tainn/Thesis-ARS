import 'reflect-metadata'
import {Meteor} from 'meteor/meteor'
import {Mongo} from 'meteor/mongo'
import {Pipe, PipeTransform} from '@angular/core'
import {Term, TermCollection} from './term'

export let VectorCollection = new Mongo.Collection<Vector>('vectors')

export class Vector {
	_id?: any
	values: any
}
import 'reflect-metadata'
import { ApplicationRestful } from './svm.rest'
import { DB } from './collection/db'
import * as Express from 'express'

export function SVMServerRun() {
	let SVM_EXPRESS_SERVER = Express()
	console.log('log: bootstrapping SVM server...')

	let port = 3333
	SVM_EXPRESS_SERVER.listen(port)
	console.log(`log: SVM server is now listening on port ${port}`)

	ApplicationRestful.setup(SVM_EXPRESS_SERVER)
}
import 'reflect-metadata'
import { Request, Response } from 'express'
import { ApplicationRouter } from './routes'
import { ApplicationRestful } from './rest'
import { DB } from './collection/db'
import { SVMServerRun } from './svm.server'
import * as Express from 'express'

export let EXPRESS_SERVER = Express()
console.log('log: bootstrapping express server...')

EXPRESS_SERVER.use('/client', Express.static('client'))
EXPRESS_SERVER.use('/node_modules', Express.static('node_modules'))
EXPRESS_SERVER.use('/system', Express.static('system'))
EXPRESS_SERVER.use('/style', Express.static('style'))
EXPRESS_SERVER.use('/executable/client', Express.static('executable/client'))
EXPRESS_SERVER.use('/executable/shared', Express.static('executable/shared'))

let port = 3000
EXPRESS_SERVER.listen(port)
console.log(`log: APPLICATION server is now listening on port ${port}`)

ApplicationRouter.setup(EXPRESS_SERVER)
ApplicationRestful.setup(EXPRESS_SERVER)

SVMServerRun()
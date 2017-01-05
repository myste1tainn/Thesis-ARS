import 'reflect-metadata'
import { Request, Response } from 'express'
import { ApplicationRouter } from './routes'
import { ApplicationRestful } from './rest'
import { DB } from './collection/db'
import * as Express from 'express'

export let EXPRESS_SERVER = Express()
console.log('log: bootstrapping express server...')

EXPRESS_SERVER.use('/client', Express.static('client'))
EXPRESS_SERVER.use('/node_modules', Express.static('node_modules'))
EXPRESS_SERVER.use('/system', Express.static('system'))
EXPRESS_SERVER.use('/style', Express.static('style'))
EXPRESS_SERVER.use('/executable/client', Express.static('executable/client'))
EXPRESS_SERVER.use('/executable/shared', Express.static('executable/shared'))

EXPRESS_SERVER.listen(3000)
console.log('log: express server is now listening on port 3000')

ApplicationRouter.setup(EXPRESS_SERVER)
ApplicationRestful.setup(EXPRESS_SERVER)
import 'reflect-metadata'
import './controller/cron/AutoReplyCron'
import { Request, Response } from 'express'
import { ApplicationRouter } from './routes'
import { ApplicationRestful } from './rest'
import { SVMRestful } from './svm.rest'
import { DB } from './collection/db'
import * as Express from 'express'
import * as process from 'process'

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
SVMRestful.setup(EXPRESS_SERVER)

process.stdin.resume();//so the program will not close instantly

function exitHandler(options, err) {
    if (options.cleanup) console.log('clean');
    if (err) console.log(err.stack);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
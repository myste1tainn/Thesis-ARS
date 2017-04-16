import { Collection, Model } from './model'
import { Term } from './term'
import { Vector } from './vector'
import { Solution } from './solution'
import { TrainedModel } from './trained-model'
import { Message } from './message'
import { GmailInfo } from './gmail-info'

export let TermCollection = new Collection<Term>('terms')
export let VectorCollection = new Collection<Vector>('vectors')
export let SolutionCollection = new Collection<Solution>('solutions')
export let TrainedModelCollection = new Collection<TrainedModel>('trainedModels')
export let TrainData = new Collection<TrainedModel>('trainData')
export let MessageCollection = new Collection<Message>('messages')
export let GmailInfoCollection = new Collection<GmailInfo>('gmailInfo')
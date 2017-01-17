import { Collection, Model } from './model'
import { Term } from './term'
import { Vector } from './vector'
import { Solution } from './solution'
import { TrainedModel } from './trained-model'

export let TermCollection = new Collection<Term>('terms')
export let VectorCollection = new Collection<Vector>('vectors')
export let SolutionCollection = new Collection<Solution>('solutions')
export let TrainedModelCollection = new Collection<TrainedModel>('trainedModels')
export let TrainData = new Collection<TrainedModel>('trainData')
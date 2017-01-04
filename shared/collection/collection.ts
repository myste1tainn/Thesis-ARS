import { Collection, Model } from './model'
import { Term } from './term'
import { Vector } from './vector'
import { Solution } from './solution'

export let TermCollection = new Collection<Term>('terms')
export let VectorCollection = new Collection<Vector>('vectors')
export let SolutionCollection = new Collection<Term>('solutions')
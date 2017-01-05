import { config } from './classifier.config'
import { trainDataset } from './mock.train'
import { TrainedModelCollection } from '../../../shared/collection/collection'
import { TrainedModel } from '../../../shared/collection/trained-model'

let nodesvm = require('node-svm')
let SVM = nodesvm.SVM

export class SupportVectorMachine {
	classifier: any
	isTrained: boolean = false
	constructor() {
		this.classifier = new SVM(config)
	}

	restore(trainedModel: TrainedModel) {
		console.log('log: RESTORING classifier')
		this.classifier = nodesvm.restore(trainedModel)
		this.isTrained = true
	}

	train(dataSet: any) {
		console.log('log: TRAINING classifier')
		return this.classifier.train(dataSet)
		.progress((rate: any) => {
			
		})
		.spread((trainedModel: any, trainingReport: any) => {
			console.log('log: SAVING trained model')
			TrainedModelCollection.insert(trainedModel)
			// console.log('trainingReport', trainingReport)
		})
	}

	predict(dataSet: any[]) {
		console.log('log: PREDICTING dataset class')
		dataSet.forEach((item) => {
			var prediction = this.classifier.predictSync(item)
			console.log('%s predicted as => %d', item, prediction);
		})
	}
}
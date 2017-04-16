import { config } from './classifier.config'
import { TrainedModelCollection } from '../../../shared/collection/collection'
import { TrainedModel } from '../../../shared/collection/trained-model'
import { TrainDataset } from '../../../shared/collection/train-dataset'

let fs = require('fs')
let nodesvm = require('node-svm')
let SVM = nodesvm.SVM

export class SupportVectorMachine {
	classifier: any
	isTrained: boolean = false
	constructor(trainedModel?: TrainedModel) {
		if (!!trainedModel) {
			this.restore(trainedModel)
		} else {
			this.classifier = new SVM(config)
		}
	}

	restore(trainedModel: TrainedModel) {
		console.log('log: RESTORING classifier')
		this.classifier = nodesvm.restore(trainedModel)
		this.isTrained = true
	}

	train(dataset: TrainDataset[]) {
		console.log('log: cleaning-up TRAINING DATA')
		let trainingData: any[] = []
		for (var i = 0; i < dataset.length; i++) {
			trainingData[i] = dataset[i].data
		}
		console.log('log: TRAINING classifier')
		fs.writeFileSync('/Users/Myste1tainn/Desktop/training-data.json', JSON.stringify(trainingData))
		return this.classifier.train(trainingData)
		.progress((rate: any) => {
			console.log('log: training...', rate)
		})
		.spread((trainedModel: any, trainingReport: any) => {
			TrainedModelCollection.insert(trainedModel)
			fs.writeFileSync('/Users/Myste1tainn/Desktop/trained-model.json', JSON.stringify(trainedModel)+"\n")
			fs.appendFileSync('/Users/Myste1tainn/Desktop/training-report.json', JSON.stringify(trainingReport)+"\n")
		})
	}

	predict(data: any[]) {
		return this.classifier.predictSync(data)
	}

	eval(dataset: TrainDataset[]) {
		console.log(`log: prepare data for evaluation`)
		let testingData: any[] = []
		for (var i = 0; i < dataset.length; i++) {
			testingData[i] = dataset[i].data
			testingData[i][1] = Math.floor(Math.random() * 20)
		}

		let report = this.classifier.evaluate(testingData)
		fs.writeFileSync('/Users/Myste1tainn/Desktop/eval-report.json', JSON.stringify(report)+"\n")
		return report
	}
}

// let ml = require("machine_learning")
// let Path = require('path')
// let trainedModelPath = Path.resolve('./trained-model.json')

// export class SupportVectorMachine {
// 	classifier: any
// 	isTrained: boolean = false
// 	constructor(trainedModel?: TrainedModel) {
// 		try {
// 			trainedModel = fs.readFileSync(trainedModelPath, 'utf8')
// 		} catch (e) {
// 			trainedModel = null
// 		}

// 		if (!trainedModel) {
// 			trainedModel = typeof trainedModel == 'string' ? JSON.parse(trainedModel) : trainedModel
// 			this.restore(trainedModel)
// 		} else {
// 			console.log('log: CREATING new SVM')
// 		}
// 	}

// 	restore(trainedModel: TrainedModel) {
// 		console.log('log: RESTORING classifier')
// 		console.log(trainedModel)
// 		try {
// 			// this.classifier = SVM.load(trainedModel)
// 		} catch (e) {
// 			console.log('error: cannot restore classifier', e)
// 		}
// 		console.log(this.classifier)
// 		this.isTrained = true
// 	}


// 	static t = 0.001
// 	train(dataset: TrainDataset[]) {
// 		console.log('log: cleaning-up TRAINING DATA')
// 		let trainingData: any[] = []
// 		var labels: number[] = []

// 		console.log(dataset.length)
// 		for (var i = 0; i < dataset.length; i++) {
// 			trainingData[i] = dataset[i].data[0]
// 			labels[i] = dataset[i].data[1]

// 			for (var j = trainingData[i].length - 1; j >= 0; j--) {
// 				if (trainingData[i][j] == 0) {
// 					trainingData[i][j] += Math.random()
// 				}
// 			}
			
// 		}

// 		this.classifier = new ml.SVM({
// 			x: trainingData, 
// 			y: labels
// 		})

// 		fs.writeFileSync('/Users/Myste1tainn/Desktop/training-data.json', JSON.stringify(trainingData))

// 		this.classifier.train({
// 		    C : 1.0, // default : 1.0. C in SVM.
// 		    tol : 1e-5, // default : 1e-4. Higher tolerance --> Higher precision
// 		    max_passes : 20, // default : 20. Higher max_passes --> Higher precision
// 		    alpha_tol : 1e-5, // default : 1e-5. Higher alpha_tolerance --> Higher precision
// 		    kernel : { type: "polynomial", c: 1, d: 5}
// 		})
		
// 		// console.log(this.classifier)

// 		for (let key in this.classifier) {
// 			console.log(key)
// 		}

// 		console.log(trainingData[0].length)
// 	}

// 	predict(data: any[]) {
// 		console.log(`predict data: ${data}`.substring(0,100))
// 		let res = this.classifier.predict(data)
// 		console.log(`predict result: ${res}`.substring(0,100))
// 		return res
// 	}

// 	eval(dataset: TrainDataset[]) {
// 		console.log(`log: prepare data for evaluation`)
// 		let testingData: any[] = []
// 		for (var i = 0; i < dataset.length; i++) {
// 			testingData[i] = dataset[i].data
// 			testingData[i][1] = 50
// 		}

// 		let report = this.classifier.evaluate(testingData)
// 		// fs.appendFileSync('/Users/Myste1tainn/Desktop/eval-report.json', JSON.stringify(report)+"\n")
// 		return report
// 	}
// }
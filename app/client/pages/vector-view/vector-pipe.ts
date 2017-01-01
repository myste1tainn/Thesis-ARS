import {Pipe, PipeTransform} from '@angular/core'

@Pipe({name: 'toVectors'})
export class VectorToVectorPipe implements PipeTransform {
    transform(input, args:string[]) {
        console.log('piping', input)
        let vectors = []
        for (let documentID in input.raw) {
            let vector = {}
            for (let term in input.raw[documentID]) {
                let frequencies = input.raw[documentID][term]
                vector[term] = frequencies
            }
            let fn = keysrt('term')
            vectors.push({ id: documentID, vector: vector })
        }
        console.log(vectors)
        return []
    }
}

function srt(desc) {
  return function(a,b){
   return desc ? ~~(a < b) : ~~(a > b);
  };
}

// sort on key values
function keysrt(key,desc?: any): (a: any, b: any) => number {
  return function(a,b) {
   return desc ? ~~(a[key] < b[key]) : ~~(a[key] > b[key]);
  }
}
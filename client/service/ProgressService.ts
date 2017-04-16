import {Injectable} from '@angular/core'
import {Subject} from 'rxjs/Subject'

@Injectable()
export class ProgressService {
  progressEventObservable:Subject<any> = new Subject();
}
import {Page, NavController, AlertController, LoadingController} from 'ionic-angular';
import {MeteorComponent} from 'angular2-meteor';
import {Meteor} from 'meteor/meteor';
import {Http} from '@angular/http';
import {TranslateService, TranslatePipe} from 'ng2-translate/ng2-translate';
import {VectorViewPage} from '../../pages/vector-view/vector-view.page';

@Page({
    templateUrl: '/client/pages/control-panel/control-panel.page.html',
    pipes: [TranslatePipe]
})
export class ControlPanelPage extends MeteorComponent {
    private user: Meteor.User;

    constructor(private nav:NavController, 
                private translate:TranslateService,
                private alertController: AlertController,
                private loadingController: LoadingController,
                private http: Http) {
        super();
    }

    ngOnInit():void {
        
    }

    parseAndFeed():void {
    	this.http.get('api/v1/parse-and-feed')
    	.subscribe((res) => {
    		alert(res)
    	}, (error) => {
    		alert(error)
    	})
    }

    presentAlert(message?: string): void {
    	let alert = this.alertController.create({
            title: 'Done',
            message: !!message ? message : 'Parse & Feed finished successfully',
            buttons: [{text: this.translate.instant("general.ok")}]
        });
        alert.present();
    }

    pushVectorView() {
        console.log('Go to VectorViewPage')
        this.nav.push(VectorViewPage)
    }

    loading(msg: string) {
        let loadingView = this.loadingController.create({
            content: msg,
            duration: 60 * 1000
        })
        loadingView.present()
        return loadingView
    }

    svmTrain() {
        let loadingView = this.loading('Training...')
        this.http.get('api/v1/svm/train')
        .subscribe((res) => {
            loadingView.dismiss()
        }), (error) => {
            loadingView.dismiss()
        }
    }

    svmPredict() {
        let loadingView = this.loading('Predicting...')
        this.http.get('api/v1/svm/predict')
        .subscribe((res) => {
            loadingView.dismiss()
        }), (error) => {
            loadingView.dismiss()
        }
    }
}

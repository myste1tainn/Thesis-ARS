import {Page, NavController, AlertController} from 'ionic-angular';
import {MeteorComponent} from 'angular2-meteor';
import {Meteor} from 'meteor/meteor';
import {Http} from '@angular/http';
import {TranslateService, TranslatePipe} from 'ng2-translate/ng2-translate';
import {WelcomeHeaderComponent} from '../../components/welcome-header/welcome-header';
import {LanguageSelectComponent} from "../../components/language-select/language-select";
import {VectorViewPage} from '../../pages/vector-view/vector-view';

@Page({
    templateUrl: '/client/pages/control-panel/control-panel.html',
    pipes: [TranslatePipe],
    directives: [WelcomeHeaderComponent, LanguageSelectComponent] // !important! required to get custom component to show up
})
export class ControlPanelPage extends MeteorComponent {
    private user: Meteor.User;

    constructor(private nav:NavController, 
                private translate:TranslateService,
                private alertController: AlertController,
                private http: Http) {
        super();
    }

    ngOnInit():void {
        
    }

    start():void {
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
}

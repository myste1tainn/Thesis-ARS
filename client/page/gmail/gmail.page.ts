import {Http} from '@angular/http';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {Component} from '@angular/core';
import {Observable, Subject} from 'rxjs/Rx'

import 'rxjs/add/operator/map'

export let Route = { 
    path: '/gmail', 
    template: '/client/page/gmail/gmail.page.html'
}
@Component({
    templateUrl: Route.template,
})
export class GmailPage {
    userCode?: string
    accessToken: string
    authenURL: string
    messages: [any]
    error: string
    errorDetail: string

    constructor(private http: Http, private route: ActivatedRoute) {}
    ngOnInit():void {
        this.route.queryParams.subscribe((queryParams: Params) => {
            if (queryParams['code'] != null) {
                this.userCode = queryParams['code']
            }
        })
    }

    authorizeAccess() {
        this.http.get('/gmail-access')
        .map((res:any) => res.json())
        .subscribe((response:any) => {
            if (response.code != null) {
                this.userCode = response.code
            } else {
                this.authenURL = response.url
            }
        }, (error:any) => {
            this.error = error
        })
    }
    readMail() {
        this.error = null
        this.errorDetail = null
        this.messages = null
        this.accessToken = null

        this.http.get('/gmail-list')
        .map((res:any) => res.json())
        .subscribe((res) => {
            console.log(res)
            this.error = JSON.stringify(res.error)
            this.messages = res.response.messages
            this.userCode = res.code
            this.accessToken = res.token
        }, (error) => {
            this.error = error
            this.errorDetail = error._body

            let object = JSON.parse(error._body)
            this.userCode = object.code
            this.accessToken = object.token
        })
    }
    trySendEmail() {
        this.http.get('api/try-send-email')
        .map(res => res.json())
        .subscribe(res => {
            console.log(error)
        }, error => {
            console.log(error)
        })
    }

    markAsRead(messages) {
        if (messages.length > 0) {
            this.http.post('api/messages/mark-as-read', messages).subscribe(() => {
                this.messages = []
            }, error => {
                console.log(error)
            })
        }
    }
}

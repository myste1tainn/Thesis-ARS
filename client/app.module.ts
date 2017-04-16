import { NgModule }      from '@angular/core'
import { FormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { RouterModule } from '@angular/router'
import { HttpModule, BrowserXhr } from '@angular/http'
import { AppComponent }  from './component/app.component'
import { SpinnerComponent } from 'angular2-spinner'
import { HomePage }  from './page/home/home.page'
import { ControlPanelPage }  from './page/control-panel/control-panel.page'
import { VectorViewPage }  from './page/vector-view/vector-view.page'
import { GmailPage }  from './page/gmail/gmail.page'
import { PreProcessingPage }  from './page/pre-processing/pre-processing.page'
import { PullCorpusPage }  from './page/pre-processing/pull-corpus/pull-corpus.page'
import { CreateIndexPage }  from './page/pre-processing/create-index/create-index.page'
import { TrainSVMPage }  from './page/pre-processing/train-svm/train-svm.page'
import { PostProcessingPage }  from './page/post-processing/post-processing.page'
import { SetupPage }  from './page/setup/setup.page'
import { WelcomePage }  from './page/welcome/welcome.page'
import { TermVectorMatrixComponent }  from './component/term-vectors-matrix/term-vectors-matrix.component'
import { CustomBrowserXhr } from './service/CustomBroswerXhr'

@NgModule({
    imports:      [BrowserModule, HttpModule, FormsModule,
                    RouterModule.forRoot([{ 
                        path: '', component: HomePage,
                        children: [
                            { path: '', component: WelcomePage },
                            { path: 'pre-processing', component: PreProcessingPage,
                            children: [
                                { path: 'pull-corpus', component: PullCorpusPage },
                                { path: 'create-index', component: CreateIndexPage },
                                { path: 'train-svm', component: TrainSVMPage },
                            ] },
                            { path: 'post-processing', component: PostProcessingPage },
                            { path: 'setup', component: GmailPage },
                        ]
                    },
                    ])],
    declarations: [
        HomePage, ControlPanelPage, VectorViewPage, GmailPage, 
        PreProcessingPage, PullCorpusPage, CreateIndexPage, TrainSVMPage,
        PostProcessingPage, SetupPage, WelcomePage,
        AppComponent, TermVectorMatrixComponent, SpinnerComponent
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }

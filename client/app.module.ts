import { NgModule }      from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { RouterModule } from '@angular/router'
import { HttpModule } from '@angular/http'
import { AppComponent }  from './component/app.component'
import { SpinnerComponent } from 'angular2-spinner'
import { HomePage }  from './page/home/home.page'
import { ControlPanelPage }  from './page/control-panel/control-panel.page'
import { VectorViewPage }  from './page/vector-view/vector-view.page'
import { TermVectorMatrixComponent }  from './component/term-vectors-matrix/term-vectors-matrix.component'

@NgModule({
  imports:      [BrowserModule,
  				 HttpModule,
  				 RouterModule.forRoot([{ path: '', component: HomePage },
  				                       { path: 'control-panel', component: ControlPanelPage },
  				                       { path: 'vector-view', component: VectorViewPage } 
  				                       ])],
  declarations: [AppComponent, HomePage, ControlPanelPage, VectorViewPage, TermVectorMatrixComponent, SpinnerComponent],
  bootstrap:    [AppComponent],
})
export class AppModule { }

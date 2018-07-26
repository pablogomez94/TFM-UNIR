import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import{routing,appRoutingProviders} from './app.routing';
import{HttpModule} from '@angular/http';
import{FormsModule} from '@angular/forms';
import { MyNewComponentComponent } from './my-new-component/my-new-component.component';
import { LoginComponent } from './login/login.component';
import { FicharComponent } from './fichar/fichar.component';
import { AgmCoreModule } from '@agm/core';
import { HistoricoComponent } from './historico/historico.component';
import { MyDatePickerModule, MyDatePicker } from 'mydatepicker';
import { HistoricoUserComponent } from './historico-user/historico-user.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { HorariosComponent } from './horarios/horarios.component';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { MapComponent } from './map/map.component'; // this line you need


@NgModule({
  declarations: [
    AppComponent,
    MyNewComponentComponent,
    LoginComponent,
    FicharComponent,
    HistoricoComponent,
    HistoricoUserComponent,
    UsuariosComponent,
    HorariosComponent,
    MapComponent,
    
  ],
  imports: [
    MyDatePickerModule,
    AmazingTimePickerModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey:'AIzaSyBFkgQgs9hf4sM3PdpjoLRujBzqNq8YMo4'
    }),
    routing
  ],
  providers: [appRoutingProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }

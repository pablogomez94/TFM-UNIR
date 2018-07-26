import {ModuleWithProviders} from '@angular/core';
import {Routes,RouterModule} from '@angular/router';
import { MyNewComponentComponent } from './my-new-component/my-new-component.component';
import {LoginComponent} from './login/login.component';
import {FicharComponent} from './fichar/fichar.component';
import{HistoricoComponent} from './historico/historico.component';
import { HistoricoUserComponent } from './historico-user/historico-user.component';
import{UsuariosComponent} from './usuarios/usuarios.component';
import{HorariosComponent} from './horarios/horarios.component';


const appRoutes: Routes =[
    {path:'horarios',component:HorariosComponent},
    {path:'usuarios',component:UsuariosComponent},
    {path:'historicoUser',component:HistoricoUserComponent},
    {path:'historico',component:HistoricoComponent},
    {path:'fichar',component:FicharComponent},
    {path:'**',component:LoginComponent}
];

//exportar
export const appRoutingProviders: any[]=[];
export const routing: ModuleWithProviders=RouterModule.forRoot(appRoutes);
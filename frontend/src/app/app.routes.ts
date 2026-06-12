import { Routes } from '@angular/router';
import { Machines } from './components/machines/machines';

export const routes: Routes = [
    { path: '', component: Machines },
    { path: 'machines', component: Machines }
];


import { Routes } from '@angular/router';
import { ItemsComponent } from './components/items/items.component';

export const routes: Routes = [
    { path: '', component: ItemsComponent },
    { path: 'items', component: ItemsComponent }
];

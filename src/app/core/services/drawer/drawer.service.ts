import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DrawerService {

  isDrawerOpen: EventEmitter<boolean> = new EventEmitter();

  setDrawer(visibleSidebar: boolean) {
    this.isDrawerOpen.emit(visibleSidebar);
  }

  getDrawerEmitter(): Observable<boolean> {
    return this.isDrawerOpen;
  }

  constructor() { }
}

import { Injectable } from '@angular/core';

declare const window: any;

@Injectable({
  providedIn: 'root',
})
export class ElectronService {
  private shell = window.require ? window.require('electron').shell : null;

  openExternalLink(url: string): void {
    if (this.shell) {
      this.shell.openExternal(url);
    } else {
      window.open(url, '_blank'); // Fallback for non-Electron environments
    }
  }
}
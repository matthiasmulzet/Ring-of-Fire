import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-share-game',
  templateUrl: './share-game.component.html',
  styleUrls: ['./share-game.component.scss']
})
export class ShareGameComponent {

  actualURL: string = window.location.href;


  constructor(public dialogRef: MatDialogRef<ShareGameComponent>, public router: Router) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  copyURL() {
    navigator.clipboard.writeText(this.actualURL);
  }
}







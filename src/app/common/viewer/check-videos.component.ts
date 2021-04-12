import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-check-videos',
  templateUrl: './check-videos.component.html',
  styleUrls: ['./check-videos.component.css']
})
export class CheckVideosComponent {
  url1: string;
  url2: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.url1 = data.url1;
    this.url2 = data.url2;
  }

}

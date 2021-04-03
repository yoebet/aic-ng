import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: []
})
export class ImageViewerComponent {
  url: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.url = data.url;
  }

}

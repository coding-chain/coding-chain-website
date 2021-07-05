import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {ImageCroppedEvent} from 'ngx-image-cropper';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';


@Component({
  selector: 'app-image-edit',
  templateUrl: './image-edit.component.html'
})
export class ImageEditComponent implements OnInit {

  constructor(public modalRef: MatDialogRef<ImageEditComponent>, @Inject(MAT_DIALOG_DATA) public data: ImageEditComponent) {
    this.file = data.file;
  }

  onEditionEnded = new EventEmitter<boolean>();
  file: File;
  croppedImage = '';

  ngOnInit(): void {
  }

  imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.base64;
  }

  imageLoaded(): void {

  }

  closeModal(isValidated: boolean): void {
    this.modalRef.close();
    this.onEditionEnded.emit(isValidated);
  }


}

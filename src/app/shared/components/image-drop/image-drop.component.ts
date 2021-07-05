import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ImageEditComponent} from '../image-edit/image-edit.component';
import {FileSystemFileEntry, NgxFileDropEntry} from 'ngx-file-drop';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {FileUtils} from '../../utils/file.utils';
import {Orientation} from '../../types/orientation';

@Component({
  selector: 'app-image-drop',
  templateUrl: './image-drop.component.html',
  styles: []
})
export class ImageDropComponent implements OnInit {

  editComponent: ImageEditComponent;
  modalRef: MatDialogRef<ImageEditComponent>;
  canSavePicture = false;
  private _file: string | ArrayBuffer;

  @Input() importLabel = 'Glissez votre image';
  @Input() hideSaveButton = false;
  @Input() orientation: Orientation = 'HORIZONTAL';

  @Input()
  set file(file: string | File | ArrayBuffer) {
    if (file instanceof File) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        this._file = fileReader.result;
        this.pictureLoaded.emit(this.picture);
      };
    } else {
      this._file = file;
    }
  }

  get picture(): string {
    if (this._file instanceof ArrayBuffer) {
      return FileUtils.bufferArrayToString(this._file);
    }
    return this._file;
  }


  @Output()
  pictureChanged = new EventEmitter<File>();

  @Output()
  pictureLoaded = new EventEmitter<string>();

  @Output()
  pictureSaved = new EventEmitter<any>();

  @Output()
  pictureRemoved = new EventEmitter<any>();

  private fileEntry: FileSystemFileEntry;

  get canDelete(): boolean {
    return this._file != null;
  }

  constructor(private modalService: MatDialog) {
  }

  ngOnInit(): void {
  }

  dropped(files: NgxFileDropEntry[]): void {
    this.fileEntry = files[0].fileEntry as FileSystemFileEntry;
    this.fileEntry.file(file => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        this._file = fileReader.result;
        this.showEditWindow();
      };
    });
  }

  onPictureEdited(): void {
    this.file = this.editComponent.croppedImage;
    this.pictureChanged.emit(FileUtils.base64ToFile(this.picture, 'file'));
  }

  showEditWindow(): void {

    this.modalRef = this.modalService.open<ImageEditComponent>(ImageEditComponent, {
      data: {
        file: this._file
      }, width: '1000px', height: '600px'
    });
    this.editComponent = this.modalRef.componentInstance;
    this.editComponent.onEditionEnded.subscribe(isValidated => {
      if (isValidated) {
        this.canSavePicture = true;
        this.onPictureEdited();
      }
    });
  }

  editPicture(): void {
    this.showEditWindow();
  }

  savePicture(): void {
    this.pictureSaved.emit();
  }

  get canEdit(): boolean {
    return !this._file;
  }

  reset(): void {
    this.pictureRemoved.emit();
    this.file = null;
  }
}

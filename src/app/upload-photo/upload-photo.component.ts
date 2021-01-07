import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AppResponse } from '../model/AppResponse';
import { Photo } from '../model/Photo';
import { UploadFilesService } from '../services/upload-files.service';

@Component({
  selector: 'app-upload-photo',
  templateUrl: './upload-photo.component.html',
  styleUrls: ['./upload-photo.component.css']
})
export class UploadPhotoComponent implements OnInit {
  selectedFiles: FileList;
  progressInfos = [];
  message = '';

  fileInfos: any;
  photos:Photo[];
  retrievedImages = [];
  

  constructor(private uploadService: UploadFilesService) { }

  ngOnInit(): void {
   this.getPhoto();
  }

  selectFiles(event): void {
    this.progressInfos = [];
  
    const files = event.target.files;
    let isImage = true;
  
    for (let i = 0; i < files.length; i++) {
      if (files.item(i).type.match('image.*')) {
        continue;
      } else {
        isImage = false;
        alert('invalid format!');
        break;
      }
    }
  
    if (isImage) {
      this.selectedFiles = event.target.files;
    } else {
      this.selectedFiles = undefined;
      event.srcElement.percentage = null;
    }
  }

  uploadFiles(): void {
    this.message = '';
  
    for (let i = 0; i < this.selectedFiles.length; i++) {
      this.upload(i, this.selectedFiles[i]);
    }
  }

  upload(idx, file): void {
    this.progressInfos[idx] = { value: 0, fileName: file.name };
  
    this.uploadService.upload(file).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progressInfos[idx].percentage = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          //this.fileInfos = this.uploadService.getFiles();
          this.getPhoto();
        }
      },
      err => {
        this.progressInfos[idx].percentage = 0;
        this.message = 'Could not upload the file:' + file.name;
      });
  }

  getPhoto(){
    this.uploadService.getFiles()
      .then((res)=>{
        debugger
        this.photos = res;
        console.log(this.photos)
        this.getRealPhoto(this.photos)
      
      }, error =>{
        console.log(error);
      })
  }

  getRealPhoto(photos:Photo[]){
    debugger
    for(let i=0; i<photos.length; i++){
      this.retrievedImages.push('data:image/jpeg;base64,'+this.photos[i].img)

    }
    console.log('photo befor treatment==>',this.photos);
    console.log('treatedImage==>',this.retrievedImages);
    return this.retrievedImages;
      
  }

  
}

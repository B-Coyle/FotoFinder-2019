class Photo {
  constructor(id, title, caption, file, favorite) {
    this.id = id;
    this.title = title;
    this.caption = caption;
    this.file = file;
    this.favorite = favorite;
  }

  saveToStorage() {
    var stringifiedPhotos = JSON.stringify(photos);
    localStorage.setItem('photos', stringifiedPhotos);
  }

  deleteFromStorage() {
    var i = photos.indexOf(this); 
    photos.splice(i, 1);
    var stringifiedPhotos = JSON.stringify(photos);
    localStorage.setItem('photos', stringifiedPhotos);
  }

  updatePhoto() {
    var index = photos.indexOf(this);
    photos.splice(index, 1, this);
  }
}
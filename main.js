var photos = JSON.parse(localStorage.getItem('photos')) || [];
var searchBar = document.querySelector('#search-bar');
var title = document.querySelector('#title-input');
var caption = document.querySelector('#caption-textarea');
var chooseFile = document.querySelector('#choose-file');
var createPhoto = document.querySelector('.add-photos');
const card = document.querySelector('.photo-card');
var filterFavorite = document.querySelector('.filter-photo');
var photoContainer = document.querySelector('.output-photo');
var reader = new FileReader(); 
var favCounter = 0;


filterFavorite.addEventListener('click', toggleFavoriteButton);
searchBar.addEventListener('keyup', searchCards);
createPhoto.addEventListener('click', loadPhoto);
photoContainer.addEventListener('click', clickEventHandler);
photoContainer.addEventListener('focusout', editCard);

onPageLoad(photos);

function onPageLoad(parsedPhotos) {
  photos = [];
  parsedPhotos.forEach(function(photo) {
    var restoredPhoto = new Photo(photo.id, photo.title, photo.caption, photo.file, photo.favorite);
    photos.push(restoredPhoto);
    photoCardTemplate(restoredPhoto);
    reflectFavoriteCardsNumber();
  });
}

function clickEventHandler(e, photo) {
  if(e.target.id === 'delete') {
    deletePhotos(e);
  } 
  if (e.target.classList.contains('favorite-svg')) {
    toggleFavoritePhoto(e);
  }
}

function makePhoto(e) {
  e.preventDefault();
  if(title.value === '' || caption.value === '') {
    alert('Please enter a title and caption for your photo.')
  } else {
    var newPhoto = new Photo(Date.now(), title.value, caption.value, e.target.result, false);
    photos.push(newPhoto)
    newPhoto.saveToStorage(photos);
    photoCardTemplate(newPhoto);
    title.value = '';
    caption.value = '';
  }
}

function loadPhoto(e) {
  e.preventDefault();
  if(chooseFile.files[0]) {
    reader.readAsDataURL(chooseFile.files[0]);
    reader.onload = makePhoto;
  }
}

function photoCardTemplate(photo) {
 var displayPhoto = `<article class="photo-card" data-index=${photo.id}>
      <h2 class="photo-title" contentEditable="true">${photo.title}</h2> 
      <figure class="photo-place">
        <img src="${photo.file}" width="100%" class="user-image" id="imagery">
        <figcaption class="photo-caption" contentEditable="true">
          ${photo.caption}
        </figcaption>
      </figure> 
      <section class="card-buttons">
        <button><img src="fotofinder-assets/delete.svg" class="delete-svg" id="delete" alt="image of a trash icon used to delete a card"></button>
        <button class="favorite-button favorite-svg" alt="when favorited by user, heart image changes color to pink"></button>
      </section>
    </article>`;
  photoContainer.insertAdjacentHTML("afterbegin", displayPhoto);
  keepFavoriteStatus(photo);
  emptyAlertMessage();
}

function editCard(e) {
  var newValue = e.target.textContent;
  var targetPhoto = findCorrectPhoto(e);
  if(e.target.className === "photo-title") {
    targetPhoto.title = newValue;
  } 
  if (e.target.className === "photo-caption") {
    targetPhoto.caption = newValue;
  }
  targetPhoto.updatePhoto();
  targetPhoto.saveToStorage(photos);
};

function findCorrectPhoto(e) {
 var photo = e.target.closest('.photo-card');
 var dataIndex = parseInt(photo.getAttribute('data-index'));
  return photos.find( (photo) =>  {
     return photo.id === dataIndex;
  });
};

function deletePhotos(e) {
  e.target.closest('.photo-card').remove();
  var photoToRemove = findCorrectPhoto(e);
  photoToRemove.deleteFromStorage();
  if (photoContainer.childNodes.length <= 3){
    displayAlertMessage();
    favCounter = 0;
    filterFavorite.value = 'View Favorites';
  }
}

function toggleFavoritePhoto(e) {
  var photoToFavorite = findCorrectPhoto(e);
  if(photoToFavorite.favorite === false) {
    photoToFavorite.favorite = true;
    e.target.classList.add('favorite-active-svg');
    favCounter++;
    filterFavorite.value = 'View ' + favCounter + ' Favorites';
  } else {
    photoToFavorite.favorite = false;
    e.target.classList.remove('favorite-active-svg');
    favCounter--;
    filterFavorite.value = 'View ' + favCounter + ' Favorites';
  }
  photoToFavorite.saveToStorage();
}

function keepFavoriteStatus(photo) {
    if(photo.favorite === true) {
      var matchingCard = document.querySelector(`[data-index="${photo.id}"]`);
      var favIcon = matchingCard.querySelector('.favorite-svg');
      favIcon.classList.add('favorite-active-svg');
    }
}

function searchCards(e){
  var searchBarText = e.target.value;
  var regex = new RegExp(searchBarText, 'i');
  var matchingPhotos = [];
  clearCards();
  for (let i = 0; i < photos.length; i++) {
    if(regex.test(photos[i].title) || regex.test(photos[i].caption)) {
      matchingPhotos.push(photos[i]);
      photoCardTemplate(photos[i]);
    }
  }
};

function clearCards() {
  var photosToDelete = photoContainer.querySelectorAll('.photo-card');
  photosToDelete.forEach(function(photo) {
    photo.remove();
  });
}

function reflectFavoriteCardsNumber() {
    var favoriteButton = document.querySelector('.favorite-button');
    if(favoriteButton.classList.contains('favorite-active-svg')) {
    favCounter++;
    filterFavorite.value = 'View ' + favCounter + ' Favorites';
  }
}

function toggleFavoriteButton(e){
  e.preventDefault();
  if(filterFavorite.value !== 'Show All Photos') {
    displayFavoriteCards();
  } else if (filterFavorite.value === 'Show All Photos') {
    displayAllCards();
  }
}
function displayAllCards() {
  var allPhotos = [];
  clearCards();
  for (var i = 0; i < photos.length; i++) {
        allPhotos.push(photos[i]);
        photoCardTemplate(photos[i]); 
  } 
  filterFavorite.value = 'View ' + favCounter + ' Favorites';
}

function displayFavoriteCards() {
  var favPhotos = [];
  clearCards();
  for (var i = 0; i < photos.length; i++) {
    if(photos[i].favorite === true) {
      favPhotos.push(photos[i]);
      photoCardTemplate(photos[i]); 
    }
  } 
  filterFavorite.value = 'Show All Photos';
}

function emptyAlertMessage() {
  var displayMessage = document.querySelector('.alert');
  displayMessage.classList.add('remove');
}

function displayAlertMessage() {
  var displayMessage = document.querySelector('.alert');
  displayMessage.classList.remove('remove');
}

// ~~~~~~~
// showMoreBtn.addEventListener('click', showMoreLess);

// function showMoreLess() {
//   if(showMoreBtn.innerText === 'Show More') {
//     makePhotos();
//     showMoreBtn.innerText === 'Show Less';
//   } else if (showMoreBtn.innerText === 'Show Less'){
//     clearDOM(10);
//     showMoreBtn.innerText = 'Show More';
//   }
// }

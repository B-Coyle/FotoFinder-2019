var photos = JSON.parse(localStorage.getItem("photos")) || [];
var searchBar = document.querySelector("#search-bar");
var chooseFile = document.querySelector("#choose-file");
var createPhoto = document.querySelector(".add-photos");
const card = document.querySelector(".photo-card");
var photoContainer = document.querySelector(".output-photo");
var filterFavorite = document.querySelector(".filter-photo");
var reader = new FileReader();
var favCounter = 0;

searchBar.addEventListener("keyup", searchCards);
createPhoto.addEventListener("click", loadPhoto);
photoContainer.addEventListener("click", clickEventHandler);
photoContainer.addEventListener("focusout", editCard);
filterFavorite.addEventListener("click", toggleFavoriteButton);

onPageLoad(photos);

function onPageLoad(parsedPhotos) {
  photos = [];
  parsedPhotos.forEach(function(photo) {
    var restoredPhoto = new Photo(photo.id, photo.title, photo.caption, photo.file, photo.favorite);
    photos.push(restoredPhoto);
    appendPhoto(restoredPhoto);
    reflectFavoriteCardsNumber();
  });
}

function clickEventHandler(e, photo) {
  if (e.target.id === "delete") {
    deletePhotos(e);
  } 
  if (e.target.classList.contains("favorite-svg")) {
    toggleFavoritePhoto(e);
  }
}

function makePhoto(e) {
  e.preventDefault();
  var title = document.querySelector("#title-input");
  var caption = document.querySelector("#caption-textarea");
  if (title.value === "" || caption.value === "") {
    alert("Please enter a title and caption for your photo.")
  } else {
    var newPhoto = new Photo(Date.now(), title.value, caption.value, e.target.result, false);
    photos.push(newPhoto)
    newPhoto.saveToStorage(photos);
    appendPhoto(newPhoto);
    title.value = "";
    caption.value = "";
  }
}

function appendPhoto(photo) {
 var displayPhoto = `<article class="photo-card" data-index=${photo.id}>
      <h2 class="photo-title" contentEditable="true">${photo.title}</h2> 
      <figure class="photo-place">
        <img src="${photo.file}" width="100%" class="image" id="imagery">
        <figcaption class="photo-caption" contentEditable="true">
          ${photo.caption}
        </figcaption>
      </figure> 
      <section class="card-buttons">
        <button><img src="fotofinder-assets/delete.svg" class="delete-svg" id="delete" alt="gray trash icon used to delete photo card"></button>
        <button class="favorite-button favorite-svg" alt="gray heart icon that changes red when clicked and functions to favorite a photo"></button>
      </section>
    </article>`;
  photoContainer.insertAdjacentHTML("afterbegin", displayPhoto);
  keepFavoriteStatus(photo);
  emptyFooterMessage();
}

function loadPhoto(e) {
  e.preventDefault();
  if (chooseFile.files[0]) {
    reader.readAsDataURL(chooseFile.files[0]);
    reader.onload = makePhoto;
  }
}

function editCard(e) {
  var newValue = e.target.textContent;
  var targetPhoto = findPhoto(e);
  if (e.target.className === "photo-title") {
    targetPhoto.title = newValue;
  } 
  if (e.target.className === "photo-caption") {
    targetPhoto.caption = newValue;
  }
  targetPhoto.updatePhoto();
  targetPhoto.saveToStorage(photos);
};

function findPhoto(e) {
 var photo = e.target.closest(".photo-card");
 var dataIndex = parseInt(photo.getAttribute("data-index"));
  return photos.find( (photo) =>  {
     return photo.id === dataIndex;
  });
};

function deletePhotos(e) {
  e.target.closest(".photo-card").remove();
  var photoToRemove = findPhoto(e);
  photoToRemove.deleteFromStorage();
  if (photoContainer.childNodes.length <= 3){
    displayFooterMessage();
    favCounter = 0;
    filterFavorite.value = "View Favorites";
  }
}

function toggleFavoritePhoto(e) {
  var photoToFavorite = findPhoto(e);
  if (photoToFavorite.favorite === false) {
    photoToFavorite.favorite = true;
    e.target.classList.add("favorite-active-svg");
    favCounter++;
    filterFavorite.value = "View " + favCounter + " Favorites";
  } else {
    photoToFavorite.favorite = false;
    e.target.classList.remove("favorite-active-svg");
    favCounter--;
    filterFavorite.value = "View " + favCounter + " Favorites";
  }
  photoToFavorite.saveToStorage();
}

function keepFavoriteStatus(photo) {
    if (photo.favorite === true) {
      var matchingCard = document.querySelector(`[data-index="${photo.id}"]`);
      var favIcon = matchingCard.querySelector(".favorite-svg");
      favIcon.classList.add("favorite-active-svg");
    }
}

function searchCards(e){
  var searchBarText = e.target.value;
  var regex = new RegExp(searchBarText, "i");
  var matchingPhotos = [];
  clearCards();
  for (let i = 0; i < photos.length; i++) {
    if (regex.test(photos[i].title) || regex.test(photos[i].caption)) {
      matchingPhotos.push(photos[i]);
      appendPhoto(photos[i]);
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
    var favoriteButton = document.querySelector(".favorite-button");
    if (favoriteButton.classList.contains("favorite-active-svg")) {
    favCounter++;
    filterFavorite.value = "View " + favCounter + " Favorites";
  }
}

function toggleFavoriteButton(e){
  e.preventDefault();
  if (filterFavorite.value !== "Show All Photos") {
    displayFavoriteCards();
  } else if (filterFavorite.value === "Show All Photos") {
    displayAllCards();
  }
}
function displayAllCards() {
  var allPhotos = [];
  clearCards();
  for (var i = 0; i < photos.length; i++) {
        allPhotos.push(photos[i]);
        appendPhoto(photos[i]); 
  } 
  filterFavorite.value = "View " + favCounter + " Favorites";
}

function displayFavoriteCards() {
  var favPhotos = [];
  clearCards();
  for (var i = 0; i < photos.length; i++) {
    if (photos[i].favorite === true) {
      favPhotos.push(photos[i]);
      appendPhoto(photos[i]); 
    }
  } 
  filterFavorite.value = "Show All Photos";
}

function emptyFooterMessage() {
  var displayMessage = document.querySelector(".alert");
  displayMessage.classList.add("remove");
}

function displayFooterMessage() {
  var displayMessage = document.querySelector(".alert");
  displayMessage.classList.remove("remove");
}

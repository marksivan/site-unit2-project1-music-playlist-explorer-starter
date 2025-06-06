fetch('data/data.json').then((response) => response.json()).then((data) => {
   createPlaylistCards(data);
});

function createPlaylistCards(playlists) {
   const container = document.querySelector('.playlist-container');

   playlists.forEach((playlist) => {
     const card = document.createElement('div');
     card.classList.add('playlist-card');

     const img = document.createElement('img');
     img.src = playlist.playlist_art;
     img.alt = playlist.playlist_name;

     const title = document.createElement('h3');
     title.textContent = playlist.playlist_name;

     const author = document.createElement('p');
     author.textContent = playlist.playlist_author;

     card.appendChild(img);
     card.appendChild(title);
     card.appendChild(author);

     const likeContainer = document.createElement('div');
     likeContainer.classList.add('like-container');

     const heartIcon = document.createElement('span');
     heartIcon.classList.add('heart-icon');
     heartIcon.innerHTML = '&#9825;';

     const likeCount = document.createElement('span');
     likeCount.classList.add('like-count');
     likeCount.textContent = playlist.likes || 0;

     likeContainer.appendChild(heartIcon);
     likeContainer.appendChild(likeCount);
     card.appendChild(likeContainer);

     let liked = false;
     heartIcon.addEventListener('click', (event) => {
      event.stopPropagation(); // Prevent triggering the card click event
      if(!liked){
         liked = true;
         heartIcon.innerHTML = '❤️';
         playlist.likes = (playlist.likes || 0) + 1;
      }else{
         liked = false;
         heartIcon.innerHTML = '&#9825;';
         playlist.likes = (playlist.likes || 0) - 1;
      }
      likeCount.textContent = playlist.likes;
     });
     container.appendChild(card);

     card.addEventListener('click', () => {
       document.querySelector('.modal-overlay').style.display = 'block';

       const modalContent = document.querySelector('.modal-cards');
       modalContent.innerHTML = playlist.songs.map((song, index) => `
         <div class="modal-card" id="modal-card-${index}">
           <div class="song-image">
             <img src="assets/img/song.png" alt="">
           </div>
           <div class="song-info">
             ${song.title || 'Unknown Title'}<br>
             ${song.artist || 'Unknown Artist'}<br>
             ${song.duration || '0:00'}
           </div>
         </div>
       `).join('');

       document.querySelector('.modal-title').innerHTML = `
         <img src="${playlist.playlist_art}" alt="">
         <div class="playlist-info">
           <b>${playlist.playlist_name}<br></b>
           <i>${playlist.playlist_author}</i>
         </div>
       `;
     });

     container.appendChild(card);
   });
 }

 // Modal close behavior
 document.querySelector('.close').addEventListener('click', function () {
   document.querySelector('.modal-overlay').style.display = 'none';
 });

 window.addEventListener('click', function (event) {
   if (event.target.classList.contains('modal-overlay')) {
     document.querySelector('.modal-overlay').style.display = 'none';
   }
 });

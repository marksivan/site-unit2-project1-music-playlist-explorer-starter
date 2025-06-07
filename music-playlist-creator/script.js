// Store playlists globally so we can add to them
let allPlaylists = [];

// Load playlists from data.json
fetch('data/data.json').then((response) => response.json()).then((data) => {
   allPlaylists = data;
   createPlaylistCards(allPlaylists);
});

// Playlist form modal functionality
document.getElementById('add-playlist-btn').addEventListener('click', () => {
  openPlaylistForm();
});

document.querySelector('.close-playlist-form').addEventListener('click', () => {
  closePlaylistForm();
});

document.getElementById('cancel-playlist-btn').addEventListener('click', () => {
  closePlaylistForm();
});

// Close modal when clicking outside
window.addEventListener('click', (event) => {
  if (event.target.classList.contains('playlist-form-modal-overlay')) {
    closePlaylistForm();
  }
});

// Add song button functionality
document.getElementById('add-song-btn').addEventListener('click', () => {
  addSongInput();
});

// Handle form submission
document.getElementById('playlist-form').addEventListener('submit', (event) => {
  event.preventDefault();
  savePlaylist();
});

// Function to open the playlist form for creating a new playlist
function openPlaylistForm(playlistToEdit = null) {
  const formTitle = document.getElementById('playlist-form-title');
  const form = document.getElementById('playlist-form');
  const songsContainer = document.getElementById('songs-container');

  // Reset form
  form.reset();
  document.getElementById('playlist-id').value = '';
  songsContainer.innerHTML = '';

  if (playlistToEdit) {
    // Edit mode
    formTitle.textContent = 'Edit Playlist';
    document.getElementById('playlist-id').value = playlistToEdit.playlistID;
    document.getElementById('playlist-name').value = playlistToEdit.playlist_name;
    document.getElementById('playlist-author').value = playlistToEdit.playlist_author;
    document.getElementById('playlist-image').value = playlistToEdit.playlist_art;

    // Add song inputs for each song
    playlistToEdit.songs.forEach(song => {
      const songInput = createSongInput();
      songInput.querySelector('.song-title').value = song.title;
      songInput.querySelector('.song-artist').value = song.artist;
      songInput.querySelector('.song-duration').value = song.duration;
      songsContainer.appendChild(songInput);
    });
  } else {
    // Create mode
    formTitle.textContent = 'Create New Playlist';
    // Add one empty song input
    songsContainer.appendChild(createSongInput());
  }

  document.querySelector('.playlist-form-modal-overlay').style.display = 'block';
}

// Function to close the playlist form
function closePlaylistForm() {
  document.querySelector('.playlist-form-modal-overlay').style.display = 'none';
}

// Function to create a song input row
function createSongInput() {
  const songInput = document.createElement('div');
  songInput.classList.add('song-input');

  songInput.innerHTML = `
    <input type="text" class="song-title" placeholder="Song Title" required>
    <input type="text" class="song-artist" placeholder="Artist" required>
    <input type="text" class="song-duration" placeholder="Duration (e.g. 3:45)" required>
    <button type="button" class="remove-song">✕</button>
  `;

  // Add event listener to remove button
  songInput.querySelector('.remove-song').addEventListener('click', function() {
    // Only remove if there's more than one song input
    const songInputs = document.querySelectorAll('.song-input');
    if (songInputs.length > 1) {
      this.parentElement.remove();
    } else {
      alert('Playlist must have at least one song');
    }
  });

  return songInput;
}

// Function to add a new song input
function addSongInput() {
  const songsContainer = document.getElementById('songs-container');
  songsContainer.appendChild(createSongInput());
}

// Function to save the playlist (create new or update existing)
function savePlaylist() {
  const playlistId = document.getElementById('playlist-id').value;
  const playlistName = document.getElementById('playlist-name').value;
  const playlistAuthor = document.getElementById('playlist-author').value;
  const playlistImage = document.getElementById('playlist-image').value || 'assets/img/playlist.png';

  // Get all songs
  const songInputs = document.querySelectorAll('.song-input');
  const songs = Array.from(songInputs).map(songInput => {
    return {
      title: songInput.querySelector('.song-title').value,
      artist: songInput.querySelector('.song-artist').value,
      duration: songInput.querySelector('.song-duration').value
    };
  });

  if (playlistId) {
    // Update existing playlist - convert playlistId to number for comparison
    const playlistIdNum = parseInt(playlistId, 10);
    const index = allPlaylists.findIndex(p => p.playlistID === playlistIdNum);

    if (index !== -1) {
      allPlaylists[index].playlist_name = playlistName;
      allPlaylists[index].playlist_author = playlistAuthor;
      allPlaylists[index].playlist_art = playlistImage;
      allPlaylists[index].songs = songs;
      console.log('Updated playlist:', allPlaylists[index]);
    } else {
      console.error('Playlist not found for ID:', playlistId);
    }
  } else {
    // Create new playlist
    const newPlaylist = {
      playlistID: Date.now(), // Use timestamp as unique ID
      playlist_name: playlistName,
      playlist_author: playlistAuthor,
      playlist_art: playlistImage,
      likes: 0,
      songs: songs
    };

    allPlaylists.push(newPlaylist);
    console.log('Created new playlist:', newPlaylist);
  }

  // Refresh the playlist cards
  const container = document.querySelector('.playlist-container');
  container.innerHTML = '';
  createPlaylistCards(allPlaylists);

  // Close the form
  closePlaylistForm();
}

// Function to delete a playlist
function deletePlaylist(playlistId) {
  if (confirm('Are you sure you want to delete this playlist?')) {
    // Convert playlistId to number for comparison if it's a number in data.json
    const playlistIdNum = typeof playlistId === 'string' ? parseInt(playlistId, 10) : playlistId;

    const index = allPlaylists.findIndex(p => {
      // Handle both string and number comparisons
      return p.playlistID === playlistIdNum || p.playlistID === playlistId;
    });

    if (index !== -1) {
      console.log('Deleting playlist:', allPlaylists[index]);
      allPlaylists.splice(index, 1);

      // Refresh the playlist cards
      const container = document.querySelector('.playlist-container');
      container.innerHTML = '';
      createPlaylistCards(allPlaylists);
    } else {
      console.error('Playlist not found for deletion. ID:', playlistId);
    }
  }
}

function createPlaylistCards(playlists) {
   const container = document.querySelector('.playlist-container');
   container.innerHTML = ''; // Clear existing cards

   playlists.forEach((playlist) => {
     const card = document.createElement('div');
     card.classList.add('playlist-card');

     const img = document.createElement('img');
     img.src = playlist.playlist_art;
     img.alt = playlist.playlist_name;

     // Add error handling for image loading
     img.onerror = function() {
       console.error('Error loading image:', playlist.playlist_art);
       // Fallback to a default image if the specified one fails to load
       img.src = 'assets/img/playlist.png';
     };

     img.onload = function() {
       console.log('Image loaded successfully:', playlist.playlist_art);
     };

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

     // Add edit and delete buttons
     const playlistActions = document.createElement('div');
     playlistActions.classList.add('playlist-actions');

     const editButton = document.createElement('button');
     editButton.classList.add('edit-playlist');
     editButton.innerHTML = '✎ Edit';
     editButton.addEventListener('click', (event) => {
       event.stopPropagation(); // Prevent opening the modal
       openPlaylistForm(playlist);
     });

     const deleteButton = document.createElement('button');
     deleteButton.classList.add('delete-playlist');
     deleteButton.innerHTML = '✕ Delete';
     deleteButton.addEventListener('click', (event) => {
       event.stopPropagation(); // Prevent opening the modal
       deletePlaylist(playlist.playlistID);
     });

     playlistActions.appendChild(editButton);
     playlistActions.appendChild(deleteButton);
     card.appendChild(playlistActions);

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
     // Add click event listener to the card
     card.addEventListener('click', () => {
       document.querySelector('.modal-overlay').style.display = 'block';

       const modalContent = document.querySelector('.modal-cards');
       modalContent.innerHTML = playlist.songs.map((song, index) => `
         <div class="modal-card" id="modal-card-${index}">
           <div class="song-image">
             <img src="assets/img/music-image.jpeg" alt="">
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
           <i>By ${playlist.playlist_author}</i>
         </div>

       `;

       // Remove existing shuffle button if it exists
       const existingButton = document.querySelector('#shuffle-button');
       if (existingButton) {
         existingButton.parentElement.remove();
       }

       // Create and append shuffle button
       const shuffleButtonContainer = document.createElement('div');
       shuffleButtonContainer.classList.add('shuffle-container');

       const shuffleButton = document.createElement('button');
       shuffleButton.classList.add('shuffle-button');
       shuffleButton.id = 'shuffle-button';
       shuffleButton.textContent = 'Shuffle 🔀';

       shuffleButtonContainer.appendChild(shuffleButton);

       // Insert the shuffle button between modal-title and modal-cards
       const modalTitle = document.querySelector('.modal-title');
       const modalCards = document.querySelector('.modal-cards');
       modalTitle.parentNode.insertBefore(shuffleButtonContainer, modalCards);

       // Add event listener to shuffle button
       shuffleButton.addEventListener('click', () => {
         const modalCards = document.querySelector('.modal-cards');
         const cards = Array.from(modalCards.children);

         // Shuffle the cards
         for (let i = cards.length - 1; i > 0; i--) {
           const j = Math.floor(Math.random() * (i + 1));
           modalCards.appendChild(cards[j]);
         }
       });

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

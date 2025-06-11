// Function to fetch playlist data and display a random featured playlist
document.addEventListener('DOMContentLoaded', () => {
  fetch('data/data.json')
    .then((response) => response.json())
    .then((data) => {
      displayFeaturedPlaylist(data);
    })
    .catch((error) => {
      console.error('Error loading playlist data:', error);
    });
});

function displayFeaturedPlaylist(playlists) {
  // Select a random playlist
  const randomIndex = Math.floor(Math.random() * playlists.length);
  const featuredPlaylist = playlists[randomIndex];

  //Create the main container with a flex layout
  const mainContainer = document.querySelector('main');
  mainContainer.innerHTML = '';
  mainContainer.classList.add('featured-container');

  // Create left section for playlist info
  const leftSection = document.createElement('div');
  leftSection.classList.add('featured-info');

  // Create playlist image with error handling
  const playlistImage = document.createElement('img');
  playlistImage.classList.add('featured-image');
  playlistImage.src = featuredPlaylist.playlist_art;
  playlistImage.alt = featuredPlaylist.playlist_name;

  // Add error handling for image loading
  playlistImage.onerror = function() {
    console.error('Error loading featured image:', featuredPlaylist.playlist_art);
    playlistImage.src = 'assets/img/playlist.png';
  };

  // Create playlist title and author
  const playlistTitle = document.createElement('h2');
  playlistTitle.textContent = featuredPlaylist.playlist_name;

  const playlistAuthor = document.createElement('p');
  playlistAuthor.classList.add('featured-author');
  playlistAuthor.textContent = `Created by: ${featuredPlaylist.playlist_author}`;

  // Append elements to left section
  leftSection.appendChild(playlistImage);
  leftSection.appendChild(playlistTitle);
  leftSection.appendChild(playlistAuthor);

  // Create right section for songs
  const rightSection = document.createElement('div');
  rightSection.classList.add('featured-songs');

  // Create songs header
  const songsHeader = document.createElement('h3');
  songsHeader.textContent = 'Songs';
  rightSection.appendChild(songsHeader);

  // Create song list
  const songList = document.createElement('div');
  songList.classList.add('song-list');

  // Add each song to the list
  featuredPlaylist.songs.forEach((song, index) => {
    const songItem = document.createElement('div');
    songItem.classList.add('featured-song-item');

    const songNumber = document.createElement('span');
    songNumber.classList.add('song-number');
    songNumber.textContent = `${index + 1}.`;

    const songInfo = document.createElement('div');
    songInfo.classList.add('song-details');
    songInfo.innerHTML = `
      <div class="song-title">${song.title || 'Unknown Title'}</div>
      <div class="song-artist">${song.artist || 'Unknown Artist'}</div>
      <div class="song-duration">${song.duration || '0:00'}</div>
    `;

    songItem.appendChild(songNumber);
    songItem.appendChild(songInfo);
    songList.appendChild(songItem);
  });

  rightSection.appendChild(songList);

  // Append both sections to main container
  mainContainer.appendChild(leftSection);
  mainContainer.appendChild(rightSection);
}

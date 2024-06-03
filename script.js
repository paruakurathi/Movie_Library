const form = document.querySelector('form');
const container = document.querySelector('.image-container');
const playlistContainer = document.querySelector('.playlist');
const playlist = new Set();

form.addEventListener('submit', (e) => {
    e.preventDefault();
    let query = form.querySelector('input').value;
    console.log(query);

    OMDBApi(query);
});

async function OMDBApi(query) {
    try {
        const req = await fetch(`http://www.omdbapi.com/?s=${query}&apikey=23dc51b`);
        const res = await req.json();
        console.log('API Response:', res);  
        
        if (res.Search && Array.isArray(res.Search)) {
            makeImages(res.Search);  
        } else {
            console.error('Expected an array of movies in the search response, but got:', res);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function makeImages(movies) {
    container.innerHTML = ''; 
    for (let movie of movies) {
        
        let src = movie.Poster;

        if (src && src !== "N/A") { 
            const img = document.createElement('img');
            img.src = src;
            img.alt = movie.Title;
            img.addEventListener('click', () => {
                addToPlaylist(movie);
            });

            container.appendChild(img);
        } else {
            console.error('No image found for movie:', movie.Title);
        }
    }
}

function addToPlaylist(movie) {
    if (!playlist.has(movie.imdbID)) {  
        playlist.add(movie.imdbID);
        renderPlaylist();
    }
}

function renderPlaylist() {
    playlistContainer.innerHTML = '';
    playlist.forEach(id => {
        fetch(`http://www.omdbapi.com/?i=${id}&apikey=23dc51b`)
            .then(response => response.json())
            .then(movie => {
                const playlistItem = document.createElement('div');
                playlistItem.classList.add('playlist-item');

                const img = document.createElement('img');
                img.src = movie.Poster;
                img.alt = movie.Title;

                const caption = document.createElement('p');
                caption.textContent = movie.Title;

                playlistItem.appendChild(img);
                playlistItem.appendChild(caption);
                playlistContainer.appendChild(playlistItem);
            })
            .catch(error => console.error('Error fetching movie details:', error));
    });
}

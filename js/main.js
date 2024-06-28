document.addEventListener("DOMContentLoaded", function() {
    const contentContainer = document.querySelector('#content');
    const detailsSection = document.querySelector('.details');
    const loadingIndicator = document.querySelector('.loading');
    const btnClose = document.querySelector('#btnClose');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('nav.navbar');
    const apiKey = 'd08a3bd376mshca1bab9fd736a9bp1d0254jsn5c283c2e3949';
    const apiHost = 'free-to-play-games-database.p.rapidapi.com';

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.id;
            fetchGames(category);
        });
    });

    btnClose.addEventListener('click', function() {
        detailsSection.classList.add('d-none');
        contentContainer.classList.remove('d-none');
        navbar.classList.remove('d-none');
    });

    async function fetchGames(category) {
        loadingIndicator.classList.remove('d-none');
        const url = `https://free-to-play-games-database.p.rapidapi.com/api/games?category=${category}`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': apiKey,
                'x-rapidapi-host': apiHost
            }
        };

        try {
            const response = await fetch(url, options);
            const data = await response.json();
            displayGames(data);
            loadingIndicator.classList.add('d-none');
        } catch (error) {
            console.error('Error fetching games:', error);
            loadingIndicator.classList.add('d-none');
        }
    }

    function displayGames(games) {
        contentContainer.innerHTML = '';
        const row = document.createElement('div');
        row.classList.add('row', 'g-4'); 

        games.forEach(game => {
            const gameCard = document.createElement('div');
            gameCard.classList.add('col-md-3'); 
            gameCard.innerHTML = `
                <div class="card h-100">
                    <img src="${game.thumbnail}" class="card-img-top" alt="${game.title}">
                    <div class="card-body">
                        <h5 class="card-title">${game.title}</h5>
                        <p class="card-text">${game.short_description}</p>
                        <button class="btn btn-primary btn-details" data-id="${game.id}">Details</button>
                    </div>
                </div>
            `;
            row.appendChild(gameCard);
        });

        contentContainer.appendChild(row);

        document.querySelectorAll('.btn-details').forEach(button => {
            button.addEventListener('click', function() {
                const gameId = this.getAttribute('data-id');
                fetchGameDetails(gameId);
            });
        });
    }

    async function fetchGameDetails(gameId) {
        loadingIndicator.classList.remove('d-none');
        const url = `https://free-to-play-games-database.p.rapidapi.com/api/game?id=${gameId}`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': apiKey,
                'x-rapidapi-host': apiHost
            }
        };

        try {
            const response = await fetch(url, options);
            const data = await response.json();
            displayGameDetails(data);
            loadingIndicator.classList.add('d-none');
        } catch (error) {
            console.error('Error fetching game details:', error);
            loadingIndicator.classList.add('d-none');
        }
    }

    function displayGameDetails(game) {
        navbar.classList.add('d-none'); 
        detailsSection.querySelector('.hstack h1').textContent = game.title;
        detailsSection.querySelector('.row').innerHTML = `
            <div class="col-md-4">
                <img src="${game.thumbnail}" class="img-fluid" alt="${game.title}">
            </div>
            <div class="col-md-8">
                <h2>${game.title}</h2>
                <p>${game.description}</p>
                <ul class="list-group">
                    <li class="list-group-item">Genre: ${game.genre}</li>
                    <li class="list-group-item">Release Date: ${game.release_date}</li>
                    <li class="list-group-item">Developer: ${game.developer}</li>
                    <li class="list-group-item">Platform: ${game.platform}</li>
                </ul>
                <a href="${game.game_url}" target="_blank" class="btn btn-success mt-3 mb-3">Play Now</a> <!-- Added mb-3 for space below -->
            </div>
        `;
        detailsSection.classList.remove('d-none');
        contentContainer.classList.add('d-none');
    }

    
    fetchGames('mmorpg');
});

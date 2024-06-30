class APIHandler {
    constructor(apiKey, apiHost) {
        this.apiKey = apiKey;
        this.apiHost = apiHost;
    }

    async fetchGamesByCategory(category) {
        const url = `https://free-to-play-games-database.p.rapidapi.com/api/games?category=${category}`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': this.apiKey,
                'x-rapidapi-host': this.apiHost
            }
        };

        try {
            const response = await fetch(url, options);
            return await response.json();
        } catch (error) {
            console.error('Error fetching games:', error);
            return [];
        }
    }

    async fetchGameDetails(gameId) {
        const url = `https://free-to-play-games-database.p.rapidapi.com/api/game?id=${gameId}`;
        const options = {
            method: 'GET',
            headers: {
                'x-rapidapi-key': this.apiKey,
                'x-rapidapi-host': this.apiHost
            }
        };

        try {
            const response = await fetch(url, options);
            return await response.json();
        } catch (error) {
            console.error('Error fetching game details:', error);
            return null;
        }
    }
}

class UIHandler {
    constructor(contentContainer, detailsSection, loadingIndicator, navbar) {
        this.contentContainer = contentContainer;
        this.detailsSection = detailsSection;
        this.loadingIndicator = loadingIndicator;
        this.navbar = navbar;
    }

    toggleLoading(show) {
        this.loadingIndicator.classList.toggle('d-none', !show);
    }

    displayGames(games) {
        this.contentContainer.innerHTML = '';
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

        this.contentContainer.appendChild(row);

        document.querySelectorAll('.btn-details').forEach(button => {
            button.addEventListener('click', (event) => {
                const gameId = event.target.getAttribute('data-id');
                this.fetchGameDetails(gameId);
            });
        });
    }

    displayGameDetails(game) {
        this.navbar.classList.add('d-none');
        this.detailsSection.querySelector('.hstack h1').textContent = game.title;
        this.detailsSection.querySelector('.row').innerHTML = `
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
                <a href="${game.game_url}" target="_blank" class="btn btn-success mt-3 mb-3">Play Now</a>
            </div>
        `;
        this.detailsSection.classList.remove('d-none');
        this.contentContainer.classList.add('d-none');
    }

    closeDetails() {
        this.detailsSection.classList.add('d-none');
        this.contentContainer.classList.remove('d-none');
        this.navbar.classList.remove('d-none');
    }
}

class App {
    constructor() {
        this.apiHandler = new APIHandler('d08a3bd376mshca1bab9fd736a9bp1d0254jsn5c283c2e3949', 'free-to-play-games-database.p.rapidapi.com');
        this.uiHandler = new UIHandler(
            document.querySelector('#content'),
            document.querySelector('.details'),
            document.querySelector('.loading'),
            document.querySelector('nav.navbar')
        );

        this.initializeEventListeners();
        this.fetchGames('mmorpg');
    }

    initializeEventListeners() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = link.id;
                this.fetchGames(category);
            });
        });

        document.querySelector('#btnClose').addEventListener('click', () => {
            this.uiHandler.closeDetails();
        });
    }

    async fetchGames(category) {
        this.uiHandler.toggleLoading(true);
        const games = await this.apiHandler.fetchGamesByCategory(category);
        this.uiHandler.displayGames(games);
        this.uiHandler.toggleLoading(false);
    }

    async fetchGameDetails(gameId) {
        this.uiHandler.toggleLoading(true);
        const gameDetails = await this.apiHandler.fetchGameDetails(gameId);
        if (gameDetails) {
            this.uiHandler.displayGameDetails(gameDetails);
        }
        this.uiHandler.toggleLoading(false);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new App();
});

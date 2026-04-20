document.addEventListener('DOMContentLoaded', () => {
    const countryList = document.getElementById('country-list');
    const playersGrid = document.getElementById('players-grid');
    const viewTitle = document.getElementById('current-view-title');
    const totalPlayersEl = document.getElementById('total-players');
    const totalGoalsEl = document.getElementById('total-goals');
    const totalAssistsEl = document.getElementById('total-assists');
    const searchInput = document.getElementById('search-input');

    // Modal elements
    const modal = document.getElementById('player-modal');
    const modalClose = document.getElementById('modal-close');
    const modalImg = document.getElementById('modal-player-img');
    const modalName = document.getElementById('modal-name');
    const modalCountry = document.getElementById('modal-country');
    const modalHeight = document.getElementById('modal-height');
    const modalWeight = document.getElementById('modal-weight');
    const modalPosition = document.getElementById('modal-position');
    const modalDesc = document.getElementById('modal-desc');
    const modalApps = document.getElementById('modal-apps');
    const modalGoals = document.getElementById('modal-goals');
    const modalAssists = document.getElementById('modal-assists');

    let allPlayersData = [];
    let currentPlayersData = [];

    // Initialize Dashboard
    initDashboard();

    async function initDashboard() {
        await loadCountries();
        await loadPlayers();
        
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filtered = currentPlayersData.filter(p => 
                p.name.toLowerCase().includes(searchTerm) || 
                p.team.toLowerCase().includes(searchTerm)
            );
            renderPlayers(filtered);
        });
    }

    async function loadCountries() {
        try {
            const res = await fetch('/api/countries');
            const countries = await res.json();
            
            countries.forEach(c => {
                const li = document.createElement('li');
                li.setAttribute('data-id', c.id);
                // Can insert flag image here if desired.
                li.innerHTML = `<span class="flag-icon"></span> ${c.name}`;
                li.addEventListener('click', () => filterByCountry(c.id, c.name, li));
                countryList.appendChild(li);
            });
            
            // Re-attach "All" listener
            countryList.querySelector('[data-id="all"]').addEventListener('click', function() {
                filterByCountry('all', 'All Players', this);
            });
            
        } catch (error) {
            console.error("Failed to load countries", error);
        }
    }

    async function loadPlayers(countryId = 'all') {
        try {
            const url = countryId === 'all' ? '/api/players' : `/api/players/${countryId}`;
            const res = await fetch(url);
            const players = await res.json();
            
            if (countryId === 'all') {
                allPlayersData = players;
            }
            
            currentPlayersData = players;
            renderPlayers(players);
            updateDashboardStats(players);
            searchInput.value = ''; // Reset search

        } catch (error) {
            console.error("Failed to load players", error);
        }
    }

    function renderPlayers(players) {
        playersGrid.innerHTML = '';
        
        if (players.length === 0) {
            playersGrid.innerHTML = '<p style="color:var(--text-muted); grid-column:1/-1;">No players found.</p>';
            return;
        }

        players.forEach(p => {
            // Check if player has real image or use generated placeholder
            const fallbackImg = '/static/images/placeholder.png';
            const fallbackBg = `background: linear-gradient(45deg, var(--primary), var(--accent));`;
            const imageHtml = `<div class="player-img-container" style="${fallbackBg}">
                <img src="${p.image_url}" alt="${p.name}" onerror="this.onerror=null; this.src='${fallbackImg}';">
            </div>`;

            const card = document.createElement('div');
            card.className = 'player-card';
            card.innerHTML = `
                ${imageHtml}
                <div class="player-info">
                    <div class="country-name">${p.country_name}</div>
                    <h3>${p.name}</h3>
                    <div class="team">
                        <span>🏰</span> ${p.team}
                    </div>
                    <div class="player-stats">
                        <div class="stat-item">
                            <span>Apps</span>
                            <strong>${p.appearances}</strong>
                        </div>
                        <div class="stat-item">
                            <span>Goals</span>
                            <strong>${p.goals}</strong>
                        </div>
                        <div class="stat-item">
                            <span>Assists</span>
                            <strong>${p.assists}</strong>
                        </div>
                    </div>
                </div>
            `;
            
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => openPlayerModal(p));
            
            playersGrid.appendChild(card);
            
            // Animation staggered entrance
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50);
        });
    }

    function updateDashboardStats(players) {
        totalPlayersEl.innerText = players.length;
        totalGoalsEl.innerText = players.reduce((sum, p) => sum + p.goals, 0);
        totalAssistsEl.innerText = players.reduce((sum, p) => sum + p.assists, 0);
        
        // Simple counter animation
        animateValue(totalPlayersEl, 0, players.length, 1000);
        animateValue(totalGoalsEl, 0, players.reduce((sum, p) => sum + p.goals, 0), 1000);
        animateValue(totalAssistsEl, 0, players.reduce((sum, p) => sum + p.assists, 0), 1000);
    }

    function filterByCountry(countryId, title, liElement) {
        // Update active class
        document.querySelectorAll('.country-nav li').forEach(el => el.classList.remove('active'));
        liElement.classList.add('active');
        
        viewTitle.innerText = title;
        loadPlayers(countryId);
    }

    // Number animation utility
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
    
    // Modal Event Listeners & Logic
    modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    async function openPlayerModal(p) {
        modalImg.src = p.image_url;
        modalImg.onerror = function() {
            this.onerror = null; 
            this.src = '/static/images/placeholder.png';
        };
        
        modalName.innerText = p.name;
        modalCountry.innerText = p.country_name + ' • ' + p.team;
        modalApps.innerText = p.appearances;
        modalGoals.innerText = p.goals;
        modalAssists.innerText = p.assists;

        modalHeight.innerText = 'Loading...';
        modalWeight.innerText = 'Loading...';
        modalPosition.innerText = p.position;
        modalDesc.innerText = 'Loading player history and biography...';

        modal.classList.add('active');

        try {
            const url = `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(p.name)}`;
            const res = await fetch(url);
            const data = await res.json();
            
            if (data && data.player && data.player.length > 0) {
                const sp = data.player[0];
                modalHeight.innerText = sp.strHeight || 'Unknown';
                modalWeight.innerText = sp.strWeight || 'Unknown';
                if (sp.strPosition) modalPosition.innerText = sp.strPosition;
                modalDesc.innerText = sp.strDescriptionEN || 'No biography available for this player.';
            } else {
                modalDesc.innerText = 'No extended biography found for this player in the database.';
                modalHeight.innerText = '--';
                modalWeight.innerText = '--';
            }
        } catch (error) {
            console.error("Failed to fetch detailed info", error);
            modalDesc.innerText = 'Failed to load biography due to network error.';
            modalHeight.innerText = '--';
            modalWeight.innerText = '--';
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const resultsArea = document.getElementById('resultsArea');
    const cardTemplate = document.getElementById('card-template');

    let debounceTimer;

    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        const query = e.target.value.trim();

        if (query.length === 0) {
            resultsArea.innerHTML = `
                <div class="placeholder-message">
                    <p>Escribe algo arriba para comenzar la aventura...</p>
                    <img src="/static/images/explorer-icon.png" alt="Explorer" style="width:100px; opacity:0.5;">
                </div>`;
            return;
        }

        debounceTimer = setTimeout(() => {
            fetchResults(query);
        }, 300); // 300ms debounce
    });

    async function fetchResults(query) {
        try {
            const response = await fetch(`/search?q=${encodeURIComponent(query)}`);
            const results = await response.json();
            renderResults(results);
        } catch (error) {
            console.error('Error fetching results:', error);
            resultsArea.innerHTML = '<p class="placeholder-message">¡Ups! Algo salió mal. Intenta de nuevo.</p>';
        }
    }

    function renderResults(results) {
        resultsArea.innerHTML = '';

        if (results.length === 0) {
            resultsArea.innerHTML = `
                <div class="placeholder-message">
                    <p>🤔 No encontré nada sobre eso. ¡Intenta buscar otra cosa como "Espacio" o "Agua"!</p>
                </div>`;
            return;
        }

        results.forEach(item => {
            const clone = cardTemplate.content.cloneNode(true);
            const card = clone.querySelector('.card');
            
            // Set Icon based on type
            const iconEl = card.querySelector('.card-icon');
            if (item.type === 'image') iconEl.textContent = '🖼️';
            else if (item.type === 'video') iconEl.textContent = '🎬';
            else if (item.type === 'audio') iconEl.textContent = '🎵';
            else if (item.type === 'pdf') iconEl.textContent = '📕';
            else iconEl.textContent = '📄';

            card.querySelector('.card-title').textContent = item.name;
            
            const link = card.querySelector('.card-btn');
            link.href = `/files/${item.path}`; // Path is relative to BD
            
            resultsArea.appendChild(clone);
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    // Прелоадер
    const preloader = document.getElementById('preloader');
    function hidePreloader() {
        preloader.style.transition = 'opacity 0.1s ease';
        preloader.style.opacity = '0';
        setTimeout(() => preloader.style.display = 'none', 100);
    }
    preloader.addEventListener('click', hidePreloader);
    setTimeout(hidePreloader, 2300);

    const track = document.querySelector('.carousel-track');
    if (track) track.innerHTML = track.innerHTML + track.innerHTML;

    const searchInput = document.querySelector('.searchi');
    const searchBtn = document.querySelector('.searchb');
    
    const allSections = document.querySelectorAll('main > section:not(.why-section)');
    const allH2 = document.querySelectorAll('main > h2');
    const allHr = document.querySelectorAll('main > hr');
    const whySection = document.querySelector('.why-section');
    const aboutSection = document.querySelector('.about-section');
    const mainEl = document.querySelector('main');

    const originalArticles = [];
    allSections.forEach(section => {
        Array.from(section.children).forEach(child => {
            if (child.tagName === 'A' || child.tagName === 'ARTICLE') {
                originalArticles.push(child.cloneNode(true));
            }
        });
    });

    const resultsBlock = document.createElement('div');
    resultsBlock.id = 'search-results';
    resultsBlock.style.display = 'none';
    mainEl.appendChild(resultsBlock);

    function doSearch() {
        const query = searchInput.value.toLowerCase().trim();
        
        if (query === '') {
            resetSearch();
            return;
        }

        const matched = originalArticles.filter(item => {
            const article = item.tagName === 'A' ? item.querySelector('article') : item;
            const name = article.dataset.name ? article.dataset.name.toLowerCase() :
                        (article.querySelector('.center:first-child')?.textContent.toLowerCase() || '');
            const desc = article.querySelector('i')?.textContent.toLowerCase() || '';
            
            return name.includes(query) || desc.includes(query);
        });

        allSections.forEach(s => s.style.display = 'none');
        allH2.forEach(h => h.style.display = 'none');
        allHr.forEach(h => h.style.display = 'none');
        if (whySection) whySection.style.display = 'none';
        if (aboutSection) aboutSection.style.display = 'none';

        resultsBlock.innerHTML = '<h2 class="sect">РЕЗУЛЬТАТЫ ПОИСКА</h2><div id="results-section" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px;"></div>';
        resultsBlock.style.display = 'block';

        const resultsSection = document.getElementById('results-section');
        
        if (matched.length === 0) {
            resultsSection.innerHTML = '<p style="color: var(--gold); font-size: 20px; grid-column: 1/-1; text-align: center;">Ничего не найдено</p>';
        } else {
            matched.forEach(item => {
                const clone = item.cloneNode(true);
                resultsSection.appendChild(clone);
            });
        }
    }

    function resetSearch() {
        allSections.forEach(s => s.style.display = 'grid');
        allH2.forEach(h => h.style.display = 'inline-block');
        allHr.forEach(h => h.style.display = 'block');
        if (whySection) whySection.style.display = 'flex';
        if (aboutSection) aboutSection.style.display = 'flex';
        
        resultsBlock.style.display = 'none';
        resultsBlock.innerHTML = '';
        searchInput.value = '';
    }

    searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        doSearch();
    });

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            doSearch();
        }
    });
});

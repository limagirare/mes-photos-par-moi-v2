document.addEventListener('DOMContentLoaded', () => {
    // Sélection des éléments DOM
    const photoGrid = document.getElementById('photoGrid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const carouselModal = document.getElementById('carouselModal');
    const closeButton = carouselModal.querySelector('.close-button');
    const carouselTrack = carouselModal.querySelector('.carousel-track');
    const prevButton = carouselModal.querySelector('.carousel-nav.prev');
    const nextButton = carouselModal.querySelector('.carousel-nav.next');

    // Variables d'état
    let currentSlideIndex = 0;
    let photosData = []; // Ce tableau sera maintenant rempli par le script PHP
    let currentCarouselPhotos = [];

    // --- Fonction pour charger les photos depuis le backend PHP ---
    const loadPhotosFromBackend = async () => {
        try {
            // L'URL pointe maintenant vers votre nouveau script de génération de données
            const response = await fetch('generate_gallery_data.php');
            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
            }
            const data = await response.json();

            if (data.error) {
                console.error("Erreur du backend:", data.error);
                photoGrid.innerHTML = '<p>Désolé, impossible de charger les photos pour le moment.</p>';
                return;
            }

            // Mappe les données pour s'assurer que 'id' est un nombre et 'displayInGrid' est un booléen
            photosData = data.map(photo => ({
                ...photo,
                id: parseInt(photo.id),
                // Assurez-vous que displayInGrid est un booléen (PHP peut renvoyer 0/1 ou 'true'/'false')
                displayInGrid: typeof photo.displayInGrid === 'boolean' ? photo.displayInGrid : (photo.displayInGrid === 'true' || photo.displayInGrid === 1)
            }));

            // Initialise l'affichage de la galerie avec les photos chargées
            renderPhotos(photosData);

        } catch (error) {
            console.error("Erreur lors du chargement des photos:", error);
            photoGrid.innerHTML = '<p>Désolé, une erreur est survenue lors du chargement des photos.</p>';
        }
    };

    // --- Fonctions principales de la galerie (inchangées dans leur logique) ---

    const renderPhotos = (photosToDisplay) => {
        photoGrid.innerHTML = '';
        const photosForGrid = photosToDisplay.filter(photo => photo.displayInGrid);

        if (photosForGrid.length === 0 && (filterButtons[0].classList.contains('active') || searchInput.value === '')) {
            photoGrid.innerHTML = '<p>Aucune photo visible dans la galerie principale.</p>';
            return;
        }

        photosForGrid.forEach(photo => {
            const photoItem = document.createElement('div');
            photoItem.classList.add('photo-item');
            photoItem.setAttribute('data-id', photo.id);
            photoItem.setAttribute('data-theme', photo.theme);

            photoItem.innerHTML = `
                <img src="${photo.thumb}" alt="${photo.title}">
                <div class="photo-info">
                    <h3>${photo.title}</h3>
                    <p>${photo.description}</p>
                </div>
            `;
            photoGrid.appendChild(photoItem);

            photoItem.addEventListener('click', () => openCarousel(photo.id, photo.groupId));
        });
    };

    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');

            const theme = e.target.dataset.theme;
            const filteredByTheme = theme === 'all' ? photosData : photosData.filter(photo => photo.theme === theme);
            renderPhotos(filteredByTheme);
        });
    });

    const performSearch = () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const photosVisibleInGrid = photosData.filter(photo => photo.displayInGrid);
        const searchResults = photosVisibleInGrid.filter(photo =>
            photo.title.toLowerCase().includes(searchTerm) ||
            photo.description.toLowerCase().includes(searchTerm) ||
            photo.theme.toLowerCase().includes(searchTerm)
        );
        photoGrid.innerHTML = '';

        if (searchResults.length === 0 && searchTerm !== '') {
            photoGrid.innerHTML = '<p>Aucune photo trouvée pour votre recherche.</p>';
            return;
        }

        searchResults.forEach(photo => {
            const photoItem = document.createElement('div');
            photoItem.classList.add('photo-item');
            photoItem.setAttribute('data-id', photo.id);
            photoItem.setAttribute('data-theme', photo.theme);

            photoItem.innerHTML = `
                <img src="${photo.thumb}" alt="${photo.title}">
                <div class="photo-info">
                    <h3>${photo.title}</h3>
                    <p>${photo.description}</p>
                </div>
            `;
            photoGrid.appendChild(photoItem);
            photoItem.addEventListener('click', () => openCarousel(photo.id, photo.groupId));
        });
    };

    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        } else if (searchInput.value.trim() === '') {
            renderPhotos(photosData);
        }
    });

    // --- Fonctions du carrousel (inchangées) ---

    const openCarousel = (startPhotoId, groupId) => {
        carouselTrack.innerHTML = '';
        currentCarouselPhotos = photosData.filter(photo => photo.groupId === groupId);
        const startIndex = currentCarouselPhotos.findIndex(photo => photo.id === startPhotoId);

        currentCarouselPhotos.forEach(photo => {
            const carouselItem = document.createElement('div');
            carouselItem.classList.add('carousel-item');
            carouselItem.setAttribute('data-id', photo.id);
            carouselItem.innerHTML = `<img src="${photo.src}" alt="${photo.title}">`;
            carouselTrack.appendChild(carouselItem);
        });

        currentSlideIndex = startIndex !== -1 ? startIndex : 0;
        updateCarousel();
        carouselModal.style.display = 'flex';
    };

    const updateCarousel = () => {
        if (carouselTrack.children.length === 0) {
            console.warn("Le carrousel n'a pas d'éléments à afficher.");
            return;
        }
        const itemWidth = carouselTrack.children[0].clientWidth;
        carouselTrack.style.transform = `translateX(-${currentSlideIndex * itemWidth}px)`;
    };

    prevButton.addEventListener('click', () => {
        currentSlideIndex = (currentSlideIndex > 0) ? currentSlideIndex - 1 : currentCarouselPhotos.length - 1;
        updateCarousel();
    });

    nextButton.addEventListener('click', () => {
        currentSlideIndex = (currentSlideIndex < currentCarouselPhotos.length - 1) ? currentSlideIndex + 1 : 0;
        updateCarousel();
    });

    closeButton.addEventListener('click', () => {
        carouselModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === carouselModal) {
            carouselModal.style.display = 'none';
        }
    });

    // --- Initialisation de la galerie au chargement de la page ---
    loadPhotosFromBackend(); // Appel pour charger les photos dynamiquement
});
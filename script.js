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
    // Supprimé: starRatingContainer et averageRatingDisplay

    // Variables d'état
    let currentSlideIndex = 0;
    let photosData = []; // Contient toutes les données des photos
    let currentCarouselPhotos = []; // Contient les photos du carrousel actuellement ouvert (celles du même groupe)

    // --- Données factices des photos (pas de 'ratings' nécessaire) ---
    photosData = [
        {
            id: 1,
            src: 'img/tucbrives2025/derriere-2x.png',
            thumb: 'img/tucbrives2025/derriere-2x.png',
            title: 'championnat de zone brives 2025',
            description: 'Equipage du toulouse université club.',
            theme: 'sport',
            groupId: 'groupeA',
            displayInGrid: true // Visible dans la grille générale
        },
        {
            id: 2,
            src: 'img/tucbrives2025/arche-1x.png',
            thumb: 'img/tucbrives2025/arche-1x.png',
            title: 'championnat de zone brives 2025',
            description: 'Equipage du toulouse université club.',
            theme: 'sport',
            groupId: 'groupeA',
            displayInGrid: false // Seulement visible dans le carrousel
        },
        {
            id: 3,
            src: 'img/tucbrives2025/arrivee-2x-v1.png',
            thumb: 'img/tucbrives2025/arrivee-2x-v1.png',
            title: 'championnat de zone brives 2025',
            description: 'Equipage du toulouse université club.',
            theme: 'mix',
            groupId: 'groupeA',
            displayInGrid: false // Seulement visible dans le carrousel
        },
        {
            id: 4,
            src: 'img/babayaga.jpg',
            thumb: 'img/babayaga.jpg',
            title: 'exposition Babayaga',
            description: 'street art à Toulouse en 2024.',
            theme: 'art',
            groupId: 'groupeB',
            displayInGrid: true // Visible dans la grille générale
        },
        {
            id: 5,
            src: 'img/escalier_reflet.jpg',
            thumb: 'img/escalier_reflet.jpg',
            title: 'exposition Babayaga',
            description: 'street art à Toulouse en 2024.',
            theme: 'art',
            groupId: 'groupeB',
            displayInGrid: false // Seulement visible dans le carrousel
        },
        {
            id: 6,
            src: 'img/escaliers.jpg',
            thumb: 'img/escaliers.jpg',
            title: 'exposition Babayaga',
            description: 'street art à Toulouse en 2024.',
            theme: 'art',
            groupId: 'groupeB', // Peut avoir un groupId unique pour les photos indépendantes
            displayInGrid: false // Toujours visible dans la grille
        },
        {
            id: 7,
            src: 'img/street-art.jpg',
            thumb: 'img/street-art.jpg',
            title: 'exposition layup',
            description: 'street art à Toulouse en 2024.',
            theme: 'art',
            groupId: 'groupeC', // Peut avoir un groupId unique pour les photos indépendantes
            displayInGrid: true // Toujours visible dans la grille
        },
        {
            id: 8,
            src: 'img/layup.jpg',
            thumb: 'img/layup.jpg',
            title: 'exposition layup',
            description: 'street art à Toulouse en 2024.',
            theme: 'art',
            groupId: 'groupeC', // Peut avoir un groupId unique pour les photos indépendantes
            displayInGrid: false // Seulement visible dans le carrousel
        },
        {
            id: 9,
            src: 'img/poule1.png',
            thumb: 'img/poule1.png',
            title: 'jardin des plantes',
            description: 'promenade du 1er mai.',
            theme: 'nature',
            groupId: 'groupeD', // Peut avoir un groupId unique pour les photos indépendantes
            displayInGrid: true // Seulement visible dans le carrousel
        },
        {
            id: 10,
            src: 'img/duocanards.png',
            thumb: 'img/duocanards.png',
            title: 'jardin des plantes',
            description: 'promenade du 1er mai.',
            theme: 'nature',
            groupId: 'groupeD', // Peut avoir un groupId unique pour les photos indépendantes
            displayInGrid: false // Seulement visible dans le carrousel
        },
        {
            id: 11,
            src: 'img/jdlftete.png',
            thumb: 'img/jdlftete.png',
            title: 'jardin des plantes',
            description: 'promenade du 1er mai.',
            theme: 'nature',
            groupId: 'groupeD', // Peut avoir un groupId unique pour les photos indépendantes
            displayInGrid: false // Seulement visible dans le carrousel
        },
        {
            id: 12,
            src: 'img/paquerette.png',
            thumb: 'img/paquerette.png',
            title: 'jardin des plantes',
            description: 'promenade du 1er mai.',
            theme: 'nature',
            groupId: 'groupeD', // Peut avoir un groupId unique pour les photos indépendantes
            displayInGrid: false // Toujours visible dans la grille
        },
        {
            id: 13,
            src: 'img/san_jordi/escudo.jpg',
            thumb: 'img/san_jordi/escudo.jpg',
            title: 'la san jordi 2024 a Barcelonne',
            description: 'Fete traditionelle catalane.',
            theme: 'ville',
            groupId: 'groupeE', // Peut avoir un groupId unique pour les photos indépendantes
            displayInGrid: true // Seulement visible dans le carrousel
        },
        {
            id: 14,
            src: 'img/san_jordi/casabatloo.jpg',
            thumb: 'img/san_jordi/casabatloo.jpg',
            title: 'la san jordi 2024 a Barcelonne',
            description: 'Fete traditionelle catalane.',
            theme: 'ville',
            groupId: 'groupeE', // Peut avoir un groupId unique pour les photos indépendantes
            displayInGrid: false // Seulement visible dans le carrousel
        },
        {
            id: 15,
            src: 'img/san_jordi/taula.jpg',
            thumb: 'img/san_jordi/taula.jpg',
            title: 'la san jordi 2024 a Barcelonne',
            description: 'Fete traditionelle catalane.',
            theme: 'ville',
            groupId: 'groupeE', // Peut avoir un groupId unique pour les photos indépendantes
            displayInGrid: false // Toujours visible dans la grille
        },
        {
            id: 16,
            src: 'img/san_jordi/llibres.jpg',
            thumb: 'img/san_jordi/llibres.jpg',
            title: 'la san jordi 2024 a Barcelonne',
            description: 'Fete traditionelle catalane.',
            theme: 'ville',
            groupId: 'groupeE', // Peut avoir un groupId unique pour les photos
            displayInGrid: false // Toujours visible dans la grille
        },
        {
            id: 17,
            src: 'img/san_jordi/estudis.jpg',
            thumb: 'img/san_jordi/estudis.jpg',
            title: 'la san jordi 2024 a Barcelonne',
            description: 'Fete traditionelle catalane.',
            theme: 'ville',
            groupId: 'groupeE', // Peut avoir un groupId unique pour les photos
            displayInGrid: false // Toujours visible dans la grille
        },
        {
            id: 18,
            src: 'img/san_jordi/teulat.jpg',
            thumb: 'img/san_jordi/teulat.jpg',
            title: 'la san jordi 2024 a Barcelonne',
            description: 'Fete traditionelle catalane.',
            theme: 'ville',
            groupId: 'groupeE', // Peut avoir un groupId unique pour les photos
            displayInGrid: false // Toujours visible dans la grille
        },
        {
            id: 19,
            src: 'img/san_jordi/roses.jpg',
            thumb: 'img/san_jordi/roses.jpg',
            title: 'la san jordi 2024 a Barcelonne',
            description: 'Fete traditionelle catalane.',
            theme: 'ville',
            groupId: 'groupeE', // Peut avoir un groupId unique pour les photos
            displayInGrid: false // Toujours visible dans la grille
        },
        {
            id: 20,
            src: 'img/san_jordi/cent.jpg',
            thumb: 'img/san_jordi/cent.jpg',
            title: 'la san jordi 2024 a Barcelonne',
            description: 'Fete traditionelle catalane.',
            theme: 'ville',
            groupId: 'groupeE', // Peut avoir un groupId unique pour les photos
            displayInGrid: false // Toujours visible dans la grille
        },
        {
            id: 21,
            src: 'img/mainlumiere.jpg',
            thumb: 'img/mainlumiere.jpg',
            title: 'main à la lumière',
            description: '',
            theme: 'mix',
            groupId: 'groupeF', // Peut avoir un groupId unique pour les photos
            displayInGrid: true // Toujours visible dans la grille
        },
        {
            id: 22,
            src: 'img/enfant_madrid.jpg',
            thumb: 'img/enfant_madrid.jpg',
            title: 'enfant à Madrid',
            description: 'enfant à Madrid',
            theme: 'art',
            groupId: 'groupeG', // Peut avoir un groupId unique pour les photos
            displayInGrid: true // Toujours visible dans la grille
        },
        {
            id: 23,
            src: 'img/cartoucherelibrairie.jpg',
            thumb: 'img/cartoucherelibrairie.jpg',
            title: 'reflet dans une librairie',
            description: 'halles de la cartoucherie à Toulouse',
            theme: 'ville',
            groupId: 'groupeH', // Peut avoir un groupId unique pour les photos
            displayInGrid: true // Toujours visible dans la grille
        },
        {
            id: 24,
            src: 'img/arcenciel.jpg',
            thumb: 'img/arcenciel.jpg',
            title: 'immeubles toulousains',
            description: '',
            theme: 'ville',
            groupId: 'groupeI', // Peut avoir un groupId unique pour les photos
            displayInGrid: true // Toujours visible dans la grille
        },
        {
            id: 25,
            src: 'img/mephisto.jpg',
            thumb: 'img/mephisto.jpg',
            title: 'immeubles toulousains',
            description: '',
            theme: 'ville',
            groupId: 'groupeI', // Peut avoir un groupId unique pour les photos
            displayInGrid: false // Toujours visible dans la grille
        },
        {
            id: 26,
            src: 'img/velo.jpg',
            thumb: 'img/velo.jpg',
            title: 'immeubles toulousains',
            description: '',
            theme: 'ville',
            groupId: 'groupeI', // Peut avoir un groupId unique pour les photos
            displayInGrid: false // Toujours visible dans la grille
        },
        {
            id: 27,
            src: 'img/reflet-monuments-morts.jpg',
            thumb: 'img/reflet-monuments-morts.jpg',
            title: 'immeubles toulousains',
            description: '',
            theme: 'ville',
            groupId: 'groupeI', // Peut avoir un groupId unique pour les photos
            displayInGrid: false // Toujours visible dans la grille
        },
        {
            id: 28,
            src: 'img/bnp.jpg',
            thumb: 'img/bnp.jpg',
            title: 'immeubles toulousains',
            description: '',
            theme: 'ville',
            groupId: 'groupeI', // Peut avoir un groupId unique pour les photos
            displayInGrid: false // Seulement visible dans le carrousel
        }
    ];


    // --- Fonctions principales de la galerie ---

    /**
     * Rend (affiche) les photos dans la grille principale de la galerie.
     * FILTRE POUR N'AFFICHER QUE LES PHOTOS AVEC displayInGrid: true
     * @param {Array<Object>} photosToDisplay - Les photos à afficher.
     */
    const renderPhotos = (photosToDisplay) => {
        photoGrid.innerHTML = '';
        const photosForGrid = photosToDisplay.filter(photo => photo.displayInGrid);

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

    /**
     * Gère le filtrage des photos par thème (boutons "Mix", "Animaux", "Ville").
     */
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');

            const theme = e.target.dataset.theme;
            const filteredByTheme = theme === 'all' ? photosData : photosData.filter(photo => photo.theme === theme);
            renderPhotos(filteredByTheme);
        });
    });

    /**
     * Effectue une recherche dans les photos par titre, description ou thème.
     * La recherche s'applique aux photos visibles dans la grille.
     */
    const performSearch = () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const photosVisibleInGrid = photosData.filter(photo => photo.displayInGrid);
        const searchResults = photosVisibleInGrid.filter(photo =>
            photo.title.toLowerCase().includes(searchTerm) ||
            photo.description.toLowerCase().includes(searchTerm) ||
            photo.theme.toLowerCase().includes(searchTerm)
        );
        photoGrid.innerHTML = '';
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

        if (searchResults.length === 0 && searchTerm !== '') {
            photoGrid.innerHTML = '<p>Aucune photo trouvée pour votre recherche.</p>';
        }
    };


    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        } else if (searchInput.value.trim() === '') {
            renderPhotos(photosData);
        }
    });


    // --- Fonctions du carrousel ---

    /**
     * Ouvre la modale du carrousel et charge toutes les photos du même groupe.
     * @param {number} startPhotoId - L'ID de la photo sur laquelle on a cliqué.
     * @param {string} groupId - L'ID du groupe à afficher dans le carrousel.
     */
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

    /**
     * Met à jour la position du carrousel.
     */
    const updateCarousel = () => {
        if (carouselTrack.children.length === 0) {
            console.warn("Le carrousel n'a pas d'éléments à afficher.");
            return;
        }
        const itemWidth = carouselTrack.children[0].clientWidth;
        carouselTrack.style.transform = `translateX(-${currentSlideIndex * itemWidth}px)`;

        // Supprimé: mise à jour de la section de notation
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

    // --- Fonctionnalité de notation (ENTIÈREMENT SUPPRIMÉE) ---
    // Supprimé: starRatingContainer.addEventListener('click', ...);

    // --- Initialisation de la galerie au chargement de la page ---
    renderPhotos(photosData);
});

// Toggle menu on clicking the toggle button
const menuToggle = document.querySelector('.menuToggle');
const header = document.querySelector('header');
const closeMenu = document.querySelector('.closeMenu');

menuToggle.addEventListener('click', () => {
    header.classList.toggle('active');
});

// Close menu when clicking the "X" button
closeMenu.addEventListener('click', () => {
    header.classList.remove('active');
});

// Close menu when clicking outside of it
document.addEventListener('click', (event) => {
    const isClickInside = header.contains(event.target);
    const isClickOnToggle = menuToggle.contains(event.target);

    // If the click is outside the header and toggle button, close the menu
    if (!isClickInside && !isClickOnToggle && header.classList.contains('active')) {
        header.classList.remove('active');
    }
});



document.addEventListener('DOMContentLoaded', () => {
    const imagePaths = [
        'img/horizongirls1.jpg',
        'img/horizongirls2.jpg',
        'img/horizongirls3.jpg',
        'img/horizongirls4.jpg'
    ]; // Array of image paths

    const galleryContainer = document.querySelector('.image-gallery');

    // Dynamically create gallery items
    imagePaths.forEach((path, index) => {
        const item = document.createElement('div');
        item.classList.add('gallery-item');
        if (index === 0) item.classList.add('active'); // Set first image as active
        const img = document.createElement('img');
        img.src = path;
        img.alt = `Image ${index + 1}`;
        item.appendChild(img);
        galleryContainer.appendChild(item);
    });

    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentIndex = 0;

    const showNextImage = () => {
        galleryItems[currentIndex].classList.remove('active');
        galleryItems[currentIndex].classList.add('previous');

        currentIndex = (currentIndex + 1) % galleryItems.length;

        galleryItems[currentIndex].classList.remove('previous');
        galleryItems[currentIndex].classList.add('active');
    };

    // Change images every 3 seconds
    setInterval(showNextImage, 5000);
});
let currentIndex = 0;
const featuredImage = document.getElementById('featuredImage');
const thumbnails = document.querySelectorAll('.thumbnail');

// Automatically cycle through images
function autoCycleImages() {
    currentIndex = (currentIndex + 1) % thumbnails.length;
    updateFeaturedImage(thumbnails[currentIndex]);
}

// Change featured image when a thumbnail is clicked
function changeFeaturedImage(thumbnail) {
    clearInterval(autoCycle); // Stop auto-cycling when manually selected
    updateFeaturedImage(thumbnail);
}

// Update the featured image
function updateFeaturedImage(thumbnail) {
    // Update the featured image source
    featuredImage.src = thumbnail.src;

    // Highlight the active thumbnail
    thumbnails.forEach(img => img.classList.remove('active-thumbnail'));
    thumbnail.classList.add('active-thumbnail');
}

// Start the automatic cycling
const autoCycle = setInterval(autoCycleImages, 3000); // Change every 3 seconds
document.addEventListener('DOMContentLoaded', () => {
    // Data for each service
    const services = [
        {
            title: 'Bespoke Hair Services',
            description: 'From braiding to customized hair treatments, let us bring your hair goals to life for any occasion.',
        },
        {
            title: 'Flawless Brows & Lashes',
            description: 'Enhance your natural beauty with our ombre brows, microblading, and lash fixation services.',
        },
        {
            title: 'Relaxing Spa Services',
            description: 'Unwind and rejuvenate with our luxurious spa treatments designed for ultimate relaxation.',
        },
        {
            title: 'Professional Nail Care',
            description: 'Get perfectly polished nails for any occasion with our manicure, pedicure, and nail art services.',
        },
        {
            title: 'Glowing Facials',
            description: 'Refresh and hydrate your skin with our tailored facial treatments, perfect for photos or events.',
        },
        {
            title: 'Silky Smooth Waxing',
            description: 'Feel confident with our gentle waxing services that leave your skin smooth and flawless.',
        },
    ];

    // Select modal elements
    const modal = document.createElement('div');
    modal.classList.add('modal');
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <h3 id="modal-title"></h3>
            <p id="modal-description"></p>
        </div>
    `;
    document.body.appendChild(modal);

    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const closeModal = modal.querySelector('.modal-close');

    // Attach click event to each service box
    const serviceBoxes = document.querySelectorAll('.servicesBox .box');
    serviceBoxes.forEach((box, index) => {
        box.addEventListener('click', () => {
            const service = services[index];
            modalTitle.textContent = service.title;
            modalDescription.textContent = service.description;
            modal.classList.add('active'); // Show the modal
        });
    });

    // Close the modal on clicking the close button or outside the modal content
    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.classList.remove('active');
        }
    });
});

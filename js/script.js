const themeToggle = document.getElementById('theme-toggle');
const page = document.documentElement;
const storageKey = 'km-portfolio-theme';

let savedTheme = null;
try {
    savedTheme = localStorage.getItem(storageKey);
} catch (error) {
    savedTheme = null;
}

function setTheme(theme) {
    page.dataset.theme = theme;
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    const label = `Switch to ${nextTheme} mode`;
    themeToggle.setAttribute('aria-label', label);
    themeToggle.setAttribute('aria-pressed', String(theme === 'light'));
    themeToggle.title = label;
}

setTheme(savedTheme === 'light' ? 'light' : 'dark');

themeToggle.addEventListener('click', () => {
    const nextTheme = page.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);

    try {
        localStorage.setItem(storageKey, nextTheme);
    } catch (error) {
        // Theme still works when browser storage is disabled.
    }
});

// My Journey toggle
const journeyToggle = document.getElementById('journey-toggle');
const journeyContent = document.getElementById('journey-content');
const journeyLabel = journeyToggle.querySelector('.journey-toggle-label');

journeyToggle.addEventListener('click', () => {
    const isOpen = journeyToggle.getAttribute('aria-expanded') === 'true';
    journeyToggle.setAttribute('aria-expanded', String(!isOpen));
    journeyContent.setAttribute('aria-hidden', String(isOpen));
    journeyContent.inert = isOpen;
    journeyLabel.textContent = isOpen ? 'Read My Story' : 'Close My Story';
});


// Projects screenshot galleries
const projectGalleries = {
    tradegrid: {
        title: 'Trade Grid',
        slides: [
            {
                src: 'assets/images/projects/trade-grid/home.png',
                alt: 'Trade Grid homepage',
                label: 'Homepage'
            }
        ]
    },
    mechaniq: {
        title: 'MechanIQ',
        slides: [
            {
                src: 'assets/images/projects/mechaniq/login.png',
                alt: 'MechanIQ login screen',
                label: 'Login'
            },
            {
                src: 'assets/images/projects/mechaniq/customer-dashboard.png',
                alt: 'MechanIQ customer dashboard',
                label: 'Customer Dashboard'
            },
            {
                src: 'assets/images/projects/mechaniq/mechanic-dashboard.png',
                alt: 'MechanIQ mechanic dashboard',
                label: 'Mechanic Dashboard'
            }
        ]
    }
};

const projectLightbox = document.getElementById('project-lightbox');
const lightboxImage = document.getElementById('project-lightbox-image');
const lightboxTitle = document.getElementById('project-lightbox-title');
const lightboxCaption = document.getElementById('project-lightbox-caption');
const lightboxPrev = document.getElementById('project-lightbox-prev');
const lightboxNext = document.getElementById('project-lightbox-next');
const lightboxClose = document.getElementById('project-lightbox-close');
let activeGallery = 'tradegrid';
let activeImageIndex = 0;

function showProjectScreenshot() {
    const gallery = projectGalleries[activeGallery];
    const slide = gallery.slides[activeImageIndex];
    lightboxImage.src = slide.src;
    lightboxImage.alt = slide.alt;
    lightboxTitle.textContent = gallery.title;
    lightboxCaption.textContent = `${slide.label} · ${activeImageIndex + 1} of ${gallery.slides.length}`;
    lightboxPrev.hidden = gallery.slides.length < 2;
    lightboxNext.hidden = gallery.slides.length < 2;
}

function moveProjectScreenshot(direction) {
    const count = projectGalleries[activeGallery].slides.length;
    activeImageIndex = (activeImageIndex + direction + count) % count;
    showProjectScreenshot();
}

document.querySelectorAll('[data-gallery]').forEach(button => {
    button.addEventListener('click', () => {
        const galleryName = button.dataset.gallery;
        if (!projectGalleries[galleryName]) return;
        activeGallery = galleryName;
        activeImageIndex = Number(button.dataset.index) || 0;
        showProjectScreenshot();
        if (typeof projectLightbox.showModal === 'function') {
            projectLightbox.showModal();
        }
    });
});

lightboxPrev.addEventListener('click', () => moveProjectScreenshot(-1));
lightboxNext.addEventListener('click', () => moveProjectScreenshot(1));
lightboxClose.addEventListener('click', () => projectLightbox.close());

projectLightbox.addEventListener('click', event => {
    if (event.target === projectLightbox) projectLightbox.close();
});

projectLightbox.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') {
        event.preventDefault();
        moveProjectScreenshot(-1);
    } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        moveProjectScreenshot(1);
    }
});


// Contact form creates an email draft; the visitor sends it in their email app.
const contactForm = document.getElementById('contact-form');
const contactStatus = document.getElementById('contact-form-status');

if (contactForm) {
    contactForm.addEventListener('submit', event => {
        event.preventDefault();

        if (!contactForm.reportValidity()) return;

        const details = new FormData(contactForm);
        const senderName = String(details.get('name') || '').trim();
        const senderEmail = String(details.get('email') || '').trim();
        const subject = String(details.get('subject') || '').trim();
        const message = String(details.get('message') || '').trim();

        if (!senderName || !senderEmail || !subject || !message) {
            contactStatus.textContent = 'Please complete all the fields before continuing.';
            return;
        }

        const body = `${message}\n\nFrom: ${senderName}\nReply to: ${senderEmail}`;
        const draft = `mailto:khethukhanyom@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        contactStatus.textContent = 'Your email app should open with a draft. Please review and send it there.';
        window.location.href = draft;
    });
}

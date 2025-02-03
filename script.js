document.addEventListener("DOMContentLoaded", function () {
    // Utility: Get URL parameters
    function getQueryParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // Set couple names and guest name from URL or defaults
    document.getElementById('coupleNames').textContent = getQueryParameter('couple') || 'Andzar & Feni';
    document.getElementById('guestName').textContent = getQueryParameter('guest') || 'Nama Tamu';

    // Invitation and Music Logic
    const openButton = document.getElementById('openButton');
    const invitationCover = document.getElementById('invitationCover');
    const invitationContent = document.getElementById('invitationContent');
    const backgroundMusic = document.getElementById('backgroundMusic');
    const playPauseButton = document.getElementById('playPauseButton');
    const audioControls = document.getElementById('audioControl');
    let isPlaying = false;

    // Function to toggle play/pause for music
    function togglePlayPause() {
        if (isPlaying) {
            backgroundMusic.pause();
        } else {
            backgroundMusic.play();
        }
        isPlaying = !isPlaying;
        playPauseButton.src = isPlaying ? 'pause.png' : 'play-button.png';
    }

    // Event: Open invitation
    openButton.addEventListener('click', function () {
        invitationCover.style.display = 'none';
        invitationContent.style.display = 'block';
        audioControls.style.display = 'block'; // Show audio controls
        togglePlayPause();
    });

    // Event: Play/Pause music
    playPauseButton.addEventListener('click', togglePlayPause);

    document.getElementById('goToSection3').addEventListener('click', function() {
        const section3 = document.getElementById('section3');
        if (section3) {
            section3.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
    
    
    // Countdown Timer Logic
    function calculateCountdown() {
        const weddingDate = new Date('2025-02-10T10:00:00');
        const currentDate = new Date();
        let timeRemaining = weddingDate - currentDate;

        if (timeRemaining <= 0) {
            clearInterval(intervalId);
            timeRemaining = 0;
        }

        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = days;
        document.getElementById('hours').textContent = hours;
        document.getElementById('minutes').textContent = minutes;
        document.getElementById('seconds').textContent = seconds;
    }

    const intervalId = setInterval(calculateCountdown, 1000);
    calculateCountdown();

    // Copy Account Details Logic
    function copyAccountDetails(event) {
        const accountDetails = event.target.previousElementSibling.innerText;
        navigator.clipboard.writeText(accountDetails)
            .then(() => alert('Account details copied!'))
            .catch(err => console.error('Failed to copy: ', err));
    }

    document.querySelectorAll('.copyButton').forEach(button => {
        button.addEventListener('click', copyAccountDetails);
    });

    // Animation Observer
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    document.querySelectorAll('.fade-in, .fade-slide').forEach(element => observer.observe(element));

    // Message Form Logic
    const messageForm = document.getElementById('messageForm');

    function loadMessages() {
        fetch('https://andzar-feni2.glitch.me/messages')
            .then(response => response.json())
            .then(data => {
                const messageList = document.getElementById('messageList');
                if (messageList) {
                    messageList.innerHTML = '';
                    data.forEach(msg => {
                        const messageItem = document.createElement('div');
                        messageItem.classList.add('message');

                        const authorElement = document.createElement('div');
                        authorElement.classList.add('message-author');
                        authorElement.textContent = msg.name;

                        const contentElement = document.createElement('div');
                        contentElement.classList.add('message-content');
                        contentElement.textContent = msg.message;

                        const bodyElement = document.createElement('div');
                        bodyElement.classList.add('message-body');
                        bodyElement.append(authorElement, contentElement);

                        messageItem.appendChild(bodyElement);
                        messageList.appendChild(messageItem);
                    });
                }
            })
            .catch(error => console.error('Error:', error));
    }

    if (messageForm) {
        messageForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('formGuestName').value;
            const message = document.getElementById('guestMessage').value;

            fetch('https://andzar-feni2.glitch.me/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, message })
            })
                .then(response => response.json())
                .then(() => {
                    loadMessages();
                    messageForm.reset();
                })
                .catch(error => console.error('Error:', error));
        });
    }

    window.onload = loadMessages;
});

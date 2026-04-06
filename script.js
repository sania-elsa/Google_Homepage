document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchContainer = document.querySelector('.search-container');
    const historyDropdown = document.getElementById('search-history-dropdown');
    const historyList = document.getElementById('history-list');
    const googleSearchBtn = document.getElementById('google-search-btn');
    const luckyBtn = document.getElementById('lucky-btn');
    const fileUploadInput = document.getElementById('file-upload');
    const cameraBtn = document.getElementById('camera-btn');
    const micBtn = document.getElementById('mic-btn');

    // 1. LocalStorage based History Logic
    let history = JSON.parse(localStorage.getItem('googleSearchHistory')) || [];

    const saveHistory = () => {
        localStorage.setItem('googleSearchHistory', JSON.stringify(history));
    };

    const renderHistory = () => {
        historyList.innerHTML = '';
        if (history.length === 0) {
            historyDropdown.classList.remove('active');
            searchContainer.classList.remove('active');
            return;
        }

        history.forEach((term, index) => {
            const li = document.createElement('li');
            li.classList.add('history-item');

            li.innerHTML = `
                <svg focusable="false" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"></path></svg>
                <div class="history-item-text">${term}</div>
                <div class="history-delete" data-index="${index}">Delete</div>
            `;

            // Click term to autofill and search
            li.querySelector('.history-item-text').addEventListener('click', () => {
                searchInput.value = term;
                hideDropdown();
                performSearch(term);
            });

            // Delete specific history item
            li.querySelector('.history-delete').addEventListener('click', (e) => {
                e.stopPropagation();
                history.splice(index, 1);
                saveHistory();
                renderHistory();
            });

            historyList.appendChild(li);
        });

        historyDropdown.classList.add('active');
        searchContainer.classList.add('active');
    };

    const hideDropdown = () => {
        // Slight delay to allow clicks on dropdown elements to register before hiding
        setTimeout(() => {
            historyDropdown.classList.remove('active');
            searchContainer.classList.remove('active');
        }, 200);
    };

    const addSearchTerm = (term) => {
        term = term.trim();
        if (!term) return;

        // Remove if exists to move it to the latest position at top
        const existingIndex = history.indexOf(term);
        if (existingIndex !== -1) {
            history.splice(existingIndex, 1);
        }

        history.unshift(term);

        // Keep max 8 items in history
        if (history.length > 8) {
            history.pop();
        }

        saveHistory();
    };

    const performSearch = (term) => {
        if (!term.trim()) return;
        addSearchTerm(term);
        console.log("Searching for:", term);
        searchInput.blur();
        // Clear input after search just to test returning to empty string (optional)
        // searchInput.value = '';
    };

    // Event Listeners for Search Input
    searchInput.addEventListener('focus', () => {
        if (history.length > 0) {
            renderHistory();
        }
    });

    searchInput.addEventListener('blur', hideDropdown);

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            performSearch(searchInput.value);
            hideDropdown();
        }
    });

    googleSearchBtn.addEventListener('click', () => {
        performSearch(searchInput.value);
    });

    luckyBtn.addEventListener('click', () => {
        if (searchInput.value) {
            console.log("Feeling lucky for:", searchInput.value);
            addSearchTerm(searchInput.value);
            searchInput.blur();
        }
    });

    // 2. Camera Icon: File Upload Simulation
    cameraBtn.addEventListener('click', () => {
        fileUploadInput.click();
    });

    fileUploadInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            const fileName = e.target.files[0].name;
            searchInput.value = `[Image File: ${fileName}]`;
        }
    });

    // Plus Icon Popups (Upload Image, Upload File)
    const popupItems = document.querySelectorAll('.popup-item');
    popupItems.forEach(item => {
        item.addEventListener('click', () => {
            fileUploadInput.click();
        });
    });

    // 3. Microphone Icon: Voice Input via Web Speech API
    micBtn.addEventListener('click', () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Your browser does not support the Web Speech API.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        searchInput.value = '';
        searchInput.placeholder = "Listening...";
        micBtn.style.backgroundColor = "#f1f3f4"; // visual feedback

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            searchInput.value = transcript;
            searchInput.placeholder = "";
            micBtn.style.backgroundColor = "";

            // Optionally auto-search after voice input:
            // performSearch(transcript); 
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            searchInput.placeholder = "";
            micBtn.style.backgroundColor = "";
            alert("Voice recognition stopped or failed: " + event.error);
        };

        recognition.onend = () => {
            searchInput.placeholder = "";
            micBtn.style.backgroundColor = "";
        };

        recognition.start();
    });
});
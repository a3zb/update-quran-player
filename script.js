// DOM Elements
const homePage = document.getElementById('homePage');
const songDetailPage = document.getElementById('songDetailPage');
const playerPage = document.getElementById('playerPage');
const songListElement = document.getElementById('songList');
const searchInput = document.getElementById('searchInput');
const readingPage = document.getElementById('readingPage');
const readingContent = document.getElementById('readingContent');
const readingSurahTitle = document.getElementById('readingSurahTitle');
const menuBtn = document.getElementById('menuBtn');
const sideMenu = document.getElementById('sideMenu');
const closeMenuBtn = document.getElementById('closeMenuBtn');
const navHome = document.getElementById('navHome');
const navReading = document.getElementById('navReading');
const navFavorites = document.getElementById('navFavorites');
const navSettings = document.getElementById('navSettings');
const settingsPage = document.getElementById('settingsPage');
const backToHomeFromSettingsBtn = document.getElementById('backToHomeFromSettingsBtn');
const btnShowHowTo = document.getElementById('btnShowHowTo');
const btnShowContact = document.getElementById('btnShowContact');
const syncPage = document.getElementById('syncPage');
const backFromSyncBtn = document.getElementById('backFromSyncBtn');
const markVerseBtn = document.getElementById('markVerseBtn');
const syncSurahTitle = document.getElementById('syncSurahTitle');
const syncCurrentVerseNum = document.getElementById('syncCurrentVerseNum');
const syncTotalVerses = document.getElementById('syncTotalVerses');
const syncVerseText = document.getElementById('syncVerseText');
const syncNextVerseText = document.getElementById('syncNextVerseText');
const syncStepBackBtn = document.getElementById('syncStepBackBtn');
const syncPlayPauseBtn = document.getElementById('syncPlayPauseBtn');
const syncSeekBackBtn = document.getElementById('syncSeekBackBtn');
const syncResultArea = document.getElementById('syncResultArea');
const syncOutputJson = document.getElementById('syncOutputJson');
const copySyncResult = document.getElementById('copySyncResult');

let syncCurrentIndex = 0;
let syncData = [];
let isSyncing = false;

const backToHomeFromDetailBtn = document.getElementById('backToHomeFromDetailBtn');
const backToHomeBtn = document.getElementById('backToHomeBtn'); // Back button from player to home
const bodyElement = document.body;

const backgroundVideoContainer = document.querySelector('.video-background-container');
const backgroundVideo = document.getElementById('backgroundVideo');

// Elements for Song Detail Page (not used immediately on click, but still loaded)
const detailAlbumArt = document.getElementById('detailAlbumArt');
const detailTrackTitle = document.getElementById('detailTrackTitle');
const detailTrackArtist = document.getElementById('detailTrackArtist');
const detailAlbumName = document.getElementById('detailAlbumName');
const playFromDetailBtn = document.getElementById('playFromDetailBtn'); // Play button in detail page

const audioPlayer = document.getElementById('audioPlayer');
const albumArtPlayer = document.getElementById('albumArt');
const playerTrackTitle = document.getElementById('playerTrackTitle');
const playerTrackArtist = document.getElementById('playerTrackArtist');
const lyricsContainer = document.getElementById('lyricsContainer');

const playerProgressBarContainer = document.getElementById('playerProgressBarContainer');
const playerProgressBar = document.getElementById('playerProgressBar');
const playerCurrentTime = document.getElementById('playerCurrentTime');
const playerTotalDuration = document.getElementById('playerTotalDuration');

const playerPrevBtn = document.getElementById('playerPrevBtn');
const playerPlayPauseBtn = document.getElementById('playerPlayPauseBtn');
const playerNextBtn = document.getElementById('playerNextBtn');
const playerRepeatBtn = document.getElementById('playerRepeatBtn');
const playerShuffleBtn = document.getElementById('playerShuffleBtn');
const playerVolumeSlider = document.getElementById('playerVolumeSlider');
// --- Bookmarks UI elements ---
const addBookmarkBtn = document.getElementById('addBookmarkBtn');
const toggleBookmarksBtn = document.getElementById('toggleBookmarksBtn');
const bookmarksPanel = document.getElementById('bookmarksPanel');
const bookmarksList = document.getElementById('bookmarksList');
const closeBookmarksBtn = document.getElementById('closeBookmarksBtn');
// --- Favorite Surah button ---
const favoriteSurahBtn = document.getElementById('favoriteSurahBtn');
// --- Right action bar buttons ---
const actionFavoritesBtn = document.getElementById('actionFavorites');
const actionHowToBtn = document.getElementById('actionHowTo');
const actionContactBtn = document.getElementById('actionContact');
const helpContent = document.getElementById('helpContent');
const contactContent = document.getElementById('contactContent');
const closeHelpBtn = document.querySelector('.close-help');
const closeContactBtn = document.querySelector('.close-contact');
const downloadSurahBtn = document.getElementById('downloadSurahBtn');

// App State
// --- Player State (restored) ---
let currentSongIndex = 0;
let isPlaying = false;
const playerSkipBackBtn = document.getElementById('playerSkipBackBtn');
const playerSkipForwardBtn = document.getElementById('playerSkipForwardBtn');
const decreaseLyricsFont = document.getElementById('decreaseLyricsFont');
const increaseLyricsFont = document.getElementById('increaseLyricsFont');
const lyricsFontSizeValue = document.getElementById('lyricsFontSizeValue');

let lyricsFontSize = 100; // Default percentage
let currentReadingIndex = 0;
let totalQuranVerses = 0;
let khatmahPlan = null; // { days: number, dailyTarget: number, startDate: timestamp, currentDay: number }
let allVersesFlat = []; // Cached flat list of verses: { surahIndex, verseIndex, text }
// Favorite-only filter state (since the checkbox under search was removed)
let favoriteOnlyState = false;


// --- Page Navigation ---
function hideAllPages() {
    homePage.classList.remove('active');
    playerPage.classList.remove('active');
    songDetailPage.classList.remove('active');
    if (readingPage) readingPage.classList.remove('active');
    if (settingsPage) settingsPage.classList.remove('active');
    if (syncPage) syncPage.classList.remove('active');
}

function showSettingsPage() {
    hideAllPages();
    settingsPage.classList.add('active');
    closeSidebar();
}

function showSyncPage() {
    hideAllPages();
    syncPage.classList.add('active');
    isSyncing = true;
    startSyncMode();
}

function showHomePage() {
    hideAllPages();
    homePage.classList.add('active');

    bodyElement.classList.remove('player-active-bg');
    bodyElement.classList.remove('detail-active-bg');
    backgroundVideoContainer.classList.remove('active'); // Hide background video
    backgroundVideo.pause(); // Pause background video
    backgroundVideo.src = ""; // Clear video src
    backgroundVideo.load();
    // Do not pauseTrack here if it's already playing, unless explicitly desired
}

function showReadingPage(surahIndex = 0) {
    currentReadingIndex = surahIndex;
    const song = songs[currentReadingIndex];

    hideAllPages();
    if (readingPage) readingPage.classList.add('active');

    renderReadingContent(song);
    updateKhatmahUI();
    closeSidebar();
}

function renderReadingContent(song) {
    if (!song) return;
    readingSurahTitle.textContent = song.title;
    readingContent.innerHTML = '';

    if (song.lyrics && song.lyrics.length > 0) {
        song.lyrics.forEach((lyric, idx) => {
            const verseDiv = document.createElement('div');
            verseDiv.className = 'verse-item';
            verseDiv.innerHTML = `
                <span class="verse-num-badge">${idx + 1}</span>
                <span class="verse-text">${lyric.text}</span>
            `;
            readingContent.appendChild(verseDiv);
        });
    } else {
        readingContent.innerHTML = '<p>الآيات غير متوفرة لهذه السورة حالياً.</p>';
    }
}

function openSidebar() {
    sideMenu.classList.add('active');
    // Create overlay if not exists
    let overlay = document.querySelector('.menu-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'menu-overlay';
        document.body.appendChild(overlay);
        overlay.addEventListener('click', closeSidebar);
    }
    overlay.classList.add('active');
}

function closeSidebar() {
    sideMenu.classList.remove('active');
    const overlay = document.querySelector('.menu-overlay');
    if (overlay) overlay.classList.remove('active');
}

// Function to show song detail page (maintained but not called from song list click)
function showSongDetailPage(song) {
    hideAllPages();
    songDetailPage.classList.add('active');

    detailAlbumArt.src = song.albumArtUrl;
    detailTrackTitle.textContent = song.title;

    // Split artist name into main artist and second artist
    const artistParts = song.artist.split('|').map(part => part.trim());
    detailTrackArtist.textContent = artistParts[0] || song.artist;

    // Set second artist if available
    const detailSecondArtist = document.getElementById('detailTrackSecondArtist');
    if (artistParts[1]) {
        detailSecondArtist.textContent = artistParts[1];
    } else {
        detailSecondArtist.textContent = "";
    }

    detailAlbumName.textContent = song.album || "";

    bodyElement.classList.remove('player-active-bg');
    bodyElement.classList.add('detail-active-bg');
    backgroundVideoContainer.classList.remove('active');
    backgroundVideo.pause(); // Jeda video background
    backgroundVideo.src = ""; // Kosongkan src video
    backgroundVideo.load();
}

function showPlayerPage() {
    hideAllPages();
    playerPage.classList.add('active');

    bodyElement.classList.remove('detail-active-bg');
    bodyElement.classList.add('player-active-bg');
    backgroundVideoContainer.classList.add('active'); // Tampilkan video background

    const currentSong = songs[currentSongIndex];
    if (currentSong && currentSong.videoBgSrc) {
        backgroundVideo.src = currentSong.videoBgSrc;
        backgroundVideo.load();
        backgroundVideo.play().catch(e => console.error("Error playing video background:", e));
    } else {
        backgroundVideo.src = "";
        backgroundVideo.load(); // Kosongkan src jika tidak ada video khusus
    }
}

// --- Home Page Logic ---
function renderSongList(filteredSongs = songs, searchTerm = '', searchType = 'all') {
    songListElement.innerHTML = '';
    if (filteredSongs.length === 0) {
        songListElement.innerHTML = '<li class="no-results">لا توجد نتائج مطابقة</li>';
        return;
    }

    filteredSongs.forEach((song, index) => {
        const listItem = document.createElement('li');
        listItem.setAttribute('data-id', song.id);

        // Highlight matching text in title and artist
        let titleHtml = song.title;
        let artistHtml = song.artist;

        if (searchTerm && (searchType === 'all' || searchType === 'surah')) {
            titleHtml = highlightText(song.title, searchTerm);
        }
        if (searchTerm && (searchType === 'all' || searchType === 'reader')) {
            artistHtml = highlightText(song.artist, searchTerm);
        }

        listItem.innerHTML = `
            <img src="${song.albumArtUrl}" alt="${song.title}" class="song-art-list">
            <div class="song-info-list">
                <h3>${titleHtml} ${isSurahFavorite(song.id) ? '<i class="fas fa-heart fav-icon-list"></i>' : ''}</h3>
                <p>${artistHtml}</p>
                ${song.hasMatchingVerses ?
                `<div class="matching-verses">
                        ${song.matchingVerses.slice(0, 2).map(verse =>
                    `<div class="matching-verse" data-time="${verse.time}">${highlightText(verse.text, searchTerm)}</div>`
                ).join('')}
                        ${song.matchingVerses.length > 2 ?
                    `<div class="more-verses">+${song.matchingVerses.length - 2} آيات أخرى</div>` : ''}
                    </div>` : ''}
            </div>
        `;
        listItem.addEventListener('click', (e) => {
            // If user clicked a specific matching verse, handle via verse handler below
            const verseEl = e.target.closest('.matching-verse');
            if (verseEl && verseEl.hasAttribute('data-time')) {
                const startTime = parseFloat(verseEl.getAttribute('data-time')) || 0;
                const realIndex = songs.findIndex(s => s.id === song.id);
                currentSongIndex = realIndex >= 0 ? realIndex : index;
                playSongFromTime(songs[currentSongIndex], startTime);
                showPlayerPage();
                return;
            }

            const realIndex = songs.findIndex(s => s.id === song.id);
            currentSongIndex = realIndex >= 0 ? realIndex : index;
            // If searching verses and this song has matches, start from the first match
            if (searchType === 'verse' && song.hasMatchingVerses && song.matchingVerses.length > 0) {
                const playStart = document.querySelector('input[name="playStart"]:checked')?.value || 'verse';
                if (playStart === 'verse') {
                    const startTime = parseFloat(song.matchingVerses[0].time) || 0;
                    playSongFromTime(songs[currentSongIndex], startTime);
                } else {
                    loadSong(songs[currentSongIndex]);
                    playTrack();
                }
            } else {
                loadSong(songs[currentSongIndex]);
                playTrack();
            }
            showPlayerPage();
        });
        listItem.addEventListener('mouseenter', () => {
            if (homePage.classList.contains('active') && song.videoBgSrc) {
                backgroundVideo.src = song.videoBgSrc;
                backgroundVideo.load();
                backgroundVideoContainer.classList.add('active');
                backgroundVideo.play().catch(e => console.error("Error playing video on hover:", e));
                bodyElement.classList.add('player-active-bg');
            }
        });
        listItem.addEventListener('mouseleave', () => {
            if (homePage.classList.contains('active')) {
                backgroundVideoContainer.classList.remove('active');
                backgroundVideo.pause();
                backgroundVideo.src = "";
                backgroundVideo.load();
                bodyElement.classList.remove('player-active-bg');
            }
        });
        listItem.style.animationDelay = `${index * 0.05}s`;
        songListElement.appendChild(listItem);
    });
}

// Build a regex that matches a term regardless of Arabic diacritics (tashkeel)
// It inserts an optional diacritics class between each character.
// Arabic diacritics range: \u064B-\u0652 and \u0670 (alif khanjariya)
function buildArabicDiacriticInsensitiveRegex(term) {
    if (!term) return null;
    // Escape regex special chars
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Insert optional diacritics class between every token char
    const diacs = "[\u064B-\u0652\u0670]*";
    const pattern = escaped
        // Allow whitespace variations
        .replace(/\s+/g, "\\s+")
        // Insert optional diacritics after each char
        .split("")
        .map(ch => `${ch}${diacs}`)
        .join("");
    try {
        return new RegExp(`(${pattern})`, 'giu');
    } catch (e) {
        // Fallback to simple, safe regex
        return new RegExp(`(${escaped})`, 'giu');
    }
}

// Helper function to highlight search terms in text (Arabic diacritic-insensitive)
function highlightText(text, term) {
    if (!term) return text;
    const regex = buildArabicDiacriticInsensitiveRegex(term);
    if (!regex) return text;
    return text.replace(regex, '<span class="search-highlight">$1</span>');
}

// --- Search Functionality ---

// Play from a specific time (e.g., when a verse is clicked)
function playSongFromTime(song, startTime = 0) {
    // Load song metadata and UI
    loadSong(song);

    const seekAndPlay = () => {
        try {
            audioPlayer.currentTime = Math.max(0, Number(startTime) || 0);
        } catch (e) {
            // Some browsers may require canplay; ignore here
        }
        isPlaying = true;
        audioPlayer.play().catch(err => console.error('Error play after seek:', err));
        updatePlayPauseIcon();
    };

    if (audioPlayer.readyState >= 1) {
        // Metadata is available
        seekAndPlay();
    } else {
        const onLoaded = () => {
            seekAndPlay();
        };
        audioPlayer.addEventListener('loadedmetadata', onLoaded, { once: true });
        audioPlayer.addEventListener('canplay', onLoaded, { once: true });
    }

    // Force a scroll to the verse in the lyrics container after a short delay
    setTimeout(() => {
        const activeVerse = lyricsContainer.querySelector(`.lyric-line[data-time="${startTime}"]`);
        if (activeVerse) {
            activeVerse.scrollIntoView({ behavior: 'smooth', block: 'center' });
            activeVerse.classList.add('highlight');
        }
    }, 500);
}
function filterSongs(searchTerm, searchType = 'all') {
    if (!searchTerm) {
        return songs;
    }
    const regex = buildArabicDiacriticInsensitiveRegex(searchTerm);
    if (!regex) return songs;

    return songs
        .map(song => {
            const songCopy = { ...song };
            let matches = false;

            // Title (surah) matching
            if (searchType === 'all' || searchType === 'surah') {
                if (song.title && regex.test(song.title)) {
                    matches = true;
                }
                regex.lastIndex = 0;
            }

            // Reader (artist) matching
            if (searchType === 'all' || searchType === 'reader') {
                if (song.artist && regex.test(song.artist)) {
                    matches = true;
                }
                regex.lastIndex = 0;
            }

            // Verse matching
            if (searchType === 'all' || searchType === 'verse') {
                if (Array.isArray(song.lyrics)) {
                    const matchingLyrics = song.lyrics.filter(l => {
                        if (!l || !l.text) return false;
                        const ok = regex.test(l.text);
                        regex.lastIndex = 0;
                        return ok;
                    });
                    if (matchingLyrics.length > 0) {
                        if (searchType === 'verse') {
                            songCopy.hasMatchingVerses = true;
                            songCopy.matchingVerses = matchingLyrics.slice();
                        }
                        matches = true;
                    }
                }
            }

            return matches ? songCopy : null;
        })
        .filter(Boolean);
}

function updateSearchResults() {
    const searchTerm = searchInput.value.trim();
    const searchType = document.querySelector('input[name="searchType"]:checked')?.value || 'all';
    const favoriteOnlyToggle = document.getElementById('favoriteOnlyToggle');
    // Use global state if checkbox is not present (we removed it from the DOM)
    const favoriteOnly = favoriteOnlyToggle ? !!favoriteOnlyToggle.checked : favoriteOnlyState;

    let filteredSongs = filterSongs(searchTerm, searchType);
    if (favoriteOnly) {
        const favIds = readFavoriteSurahIds();
        filteredSongs = filteredSongs.filter(s => favIds.includes(s.id));
    }

    // Update the song list with filtered results and search context
    renderSongList(filteredSongs, searchTerm, searchType);
}

// Add event listeners for search
if (searchInput) {
    searchInput.addEventListener('input', updateSearchResults);

    // Add event delegation for search type radio buttons
    document.addEventListener('change', (e) => {
        if (e.target.name === 'searchType') {
            updateSearchResults();
            // Toggle play start options based on selected search type
            const playStartOptions = document.getElementById('playStartOptions');
            if (playStartOptions) {
                playStartOptions.style.display = (e.target.value === 'verse') ? 'flex' : 'none';
            }
        }
    });
    // Favorite-only toggle
    const favoriteOnlyToggle = document.getElementById('favoriteOnlyToggle');
    if (favoriteOnlyToggle) {
        favoriteOnlyToggle.addEventListener('change', updateSearchResults);
    }

    // Initial toggle state for playStartOptions
    (function initPlayStartOptionsVisibility() {
        const playStartOptions = document.getElementById('playStartOptions');
        if (!playStartOptions) return;
        const currentType = document.querySelector('input[name="searchType"]:checked')?.value || 'all';
        playStartOptions.style.display = (currentType === 'verse') ? '' : 'none';
    })();

    // Wire search button click to run the same search
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            updateSearchResults();
        });
    }
}

// Side Menu Favorites wiring
if (navFavorites) {
    navFavorites.addEventListener('click', (e) => {
        e.preventDefault();
        // Toggle internal state
        favoriteOnlyState = !favoriteOnlyState;

        // Update UI of the menu item
        if (favoriteOnlyState) {
            navFavorites.classList.add('active-filter');
            navFavorites.querySelector('i').className = 'fas fa-heart';
            navFavorites.querySelector('span').textContent = 'عرض الكل';
        } else {
            navFavorites.classList.remove('active-filter');
            navFavorites.querySelector('i').className = 'far fa-heart';
            navFavorites.querySelector('span').textContent = 'المفضلة';
        }

        updateSearchResults();
        showHomePage();
        closeSidebar();
    });
}

// Settings Page Buttons
if (btnShowHowTo) {
    btnShowHowTo.addEventListener('click', () => {
        if (helpContent) {
            helpContent.classList.add('active');
            helpContent.style.display = 'flex';
        }
    });
}

if (btnShowContact) {
    btnShowContact.addEventListener('click', () => {
        if (contactContent) {
            contactContent.classList.add('active');
            contactContent.style.display = 'flex';
        }
    });
}

if (backToHomeFromSettingsBtn) {
    backToHomeFromSettingsBtn.addEventListener('click', showHomePage);
}

if (navSettings) {
    navSettings.addEventListener('click', (e) => {
        e.preventDefault();
        showSettingsPage();
    });
}

// Sync Mode Logic Implementation
function startSyncMode() {
    const song = songs[currentSongIndex];
    if (!song) return;

    syncSurahTitle.textContent = song.title;
    syncTotalVerses.textContent = song.lyrics.length;
    syncCurrentIndex = 0;
    syncData = [];
    syncResultArea.style.display = 'none';

    updateSyncPreview();

    // Play the song
    loadSong(song);
    playTrack();
}

function updateSyncPreview() {
    const song = songs[currentSongIndex];
    if (syncCurrentIndex < song.lyrics.length) {
        syncCurrentVerseNum.textContent = syncCurrentIndex + 1;
        syncVerseText.textContent = song.lyrics[syncCurrentIndex].text;

        // Show next verse preview if available
        if (syncCurrentIndex + 1 < song.lyrics.length) {
            syncNextVerseText.textContent = song.lyrics[syncCurrentIndex + 1].text;
        } else {
            syncNextVerseText.textContent = "(هذه آخر آية في السورة)";
        }
    } else {
        finishSync();
    }
}

function markVerse() {
    if (!isSyncing || syncCurrentIndex >= songs[currentSongIndex].lyrics.length) return;

    const time = parseFloat(audioPlayer.currentTime.toFixed(2));
    const originalText = songs[currentSongIndex].lyrics[syncCurrentIndex].text;

    syncData.push({ time: time, text: originalText });

    syncCurrentIndex++;
    updateSyncPreview();
}

function stepBackSync() {
    if (syncCurrentIndex > 0) {
        syncCurrentIndex--;
        syncData.pop();
        updateSyncPreview();
    }
}


function finishSync() {
    isSyncing = false;
    syncVerseText.textContent = "اكتملت المزامنة!";
    syncResultArea.style.display = 'block';

    const output = JSON.stringify(syncData, null, 4);
    syncOutputJson.value = output;
}

if (markVerseBtn) {
    markVerseBtn.addEventListener('click', markVerse);
}

if (syncStepBackBtn) {
    syncStepBackBtn.addEventListener('click', stepBackSync);
}

if (syncPlayPauseBtn) {
    syncPlayPauseBtn.addEventListener('click', () => {
        if (audioPlayer.paused) {
            audioPlayer.play();
            syncPlayPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            audioPlayer.pause();
            syncPlayPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    });
}

if (syncSeekBackBtn) {
    syncSeekBackBtn.addEventListener('click', () => {
        audioPlayer.currentTime = Math.max(0, audioPlayer.currentTime - 5);
    });
}


if (backFromSyncBtn) {
    backFromSyncBtn.addEventListener('click', () => {
        isSyncing = false;
        pauseTrack();
        showHomePage();
    });
}

if (copySyncResult) {
    copySyncResult.addEventListener('click', () => {
        syncOutputJson.select();
        document.execCommand('copy');
        alert('تم نسخ الكود! يمكنك الآن لصقه في ملف البيانات.');
    });
}

// Global Spacebar listener for Syncing
document.addEventListener('keydown', (e) => {
    if (isSyncing && e.code === 'Space') {
        e.preventDefault();
        markVerse();
    }
});

// Add Sync Mode button to Settings page
const settingsContainer = document.querySelector('.settings-container');
if (settingsContainer) {
    // Check if group exists, if not create one for tools
    let toolsGroup = document.getElementById('settingsToolsGroup');
    if (!toolsGroup) {
        toolsGroup = document.createElement('div');
        toolsGroup.id = 'settingsToolsGroup';
        toolsGroup.className = 'settings-group';
        toolsGroup.innerHTML = '<h3>أدوات المطور</h3>';
        settingsContainer.appendChild(toolsGroup);
    }

    const syncBtn = document.createElement('button');
    syncBtn.className = 'settings-btn';
    syncBtn.innerHTML = '<i class="fas fa-magic"></i> <span>بدء مزامنة السورة الحالية</span>';
    syncBtn.onclick = () => {
        if (!songs[currentSongIndex]) {
            alert('يرجى اختيار سورة أولاً');
            return;
        }
        showSyncPage();
    };
    toolsGroup.appendChild(syncBtn);
}

if (closeHelpBtn && helpContent) {
    closeHelpBtn.addEventListener('click', () => {
        helpContent.classList.remove('active');
        helpContent.style.display = 'none';
    });
}
if (closeContactBtn && contactContent) {
    closeContactBtn.addEventListener('click', () => {
        contactContent.classList.remove('active');
        contactContent.style.display = 'none';
    });
}

// Close modals when clicking outside content
document.addEventListener('click', (e) => {
    if (helpContent && helpContent.classList.contains('active') && e.target === helpContent) {
        helpContent.classList.remove('active');
        helpContent.style.display = 'none';
    }
    if (contactContent && contactContent.classList.contains('active') && e.target === contactContent) {
        contactContent.classList.remove('active');
        contactContent.style.display = 'none';
    }
});

// Close modals with ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (helpContent) {
            helpContent.classList.remove('active');
            helpContent.style.display = 'none';
        }
        if (contactContent) {
            contactContent.classList.remove('active');
            contactContent.style.display = 'none';
        }
    }
});

// --- Player Logic ---
function loadSong(song) {
    if (!song) {
        console.error("Lagu tidak ditemukan!");
        albumArtPlayer.src = "https://placehold.co/100x100/3a3a4e/e0e0e0?text=Error";
        playerTrackTitle.textContent = "Lagu Tidak Tersedia";
        playerTrackArtist.textContent = "-";
        document.getElementById('playerTrackSecondArtist').textContent = "";
        lyricsContainer.innerHTML = "<p>Lirik tidak tersedia.</p>";
        audioPlayer.src = "";
        playerCurrentTime.textContent = "0:00";
        playerTotalDuration.textContent = "0:00";
        playerProgressBar.style.width = "0%";
        return;
    }
    albumArtPlayer.src = song.albumArtUrl;
    playerTrackTitle.textContent = song.title;

    // Split artist name into main artist and second artist
    const artistParts = song.artist.split('|').map(part => part.trim());
    playerTrackArtist.textContent = artistParts[0] || song.artist;

    // If there's a second part, show it as the second artist
    const secondArtistElement = document.getElementById('playerTrackSecondArtist');
    if (artistParts[1]) {
        secondArtistElement.textContent = artistParts[1];
    } else {
        secondArtistElement.textContent = "";
    }


    // Also update the detail page if it's the current page
    if (document.getElementById('detailTrackArtist')) {
        document.getElementById('detailTrackArtist').textContent = artistParts[0] || song.artist;
        const detailSecondArtist = document.getElementById('detailTrackSecondArtist');
        if (artistParts[1]) {
            detailSecondArtist.textContent = artistParts[1];
        } else {
            detailSecondArtist.textContent = "";
        }
    }

    renderLyrics(song.lyrics); // Panggil fungsi renderLyrics

    audioPlayer.src = song.audioSrc;

    audioPlayer.onloadedmetadata = () => {
        playerTotalDuration.textContent = formatTime(audioPlayer.duration);
    };
    audioPlayer.load();
    updatePlayPauseIcon();
    // Refresh bookmarks view if panel is open
    if (typeof renderBookmarks === 'function' && bookmarksPanel && bookmarksPanel.style.display === 'block') {
        renderBookmarks();
    }
    // Update favorite heart state
    if (typeof setFavoriteSurahUI === 'function') {
        setFavoriteSurahUI();
    }
}

// Function to render lyrics
function renderLyrics(lyrics) {
    lyricsContainer.innerHTML = ''; // Clear lyrics container
    if (!lyrics || lyrics.length === 0) {
        lyricsContainer.innerHTML = "<p>الآيات غير متوفرة لهذه السورة حالياً.</p>";
        return;
    }

    lyrics.forEach(line => {
        const span = document.createElement('span');
        span.textContent = line.text;
        span.setAttribute('data-time', line.time); // Simpan timestamp di data-attribute
        span.classList.add('lyric-line'); // Tambahkan kelas untuk styling
        lyricsContainer.appendChild(span);
        // Hapus penambahan <br> secara manual, gunakan CSS display:block atau flexbox
        // lyricsContainer.appendChild(document.createElement('br'));
    });
}


function playTrack() {
    if (!audioPlayer.src || audioPlayer.src === window.location.href) {
        if (songs.length > 0) {
            loadSong(songs[currentSongIndex]);
        } else {
            console.log("Tidak ada lagu untuk dimainkan.");
            return;
        }
    }
    isPlaying = true;
    audioPlayer.play().catch(error => console.error("Error saat play:", error));
    updatePlayPauseIcon();
}

function pauseTrack() {
    isPlaying = false;
    audioPlayer.pause();
    updatePlayPauseIcon();
}

function updatePlayPauseIcon() {
    if (isPlaying) {
        playerPlayPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        playerPlayPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
}

function prevTrack() {
    if (songs.length === 0) return;
    if (isShuffle) {
        playRandomTrack();
    } else {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    }
    loadSong(songs[currentSongIndex]);
    playTrack();
    showPlayerPage(); // Perbarui video background
}

function nextTrackLogic() {
    if (songs.length === 0) return;
    if (isShuffle) {
        playRandomTrack();
    } else {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
    }
    loadSong(songs[currentSongIndex]);
    playTrack();
    showPlayerPage(); // Perbarui video background
}

function nextTrack() {
    if (songs.length === 0) return;

    if (repeatMode === 1 && audioPlayer.ended) {
        // Handled by audio.loop = true
    } else if (isShuffle) {
        playRandomTrack();
    } else {
        currentSongIndex++;
        if (currentSongIndex >= songs.length) {
            if (repeatMode === 2) {
                currentSongIndex = 0;
            } else {
                currentSongIndex = songs.length - 1;
                loadSong(songs[currentSongIndex]);
                pauseTrack();
                audioPlayer.currentTime = audioPlayer.duration;
                return;
            }
        }
        loadSong(songs[currentSongIndex]);
        playTrack();
    }
    showPlayerPage(); // Perbarui video background
}

function playRandomTrack() {
    if (songs.length <= 1) {
        currentSongIndex = 0;
    } else {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * songs.length);
        } while (randomIndex === currentSongIndex);
        currentSongIndex = randomIndex;
    }
    loadSong(songs[currentSongIndex]);
    playTrack();
    showPlayerPage(); // Perbarui video background
}


audioPlayer.addEventListener('timeupdate', () => {
    if (audioPlayer.duration) {
        const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        playerProgressBar.style.width = `${progressPercent}%`;
        playerCurrentTime.textContent = formatTime(audioPlayer.currentTime);

        // Save playback state every 5 seconds
        if (Math.floor(audioPlayer.currentTime) % 5 === 0) {
            savePlaybackState();
        }

        // --- Logic highlight lirik ---
        const currentTime = audioPlayer.currentTime;
        const lyricLines = lyricsContainer.querySelectorAll('.lyric-line');
        let highlightedLine = null;

        lyricLines.forEach((line, index) => {
            const lineTime = parseFloat(line.getAttribute('data-time'));
            // Tentukan waktu berakhir baris lirik ini. Jika ini baris terakhir, anggap berakhir di akhir lagu.
            // Atau, lebih baik, anggap berakhir tepat sebelum baris berikutnya dimulai.
            let nextLineTime = Infinity;
            if (index + 1 < lyricLines.length) {
                nextLineTime = parseFloat(lyricLines[index + 1].getAttribute('data-time'));
            }

            if (currentTime >= lineTime && currentTime < nextLineTime) {
                line.classList.add('highlight');
                highlightedLine = line;
            } else {
                line.classList.remove('highlight');
            }
        });

        // --- Auto-scroll lirik hanya jika baris yang disorot tidak terlihat ---
        if (highlightedLine) {
            const containerRect = lyricsContainer.getBoundingClientRect();
            const lineRect = highlightedLine.getBoundingClientRect();

            // Periksa apakah baris di luar viewport kontainer
            const isOutsideTop = lineRect.top < containerRect.top;
            const isOutsideBottom = lineRect.bottom > containerRect.bottom;

            if (isOutsideTop || isOutsideBottom) {
                // Scroll agar baris terdekat muncul di dalam viewport, dengan animasi smooth
                highlightedLine.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    }
});

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

playerProgressBarContainer.addEventListener('click', (e) => {
    if (!audioPlayer.duration || songs.length === 0) return;
    const width = playerProgressBarContainer.clientWidth;
    const clickX = e.offsetX;
    audioPlayer.currentTime = (clickX / width) * audioPlayer.duration;
});

playerVolumeSlider.addEventListener('input', (e) => {
    audioPlayer.volume = e.target.value;
});


playerShuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    playerShuffleBtn.classList.toggle('active-feature', isShuffle);
    console.log("Shuffle: " + isShuffle);
});

playerRepeatBtn.addEventListener('click', () => {
    repeatMode = (repeatMode + 1) % 3;
    updateRepeatButtonUI();
    console.log("Repeat Mode: " + repeatMode);
});

function updateRepeatButtonUI() {
    playerRepeatBtn.classList.remove('active-feature');
    audioPlayer.loop = false;

    if (repeatMode === 0) {
        playerRepeatBtn.innerHTML = '<i class="fas fa-repeat"></i>';
    } else if (repeatMode === 1) {
        playerRepeatBtn.innerHTML = '<i class="fas fa-repeat-1"></i>';
        playerRepeatBtn.classList.add('active-feature');
        audioPlayer.loop = true;
    } else {
        playerRepeatBtn.innerHTML = '<i class="fas fa-repeat"></i>';
        playerRepeatBtn.classList.add('active-feature');
    }
}

playerPlayPauseBtn.addEventListener('click', () => {
    if (isPlaying) {
        pauseTrack();
    } else {
        playTrack();
    }
});
playerPrevBtn.addEventListener('click', prevTrack);
playerNextBtn.addEventListener('click', nextTrackLogic);

// --- New: Jump +/-10s controls ---
const back10Btn = document.getElementById('playerBack10Btn');
const fwd10Btn = document.getElementById('playerForward10Btn');
if (back10Btn) {
    back10Btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!isNaN(audioPlayer.currentTime)) {
            audioPlayer.currentTime = Math.max(0, audioPlayer.currentTime - 10);
        }
    });
}
if (fwd10Btn) {
    fwd10Btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!isNaN(audioPlayer.currentTime) && !isNaN(audioPlayer.duration)) {
            audioPlayer.currentTime = Math.min(audioPlayer.duration || audioPlayer.currentTime + 10, audioPlayer.currentTime + 10);
        }
    });
}

// --- New: Volume popover toggle ---
const volumeToggleBtn = document.getElementById('volumeToggleBtn');
const volumePopover = document.getElementById('volumePopover');
if (volumeToggleBtn && volumePopover) {
    volumeToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        volumePopover.classList.toggle('show');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!volumePopover.classList.contains('show')) return;
        const within = e.target.closest('.volume-control-player');
        if (!within) {
            volumePopover.classList.remove('show');
        }
    });
}

// --- New: Sleep Timer (with fade-out) ---
const sleepTimerBtn = document.getElementById('sleepTimerBtn');
const sleepTimerPopover = document.getElementById('sleepTimerPopover');
const sleepCancelBtn = document.getElementById('sleepCancelBtn');
const sleepRemainingEl = document.getElementById('sleepRemaining');
const sleepCustomMinutes = document.getElementById('sleepCustomMinutes');
const sleepStartCustomBtn = document.getElementById('sleepStartCustomBtn');
let sleepState = {
    endAt: null,
    intervalId: null,
    fadeStarted: false,
    originalVolume: null
};

function formatRemaining(ms) {
    const totalSec = Math.max(0, Math.floor(ms / 1000));
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

function clearSleepInterval() {
    if (sleepState.intervalId) {
        clearInterval(sleepState.intervalId);
        sleepState.intervalId = null;
    }
}

function cancelSleep() {
    clearSleepInterval();
    sleepState.endAt = null;
    sleepState.fadeStarted = false;
    if (sleepState.originalVolume != null) {
        audioPlayer.volume = sleepState.originalVolume;
    }
    sleepState.originalVolume = null;
    if (sleepRemainingEl) {
        sleepRemainingEl.style.display = 'none';
        sleepRemainingEl.textContent = '';
    }
    if (sleepCancelBtn) {
        sleepCancelBtn.disabled = true;
    }
}

function startSleep(minutes) {
    if (!audioPlayer) return;
    const now = Date.now();
    const durationMs = minutes * 60 * 1000;
    sleepState.endAt = now + durationMs;
    sleepState.fadeStarted = false;
    sleepState.originalVolume = audioPlayer.volume;

    if (sleepRemainingEl) {
        sleepRemainingEl.style.display = '';
    }
    if (sleepCancelBtn) {
        sleepCancelBtn.disabled = false;
    }

    const fadeMs = 8000; // fade-out duration in ms

    clearSleepInterval();
    sleepState.intervalId = setInterval(() => {
        const remaining = sleepState.endAt - Date.now();
        if (sleepRemainingEl) {
            sleepRemainingEl.textContent = `الوقت المتبقي: ${formatRemaining(remaining)}`;
        }

        if (remaining <= 0) {
            // Ensure volume is zero and stop playback
            audioPlayer.volume = 0;
            audioPlayer.pause();
            cancelSleep();
            if (sleepTimerPopover) sleepTimerPopover.classList.remove('show');
            return;
        }

        if (remaining <= fadeMs && !sleepState.fadeStarted) {
            sleepState.fadeStarted = true;
        }

        if (sleepState.fadeStarted) {
            const frac = Math.max(0, Math.min(1, remaining / fadeMs));
            const targetVol = (sleepState.originalVolume ?? 1) * frac;
            audioPlayer.volume = targetVol;
        }
    }, 250);
}

if (sleepTimerBtn && sleepTimerPopover) {
    // Toggle popover
    sleepTimerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sleepTimerPopover.classList.toggle('show');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!sleepTimerPopover.classList.contains('show')) return;
        const within = e.target.closest('.sleep-control-player');
        if (!within) {
            sleepTimerPopover.classList.remove('show');
        }
    });

    // Options
    const optionButtons = sleepTimerPopover.querySelectorAll('.sleep-option');
    optionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const min = Number(btn.getAttribute('data-min'));
            if (!isNaN(min) && min > 0) {
                startSleep(min);
            }
        });
    });

    if (sleepCancelBtn) {
        sleepCancelBtn.addEventListener('click', () => {
            cancelSleep();
        });
    }

    // Custom minutes start
    if (sleepStartCustomBtn) {
        sleepStartCustomBtn.addEventListener('click', () => {
            if (!sleepCustomMinutes) return;
            const val = Number(sleepCustomMinutes.value);
            if (!isNaN(val) && val >= 1 && val <= 600) {
                startSleep(val);
            } else {
                // Basic feedback via placeholder if invalid
                sleepCustomMinutes.value = '';
                sleepCustomMinutes.placeholder = 'أدخل رقمًا بين 1 و 600';
                sleepCustomMinutes.focus();
            }
        });
    }
    if (sleepCustomMinutes) {
        sleepCustomMinutes.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (sleepStartCustomBtn) sleepStartCustomBtn.click();
            }
        });
    }
}

// Auto-advance when a surah ends (respecting repeat/shuffle modes)
audioPlayer.addEventListener('ended', () => {
    if (repeatMode === 1) {
        // Repeat-one handled via audio.loop = true
        return;
    }
    nextTrack();
});

// --- Bookmarks (per surah) ---
function getCurrentSong() {
    return songs[currentSongIndex];
}

function bookmarksKeyForSong(song) {
    if (!song || song.id == null) return null;
    return `bookmarks:${song.id}`;
}

function readBookmarks(song) {
    const key = bookmarksKeyForSong(song);
    if (!key) return [];
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        console.warn('Failed to read bookmarks', e);
        return [];
    }
}

function writeBookmarks(song, arr) {
    const key = bookmarksKeyForSong(song);
    if (!key) return;
    try {
        localStorage.setItem(key, JSON.stringify(arr || []));
    } catch (e) {
        console.warn('Failed to write bookmarks', e);
    }
}

function findCurrentLyricTextAt(timeSec) {
    const lines = lyricsContainer ? lyricsContainer.querySelectorAll('.lyric-line') : [];
    let chosen = '';
    for (let i = 0; i < lines.length; i++) {
        const t = parseFloat(lines[i].getAttribute('data-time')) || 0;
        const nextT = (i + 1 < lines.length) ? parseFloat(lines[i + 1].getAttribute('data-time')) : Infinity;
        if (timeSec >= t && timeSec < nextT) {
            chosen = lines[i].textContent || '';
            break;
        }
        if (timeSec >= t) {
            chosen = lines[i].textContent || chosen;
        }
    }
    return chosen;
}

function renderBookmarks() {
    if (!bookmarksList) return;
    const song = getCurrentSong();
    const arr = readBookmarks(song);
    bookmarksList.innerHTML = '';
    if (!arr.length) {
        const li = document.createElement('li');
        li.textContent = 'لا توجد إشارات بعد';
        li.style.opacity = '0.8';
        bookmarksList.appendChild(li);
        return;
    }

    arr.forEach((bm, idx) => {
        const li = document.createElement('li');
        li.className = 'bookmark-item';

        const info = document.createElement('div');
        info.className = 'bookmark-info';
        const t = document.createElement('div');
        t.className = 'bookmark-time';
        t.textContent = formatTime(bm.time || 0);
        const txt = document.createElement('div');
        txt.className = 'bookmark-text';
        txt.textContent = bm.text || '';
        info.appendChild(t);
        info.appendChild(txt);

        const actions = document.createElement('div');
        actions.className = 'bookmark-actions';
        const playBtn = document.createElement('button');
        playBtn.className = 'bookmark-btn';
        playBtn.textContent = 'تشغيل';
        playBtn.addEventListener('click', () => {
            if (!isNaN(bm.time)) {
                if (audioPlayer) {
                    audioPlayer.currentTime = bm.time;
                    playTrack();
                }
            }
        });

        const delBtn = document.createElement('button');
        delBtn.className = 'bookmark-btn';
        delBtn.textContent = 'حذف';
        delBtn.addEventListener('click', () => {
            const song = getCurrentSong();
            const list = readBookmarks(song);
            list.splice(idx, 1);
            writeBookmarks(song, list);
            renderBookmarks();
        });

        actions.appendChild(playBtn);
        actions.appendChild(delBtn);

        li.appendChild(info);
        li.appendChild(actions);
        bookmarksList.appendChild(li);
    });
}

function addCurrentBookmark() {
    const song = getCurrentSong();
    if (!song) return;
    const time = Math.floor(audioPlayer.currentTime || 0);
    const text = findCurrentLyricTextAt(time);
    const list = readBookmarks(song);
    list.push({ time, text });
    writeBookmarks(song, list);
    renderBookmarks();
}

if (toggleBookmarksBtn && bookmarksPanel) {
    toggleBookmarksBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const show = bookmarksPanel.style.display !== 'block';
        bookmarksPanel.style.display = show ? 'block' : 'none';
        if (show) renderBookmarks();
    });
}
if (closeBookmarksBtn && bookmarksPanel) {
    closeBookmarksBtn.addEventListener('click', () => {
        bookmarksPanel.style.display = 'none';
    });
}
if (addBookmarkBtn) {
    addBookmarkBtn.addEventListener('click', addCurrentBookmark);
}

// --- Favorite Surah (per surah) ---
function readFavoriteSurahIds() {
    try {
        const raw = localStorage.getItem('favoriteSurahs');
        const arr = raw ? JSON.parse(raw) : [];
        return Array.isArray(arr) ? arr : [];
    } catch (e) {
        console.warn('Failed to read favoriteSurahs', e);
        return [];
    }
}

function writeFavoriteSurahIds(arr) {
    try {
        localStorage.setItem('favoriteSurahs', JSON.stringify(arr || []));
    } catch (e) {
        console.warn('Failed to write favoriteSurahs', e);
    }
}

function isSurahFavorite(id) {
    const list = readFavoriteSurahIds();
    return list.includes(id);
}

function toggleFavoriteSurah() {
    const song = getCurrentSong();
    if (!song || song.id == null) return;
    const list = readFavoriteSurahIds();
    const idx = list.indexOf(song.id);
    if (idx >= 0) {
        list.splice(idx, 1);
    } else {
        list.push(song.id);
    }
    writeFavoriteSurahIds(list);
    setFavoriteSurahUI();
}

function setFavoriteSurahUI() {
    if (!favoriteSurahBtn) return;
    const song = getCurrentSong();
    const fav = song && song.id != null ? isSurahFavorite(song.id) : false;
    favoriteSurahBtn.innerHTML = fav ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
    favoriteSurahBtn.title = fav ? 'إزالة من المفضلة' : 'سورة مفضلة';
}

if (favoriteSurahBtn) {
    favoriteSurahBtn.addEventListener('click', toggleFavoriteSurah);
}

// --- Dua al-Khatmah Logic ---
const duaKhatmahBtn = document.getElementById('duaKhatmahBtn');
if (duaKhatmahBtn) {
    duaKhatmahBtn.addEventListener('click', () => {
        // We can either play a specific audio or show a text modal
        // For now, let's play a famous Dua audio or just alert with text
        const duaAudioUrl = "https://ia801002.us.archive.org/21/items/dua-khatm-quran/dua.mp3"; // Example placeholder

        // Temporarily load this "virtual" song
        const duaSong = {
            id: 999,
            title: "دعاء ختم القرآن الكريم",
            artist: "الشيخ عبد الرحمن السديس",
            albumArtUrl: "https://placehold.co/200x200/3a3a4e/e0e0e0?text=Dua",
            audioSrc: duaAudioUrl,
            lyrics: [{ time: 0, text: "اللهم ارحمني بالقرآن واجعله لي إماما ونورا وهدى ورحمة" }]
        };

        loadSong(duaSong);
        playTrack();
        showPlayerPage();
    });
}

// Event Listeners for Side Menu
if (menuBtn) menuBtn.addEventListener('click', openSidebar);
if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeSidebar);
if (navHome) navHome.addEventListener('click', (e) => {
    e.preventDefault();
    showHomePage();
    closeSidebar();
});
if (navReading) navReading.addEventListener('click', (e) => {
    e.preventDefault();
    if (khatmahPlan) {
        showReadingPageWithKhatmah();
    } else {
        showReadingPage(currentSongIndex); // Start reading from current playing or first
    }
});

// Reading Page Controls
const backToHomeFromReadingBtn = document.getElementById('backToHomeFromReadingBtn');
if (backToHomeFromReadingBtn) backToHomeFromReadingBtn.addEventListener('click', showHomePage);

const listenFromReadingBtn = document.getElementById('listenFromReadingBtn');
if (listenFromReadingBtn) {
    listenFromReadingBtn.addEventListener('click', () => {
        currentSongIndex = currentReadingIndex;
        loadSong(songs[currentSongIndex]);
        playTrack();
        showPlayerPage();
    });
}

const prevSurahReading = document.getElementById('prevSurahReading');
const nextSurahReading = document.getElementById('nextSurahReading');

if (prevSurahReading) {
    prevSurahReading.addEventListener('click', () => {
        if (currentReadingIndex > 0) {
            showReadingPage(currentReadingIndex - 1);
            readingPage.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}
if (nextSurahReading) {
    nextSurahReading.addEventListener('click', () => {
        if (currentReadingIndex < songs.length - 1) {
            showReadingPage(currentReadingIndex + 1);
            readingPage.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
}

// Event Listeners untuk tombol navigasi
backToHomeFromDetailBtn.addEventListener('click', showHomePage); // Dari halaman detail ke home
backToHomeBtn.addEventListener('click', showHomePage); // Dari halaman player ke home

// Event Listener untuk tombol play dari halaman detail (jika Anda ingin menggunakannya)
playFromDetailBtn.addEventListener('click', () => {
    loadSong(songs[currentSongIndex]);
    playTrack();
    showPlayerPage();
});

// --- Resume Playback Feature ---
function savePlaybackState() {
    const currentState = {
        songIndex: currentSongIndex,
        currentTime: audioPlayer.currentTime,
        timestamp: Date.now()
    };
    localStorage.setItem('lastPlaybackState', JSON.stringify(currentState));
}

function checkResumePlayback() {
    const savedState = localStorage.getItem('lastPlaybackState');
    if (savedState) {
        const state = JSON.parse(savedState);
        // Only show if it's less than 24 hours old OR just always show it
        const surah = songs[state.songIndex];
        if (surah && state.currentTime > 5) {
            const prompt = document.getElementById('resumePrompt');
            const resumeText = document.getElementById('resumeText');
            if (prompt && resumeText) {
                resumeText.textContent = `هل تريد الاستمرار في ${surah.title} من حيث توقفت؟`;
                prompt.style.display = 'block';

                document.getElementById('resumeYesBtn').onclick = () => {
                    currentSongIndex = state.songIndex;
                    loadSong(songs[currentSongIndex]);
                    audioPlayer.currentTime = state.currentTime;
                    playTrack();
                    showPlayerPage();
                    prompt.style.display = 'none';
                };

                document.getElementById('resumeNoBtn').onclick = () => {
                    prompt.style.display = 'none';
                };
            }
        }
    }
}

// --- Khatmah Planner Logic ---
const khatmahPlannerCard = document.getElementById('khatmahPlanner');
const khatmahModal = document.getElementById('khatmahModal');
const khatmahSettingsBtn = document.getElementById('khatmahSettingsBtn');
const closeKhatmahModal = document.getElementById('closeKhatmahModal');
const closePlannerBtn = document.getElementById('closePlannerBtn');
const dailyStatusText = document.getElementById('dailyStatusText');
const currentKhatmahDayBadge = document.getElementById('currentKhatmahDayBadge');
const khatmahStreakSpan = document.getElementById('khatmahStreak');
let readingFontSize = 100;

function flattenVerses() {
    allVersesFlat = [];
    songs.forEach((song, sIdx) => {
        if (song.lyrics) {
            song.lyrics.forEach((lyric, vIdx) => {
                allVersesFlat.push({
                    surahIndex: sIdx,
                    verseIndex: vIdx,
                    text: lyric.text,
                    surahTitle: song.title
                });
            });
        }
    });
}

function calculateTotalVerses() {
    if (allVersesFlat.length === 0) flattenVerses();
    return allVersesFlat.length;
}

function initKhatmah() {
    totalQuranVerses = calculateTotalVerses();
    const savedPlan = localStorage.getItem('khatmahPlan');
    if (savedPlan) {
        khatmahPlan = JSON.parse(savedPlan);
        if (khatmahPlan && !khatmahPlan.currentDay) khatmahPlan.currentDay = 1;
        if (khatmahPlan && !khatmahPlan.streak) khatmahPlan.streak = 0;
        updateKhatmahUI();
    }
}

function setKhatmahPlan(days) {
    if (!totalQuranVerses) totalQuranVerses = calculateTotalVerses();
    const dailyTarget = Math.ceil(totalQuranVerses / days);
    khatmahPlan = {
        days: days,
        dailyTarget: dailyTarget,
        currentDay: 1,
        streak: 0,
        lastInteractionDate: null,
        startDate: Date.now()
    };
    localStorage.setItem('khatmahPlan', JSON.stringify(khatmahPlan));

    khatmahModal.style.display = 'none';
    khatmahPlannerCard.style.display = 'block';

    // Switch to reading page and show daily target
    showReadingPageWithKhatmah();
}

function showReadingPageWithKhatmah() {
    if (!khatmahPlan) return;

    hideAllPages();
    if (readingPage) readingPage.classList.add('active');

    renderDailyKhatmahVerses();
    updateKhatmahUI();
    closeSidebar();
}

function renderDailyKhatmahVerses() {
    if (!khatmahPlan) return;
    if (allVersesFlat.length === 0) flattenVerses();
    if (allVersesFlat.length === 0) return;

    const day = khatmahPlan.currentDay;
    const target = khatmahPlan.dailyTarget;
    const startIndex = (day - 1) * target;
    const endIndex = Math.min(day * target, allVersesFlat.length);

    const todaysVerses = allVersesFlat.slice(startIndex, endIndex);
    const lastReadIdx = khatmahPlan.lastReadIndexInDay || -1;

    readingSurahTitle.textContent = `ورد اليوم ${day} من الختمة`;
    readingContent.innerHTML = '';

    // Group verses by surah for better display
    let lastSurah = '';
    const dailyInfo = document.createElement('div');
    dailyInfo.className = 'daily-target-info';
    dailyInfo.innerHTML = `مقدار هذا اليوم: من <strong>${todaysVerses[0].surahTitle}</strong> إلى <strong>${todaysVerses[todaysVerses.length - 1].surahTitle}</strong> (${todaysVerses.length} آية)`;
    readingContent.appendChild(dailyInfo);

    todaysVerses.forEach((verse, idx) => {
        if (verse.surahTitle !== lastSurah) {
            const surahSeparator = document.createElement('h4');
            surahSeparator.className = 'surah-separator';
            surahSeparator.style = "color: #a855f7; margin: 30px 0 15px; border-bottom: 1px solid rgba(168,85,247,0.2); pb: 5px;";
            surahSeparator.textContent = verse.surahTitle;
            readingContent.appendChild(surahSeparator);
            lastSurah = verse.surahTitle;
        }

        const verseDiv = document.createElement('div');
        verseDiv.className = 'verse-item';
        if (idx <= lastReadIdx) verseDiv.classList.add('read');
        if (idx === lastReadIdx) verseDiv.classList.add('last-read-marker');

        verseDiv.innerHTML = `
            <span class="verse-num-badge">${verse.verseIndex + 1}</span>
            <span class="verse-text">${verse.text}</span>
        `;

        verseDiv.addEventListener('click', () => {
            markVerseAsRead(idx);
        });

        readingContent.appendChild(verseDiv);
    });

    // Add Done Button
    const doneContainer = document.createElement('div');
    doneContainer.className = 'done-btn-container';
    const doneBtn = document.createElement('button');
    doneBtn.className = 'khatmah-done-btn';
    doneBtn.innerHTML = '<i class="fas fa-check-circle"></i> أكملت ورد اليوم';
    doneBtn.onclick = completeKhatmahDay;
    doneContainer.appendChild(doneBtn);
    readingContent.appendChild(doneContainer);

    // Scroll to last read verse if possible
    if (lastReadIdx !== -1) {
        setTimeout(() => {
            const lastReadElem = readingContent.querySelector('.last-read-marker');
            if (lastReadElem) {
                lastReadElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 300);
    }
}

function markVerseAsRead(idx) {
    if (!khatmahPlan) return;
    khatmahPlan.lastReadIndexInDay = idx;
    localStorage.setItem('khatmahPlan', JSON.stringify(khatmahPlan));
    renderDailyKhatmahVerses(); // Refresh UI to show progress
}

function completeKhatmahDay() {
    if (!khatmahPlan) return;

    // Update streak logic
    const now = new Date();
    const lastDate = khatmahPlan.lastInteractionDate ? new Date(khatmahPlan.lastInteractionDate) : null;

    if (lastDate) {
        const diffInHours = (now - lastDate) / (1000 * 60 * 60);
        if (diffInHours < 48) {
            // Check if it's a new calendar day to increase streak
            if (now.getDate() !== lastDate.getDate()) {
                khatmahPlan.streak++;
            }
        } else {
            khatmahPlan.streak = 1; // Reset streak if missed more than a day
        }
    } else {
        khatmahPlan.streak = 1;
    }

    khatmahPlan.lastInteractionDate = now.getTime();

    if (khatmahPlan.currentDay < khatmahPlan.days) {
        khatmahPlan.currentDay++;
        khatmahPlan.lastReadIndexInDay = -1; // Reset progress for the new day
        localStorage.setItem('khatmahPlan', JSON.stringify(khatmahPlan));
        alert('بارك الله فيك! تم إكمال ورد اليوم. نراك غداً في ورد جديد.');
        renderDailyKhatmahVerses();
        updateKhatmahUI();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        alert('مبارك! لقد أتممت ختمة القرآن الكريم كاملة. يجعلها الله في ميزان حسناتك.');
        localStorage.removeItem('khatmahPlan');
        khatmahPlan = null;
        showHomePage();
    }
}

function updateKhatmahUI() {
    if (!khatmahPlan) {
        if (khatmahPlannerCard) khatmahPlannerCard.style.display = 'none';
        return;
    }
    const dailyVerseCountSpan = document.getElementById('dailyVerseCount');
    const khatmahDaysSpan = document.getElementById('khatmahDays');
    const dailyProgress = document.getElementById('dailyProgress');
    const dailyStatusText = document.getElementById('dailyStatusText');

    if (dailyVerseCountSpan) dailyVerseCountSpan.textContent = khatmahPlan.dailyTarget;
    if (khatmahDaysSpan) khatmahDaysSpan.textContent = khatmahPlan.days;
    if (khatmahPlannerCard) khatmahPlannerCard.style.display = 'block';

    const currentKhatmahDayBadge = document.getElementById('currentKhatmahDayBadge');
    if (currentKhatmahDayBadge) currentKhatmahDayBadge.textContent = `اليوم ${khatmahPlan.currentDay}`;
    if (khatmahStreakSpan) khatmahStreakSpan.innerHTML = `<i class="fas fa-fire"></i> ${khatmahPlan.streak || 0} يوم`;

    const progress = Math.min(100, ((khatmahPlan.currentDay - 1) / khatmahPlan.days) * 100);
    if (dailyProgress) dailyProgress.style.width = `${progress}%`;
    if (dailyStatusText) dailyStatusText.textContent = `أكملت ${khatmahPlan.currentDay - 1} يوماً من أصل ${khatmahPlan.days}`;
}

if (khatmahSettingsBtn) {
    khatmahSettingsBtn.addEventListener('click', () => {
        khatmahModal.style.display = 'flex';
    });
}

if (closeKhatmahModal) {
    closeKhatmahModal.addEventListener('click', () => {
        khatmahModal.style.display = 'none';
    });
}

if (closePlannerBtn) {
    closePlannerBtn.addEventListener('click', () => {
        khatmahPlannerCard.style.display = 'none';
    });
}

document.querySelectorAll('.khatmah-opt').forEach(btn => {
    btn.addEventListener('click', () => {
        const days = parseInt(btn.getAttribute('data-days'));
        setKhatmahPlan(days);
    });
});

const setCustomKhatmahBtn = document.getElementById('setCustomKhatmahBtn');
const customDaysInput = document.getElementById('customDaysInput');
if (setCustomKhatmahBtn && customDaysInput) {
    setCustomKhatmahBtn.addEventListener('click', () => {
        const days = parseInt(customDaysInput.value);
        if (days > 0) setKhatmahPlan(days);
    });
}



// Reading Settings Bar Logic
const increaseFontBtn = document.getElementById('increaseFont');
const decreaseFontBtn = document.getElementById('decreaseFont');
const fontSizeDisplay = document.getElementById('fontSizeDisplay');
const readingContainer = document.querySelector('.reading-container');

function updateFontSize() {
    if (readingContent) {
        readingContent.style.fontSize = `${readingFontSize}%`;
        if (fontSizeDisplay) fontSizeDisplay.textContent = `${readingFontSize}%`;
        localStorage.setItem('readingFontSize', readingFontSize);
    }
}

if (increaseFontBtn) {
    increaseFontBtn.addEventListener('click', () => {
        if (readingFontSize < 250) {
            readingFontSize += 10;
            updateFontSize();
        }
    });
}

if (decreaseFontBtn) {
    decreaseFontBtn.addEventListener('click', () => {
        if (readingFontSize > 70) {
            readingFontSize -= 10;
            updateFontSize();
        }
    });
}

document.querySelectorAll('.theme-opt').forEach(btn => {
    btn.addEventListener('click', () => {
        const theme = btn.getAttribute('data-theme');

        // Remove existing theme classes
        readingContainer.classList.remove('default', 'sepia', 'night');
        readingContainer.classList.add(theme);

        // Update active class on buttons
        document.querySelectorAll('.theme-opt').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        localStorage.setItem('readingTheme', theme);
    });
});

// Load saved reading settings helper
function loadReadingSettings() {
    const savedFontSize = localStorage.getItem('readingFontSize');
    if (savedFontSize) {
        readingFontSize = parseInt(savedFontSize);
        updateFontSize();
    }

    const savedTheme = localStorage.getItem('readingTheme');
    if (savedTheme) {
        const themeBtn = document.querySelector(`.theme-opt[data-theme="${savedTheme}"]`);
        if (themeBtn) themeBtn.click();
    }
}

// Player skip buttons
if (playerSkipBackBtn) {
    playerSkipBackBtn.addEventListener('click', () => {
        audioPlayer.currentTime = Math.max(0, audioPlayer.currentTime - 10);
    });
}

if (playerSkipForwardBtn) {
    playerSkipForwardBtn.addEventListener('click', () => {
        audioPlayer.currentTime = Math.min(audioPlayer.duration, audioPlayer.currentTime + 10);
    });
}

// Lyrics Font Control Logic
function updateLyricsFontSize() {
    if (lyricsContainer) {
        lyricsContainer.style.fontSize = `${lyricsFontSize}%`;
        if (lyricsFontSizeValue) lyricsFontSizeValue.textContent = `${lyricsFontSize}%`;
        localStorage.setItem('lyricsFontSize', lyricsFontSize);
    }
}

if (increaseLyricsFont) {
    increaseLyricsFont.addEventListener('click', () => {
        if (lyricsFontSize < 300) {
            lyricsFontSize += 10;
            updateLyricsFontSize();
        }
    });
}

if (decreaseLyricsFont) {
    decreaseLyricsFont.addEventListener('click', () => {
        if (lyricsFontSize > 50) {
            lyricsFontSize -= 10;
            updateLyricsFontSize();
        }
    });
}

function loadLyricsSettings() {
    const savedSize = localStorage.getItem('lyricsFontSize');
    if (savedSize) {
        lyricsFontSize = parseInt(savedSize);
    }
    updateLyricsFontSize();
}

// Download Surah functionality
if (downloadSurahBtn) {
    downloadSurahBtn.addEventListener('click', () => {
        const song = getCurrentSong();
        if (!song || !song.audioSrc) {
            alert('لا توجد سورة محملة للتحميل');
            return;
        }

        // Open audio in new tab (works in file:// protocol)
        window.open(song.audioSrc, '_blank');

        // Show instructions
        setTimeout(() => {
            alert(`تم فتح السورة في نافذة جديدة.\n\nللتحميل:\n1. انقر بزر الماوس الأيمن على المشغل\n2. اختر "حفظ الصوت باسم..." أو "Save Audio As..."\n3. احفظ الملف في المكان الذي تريده`);
        }, 500);
    });
}


// --- Initialization ---
function init() {
    console.log("Initializing...");
    initKhatmah();
    loadReadingSettings();
    loadLyricsSettings(); // Added here
    renderSongList();

    if (songs.length > 0) {
        loadSong(songs[currentSongIndex]);
    } else {
        albumArtPlayer.src = "https://placehold.co/100x100/3a3a4e/e0e0e0?text=Quran";
        playerTrackTitle.textContent = "لا توجد سورة";
        playerTrackArtist.textContent = "يرجى اختيار سورة من القائمة";
        lyricsContainer.innerHTML = "<p>يرجى اختيار سورة لبدء القراءة والاستماع.</p>";
    }

    audioPlayer.volume = playerVolumeSlider.value;
    updatePlayPauseIcon();
    updateRepeatButtonUI();
    showHomePage();

    // Check for resume after a short delay to ensure UI is ready
    setTimeout(checkResumePlayback, 1000);

    console.log("Initialization complete.");
}

init();
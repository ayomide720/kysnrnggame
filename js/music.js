/**
 * ===== MUSIC SYSTEM =====
 * Handles background music playback and controls
 */

const MusicSystem = (() => {
  /**
   * Start playing background music
   */
  function startBGM() {
    const audio = getElement('bgm-audio');
    const musicEnabled = GameState.get('musicEnabled');
    const bgmStarted = GameState.get('bgmStarted');

    if (!audio || bgmStarted || !musicEnabled) return;

    audio.volume = 0.3;
    audio.play().catch(err => {
      console.log('Autoplay blocked or failed:', err);
    });

    GameState.setBgmStarted(true);
  }

  /**
   * Toggle music on/off
   */
  function toggleMusic() {
    const audio = getElement('bgm-audio');
    const btn = getElement('toggle-music-btn');

    if (!audio || !btn) return;

    const musicEnabled = GameState.get('musicEnabled');
    GameState.setMusicEnabled(!musicEnabled);

    btn.textContent = `Music: ${!musicEnabled ? 'ON' : 'OFF'}`;

    if (!musicEnabled) {
      // Music is now ON
      startBGM();
    } else {
      // Music is now OFF
      audio.pause();
      GameState.setBgmStarted(false);
    }
  }

  /**
   * Initialize music system
   */
  function init() {
    const btn = getElement('toggle-music-btn');
    if (btn) {
      btn.addEventListener('click', toggleMusic);
    }

    // Start BGM on first user interaction
    document.addEventListener('click', startBGM, { once: true });
    document.addEventListener('keydown', startBGM, { once: true });
  }

  return {
    init,
    startBGM,
    toggleMusic,
  };
})();

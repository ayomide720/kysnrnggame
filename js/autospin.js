/**
 * ===== AUTO SPIN SYSTEM =====
 * Handles automatic spinning functionality
 */

const AutoSpin = (() => {
  let spinInProgress = false;

  /**
   * Toggle auto spin on/off
   */
  function toggleAutoSpin() {
    const btn = getElement('auto-spin-btn');
    if (!btn) return;

    const isActive = GameState.get('autoSpinActive');
    GameState.setAutoSpinActive(!isActive);

    if (!isActive) {
      startAutoSpin();
    } else {
      stopAutoSpin();
    }
  }

  /**
   * Start auto spinning
   */
  function startAutoSpin() {
    // Inside AutoSpin.startAutoSpin():
const baseSpeed = GameState.get('autoSpinSpeed');
const speedMultiplier = typeof SkillTree !== 'undefined' ? SkillTree.getSpeedMultiplier() : 1;
const effectiveSpeed = Math.max(50, baseSpeed * speedMultiplier);

// Use effectiveSpeed in your setInterval call
    const btn = getElement('auto-spin-btn');
    const rateDisplay = getElement('auto-spin-rate');

    if (!btn || !rateDisplay) return;

    btn.textContent = 'Auto Spin: ON';
    btn.style.backgroundColor = '#27ae60';
    rateDisplay.textContent = `Auto Spin Rate: ${(1000 / speed).toFixed(1)} spins/sec`;

    const interval = setInterval(() => {
      if (!GameState.get('autoSpinActive')) {
        clearInterval(interval);
        return;
      }

      // Prevent overlapping spins
      if (!spinInProgress) {
        spinInProgress = true;
        try {
          GameLogic.spin();
        } finally {
          spinInProgress = false;
        }
      }
    }, speed);

    GameState.setAutoSpinInterval(interval);
    showNotification('Auto Spin Started!', '#27ae60', 1500);
  }

  /**
   * Stop auto spinning
   */
  function stopAutoSpin() {
    const btn = getElement('auto-spin-btn');
    const rateDisplay = getElement('auto-spin-rate');
    const interval = GameState.get('autoSpinInterval');

    if (interval) {
      clearInterval(interval);
      GameState.setAutoSpinInterval(null);
    }

    if (btn) {
      btn.textContent = 'Auto Spin: OFF';
      btn.style.backgroundColor = '#111';
    }

    if (rateDisplay) {
      rateDisplay.textContent = 'Auto Spin Rate: OFF';
    }

    showNotification('Auto Spin Stopped!', '#ff6b6b', 1500);
  }

  /**
   * Update auto spin speed
   * @param {number} newSpeed - New speed in milliseconds
   */
  function updateAutoSpinSpeed(newSpeed) {
    GameState.setAutoSpinSpeed(newSpeed);

    // Restart if currently active
    if (GameState.get('autoSpinActive')) {
      stopAutoSpin();
      startAutoSpin();
    }
  }

  /**
   * Initialize auto spin system
   */
  function init() {
    const btn = getElement('auto-spin-btn');
    if (btn) {
      btn.addEventListener('click', toggleAutoSpin);
    }
  }

  return {
    init,
    toggleAutoSpin,
    startAutoSpin,
    stopAutoSpin,
    updateAutoSpinSpeed,
  };
})();

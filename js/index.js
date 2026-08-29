/**
 * ===== RARITY INDEX SYSTEM =====
 * Displays a comprehensive index of all rarities with collection counts
 */

const RarityIndex = (() => {
  /**
   * Open the rarity index modal
   */
  function openIndex() {
    const modal = getElement('index-modal');
    if (modal) {
      modal.style.display = 'block';
      updateIndexDisplay();
    }
  }

  /**
   * Close the rarity index modal
   */
  function closeIndex() {
    const modal = getElement('index-modal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  /**
   * Update the index display with current inventory
   */
  function updateIndexDisplay() {
    const indexBody = getElement('index-body');
    if (!indexBody) return;

    const inventory = GameState.get('inventory');
    const rarities = GameLogic.CONFIG.rarities;
    
    let html = '<div class="index-grid">';

    for (const rarity of rarities) {
      const count = inventory[rarity] || 0;
      const raritySlug = rarity.replace(/ /g, '-');
      
      html += `
        <div class="index-item ${count > 0 ? 'owned' : 'not-owned'}">
          <div class="index-rarity-name rarity-${raritySlug}">${rarity}</div>
          <div class="index-count">
            <span class="count-number">${count}</span>
            <span class="count-label">collected</span>
          </div>
          <div class="index-progress">
            <div class="index-progress-bar" style="width: ${Math.min(count / 10 * 100, 100)}%"></div>
          </div>
          <div class="index-drop-rate">
            <small>${(GameLogic.CONFIG.baseProbabilities[rarity] * 100).toFixed(4)}%</small>
          </div>
        </div>
      `;
    }

    html += '</div>';
    indexBody.innerHTML = html;
  }

  /**
   * Initialize the index system
   */
  function init() {
    const openBtn = getElement('open-index-btn');
    const closeBtn = getElement('close-index-btn');
    const modal = getElement('index-modal');

    if (openBtn) {
      openBtn.addEventListener('click', openIndex);
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closeIndex);
    }

    // Close modal when clicking outside
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeIndex();
        }
      });
    }
  }

  return {
    init,
    openIndex,
    closeIndex,
    updateIndexDisplay,
  };
})();

/**
 * ===== MAIN INITIALIZATION =====
 * Initialize game systems and attach event listeners
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('Initializing game...');

  // Initialize all systems
  GameLogic.updateUI();
  AutoSpin.init();
  MusicSystem.init();

  // Attach main button listeners
  const spinBtn = getElement('spin-btn');
  if (spinBtn) {
    spinBtn.addEventListener('click', () => {
      GameLogic.spin();
      showNotification('Spun!', '#00c8ff', 1000);
    });
  }

  // Attach upgrade button listeners
  const luckUpgradeBtn = getElement('buy-luck-upgrade');
  if (luckUpgradeBtn) {
    luckUpgradeBtn.addEventListener('click', () => {
      GameLogic.buyLuckUpgrade();
    });
  }

  const spinSpeedUpgradeBtn = getElement('buy-spin-speed-upgrade');
  if (spinSpeedUpgradeBtn) {
    spinSpeedUpgradeBtn.addEventListener('click', () => {
      GameLogic.buySpinSpeedUpgrade();
    });
  }

  // Attach image showcase toggle
  const toggleImageBtn = getElement('toggle-image-showcase-btn');
  const imageShowcase = getElement('image-showcase');
  if (toggleImageBtn && imageShowcase) {
    toggleImageBtn.addEventListener('click', () => {
      if (imageShowcase.style.display === 'none' || imageShowcase.style.display === '') {
        updateImageShowcase();
        imageShowcase.style.display = 'block';
      } else {
        imageShowcase.style.display = 'none';
      }
    });
  }

  // Secret code handler
  const secretCodeInput = getElement('secretCodeInput');
  const secretCodeSubmit = getElement('secretCodeSubmit');
  if (secretCodeSubmit && secretCodeInput) {
    secretCodeSubmit.addEventListener('click', () => {
      handleSecretCode(secretCodeInput.value);
      secretCodeInput.value = '';
    });
  }

  console.log('Game initialized successfully!');
});

/**
 * Update image showcase with collected rarities
 */
function updateImageShowcase() {
  const container = getElement('image-showcase');
  if (!container) return;

  const imageGrid = getElement('rarity-image-grid');
  if (!imageGrid) return;

  imageGrid.innerHTML = '';

  const inventory = GameState.get('inventory');
  const rarities = GameLogic.CONFIG.rarities;

  for (const rarity of rarities) {
    if (!inventory[rarity]) continue;

    const raritySlug = rarity.toLowerCase().replace(/ /g, '-');
    const count = inventory[rarity];

    const wrapper = document.createElement('div');
    wrapper.style.display = 'inline-block';
    wrapper.style.textAlign = 'center';
    wrapper.style.fontSize = '12px';
    wrapper.style.margin = '5px';

    const img = document.createElement('img');
    img.src = `https://raw.githubusercontent.com/ayomide720/kysnrnggame/main/${raritySlug}.png`;
    img.alt = rarity;
    img.title = `${rarity} × ${count}`;
    img.style.width = '64px';
    img.style.height = '64px';
    img.style.imageRendering = 'pixelated';
    img.style.display = 'block';
    img.style.margin = '0 auto';

    const label = document.createElement('div');
    label.innerHTML = `<span class="rarity-${raritySlug}">${rarity}</span>`;

    img.onload = () => {
      wrapper.appendChild(img);
      wrapper.appendChild(label);
    };

    img.onerror = () => {
      // If no image, just show the label text
      wrapper.appendChild(label);
    };

    imageGrid.appendChild(wrapper);
  }
}

/**
 * Handle secret codes for cheats/unlocks
 * @param {string} code - The secret code entered
 */
function handleSecretCode(code) {
  const messageEl = getElement('secretCodeMessage');
  if (!messageEl) return;

  const codes = {
    'freemoney': () => {
      GameState.addMoney(100000);
      showNotification('💰 Free money activated!', '#f1c40f', 2000);
      GameLogic.updateUI();
      return true;
    },
    'god': () => {
      GameState.set('money', 999999999);
      GameState.set('luckUpgradeLevel', 100);
      showNotification('⚡ God mode activated!', '#f1c40f', 2000);
      GameLogic.updateUI();
      return true;
    },
    'reset': () => {
      if (confirm('Are you sure? This will reset your entire game progress!')) {
        GameState.reset();
        GameLogic.updateUI();
        showNotification('🔄 Game reset!', '#ff6b6b', 2000);
        return true;
      }
      return false;
    },
  };

  const handler = codes[code.toLowerCase()];
  if (handler && handler()) {
    messageEl.textContent = 'Secret code activated! ✨';
    messageEl.style.color = '#27ae60';
  } else {
    messageEl.textContent = 'Invalid code.';
    messageEl.style.color = '#ff6b6b';
  }

  setTimeout(() => {
    messageEl.textContent = '';
  }, 3000);
}

/**
 * Periodic auto-save
 */
setInterval(() => {
  GameState.save();
}, 30000);

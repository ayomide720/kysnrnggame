/**
 * ===== GAME STATE MODULE =====
 * Centralized state management for all game data
 */

const GameState = (() => {
  // Private state
  let state = {
    // Money & Resources
    money: 0,
    totalSpins: 0,
    rarest: 'N/A',

    // Inventory
    inventory: {},
    rarityOrder: [],
    rarityDropRates: {},

    // Upgrades
    luckUpgradeLevel: 0,
    spinSpeedUpgradeLevel: 0,
    spinSpeedBoost: 0,

    // Auto Spin
    autoSpinSpeed: 1000,
    autoSpinActive: false,
    autoSpinInterval: null,

    // Music
    musicEnabled: true,
    bgmStarted: false,

    // Gears
    gears: {},

    // Artifacts & Achievements
    artifacts: {},
    achievements: {},
  };

  // Public API
  return {
    // Getters
    get(key) {
      return state[key];
    },

    getAll() {
      return { ...state };
    },

    // Setters
    set(key, value) {
      if (key in state) {
        state[key] = value;
        this.save();
        return true;
      }
      console.warn(`Unknown state key: ${key}`);
      return false;
    },

    update(updates) {
      Object.assign(state, updates);
      this.save();
    },

    // Specific state operations
    addMoney(amount) {
      state.money += amount;
      this.save();
      return state.money;
    },

    incrementSpins() {
      state.totalSpins++;
      this.save();
      return state.totalSpins;
    },

    addToInventory(rarity, count = 1) {
      if (!state.inventory[rarity]) {
        state.inventory[rarity] = 0;
      }
      state.inventory[rarity] += count;
      this.save();
      return state.inventory[rarity];
    },

    setRarest(rarity) {
      state.rarest = rarity;
      this.save();
    },

    upgradeLuck() {
      state.luckUpgradeLevel++;
      this.save();
      return state.luckUpgradeLevel;
    },

    upgradeSpinSpeed() {
      state.spinSpeedUpgradeLevel++;
      this.save();
      return state.spinSpeedUpgradeLevel;
    },

    setAutoSpinSpeed(speed) {
      state.autoSpinSpeed = speed;
      this.save();
    },

    setAutoSpinActive(active) {
      state.autoSpinActive = active;
      this.save();
    },

    setAutoSpinInterval(interval) {
      state.autoSpinInterval = interval;
    },

    setMusicEnabled(enabled) {
      state.musicEnabled = enabled;
      this.save();
    },

    setBgmStarted(started) {
      state.bgmStarted = started;
    },

    // Persistence
    save() {
      try {
        const saveData = {
          money: state.money,
          totalSpins: state.totalSpins,
          rarest: state.rarest,
          inventory: state.inventory,
          luckUpgradeLevel: state.luckUpgradeLevel,
          spinSpeedUpgradeLevel: state.spinSpeedUpgradeLevel,
          spinSpeedBoost: state.spinSpeedBoost,
          autoSpinSpeed: state.autoSpinSpeed,
          musicEnabled: state.musicEnabled,
          gears: state.gears,
          artifacts: state.artifacts,
          achievements: state.achievements,
        };
        localStorage.setItem('gameState', JSON.stringify(saveData));
      } catch (error) {
        console.error('Failed to save game state:', error);
      }
    },

    load() {
      try {
        const saved = localStorage.getItem('gameState');
        if (saved) {
          const data = JSON.parse(saved);
          Object.assign(state, data);
        }
      } catch (error) {
        console.error('Failed to load game state:', error);
      }
    },

    reset() {
      state = {
        money: 0,
        totalSpins: 0,
        rarest: 'N/A',
        inventory: {},
        rarityOrder: [],
        rarityDropRates: {},
        luckUpgradeLevel: 0,
        spinSpeedUpgradeLevel: 0,
        spinSpeedBoost: 0,
        autoSpinSpeed: 1000,
        autoSpinActive: false,
        autoSpinInterval: null,
        musicEnabled: true,
        bgmStarted: false,
        gears: {},
        artifacts: {},
        achievements: {},
      };
      this.save();
    },
  };
})();

// Load state when module is initialized
GameState.load();

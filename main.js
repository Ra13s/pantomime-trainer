/************************************************
 * Global References to Data
 ************************************************/
let actionsData = window.actionsData || [];

/************************************************
 * Default Settings
 ************************************************/
const defaultSettings = {
  actionInterval: 30
};

/************************************************
 * UI Translations
 ************************************************/
const uiTranslations = {
  en: {
    title: "Pantomime Trainer",
    actionTitle: "Action",
    languageEnglish: "English",
    languageEstonian: "Estonian",
    nextAction: "Next Action",
    showSettings: "Show Settings",
    hideSettings: "Hide Settings",
    settingsHeader: "Settings",
    actionInterval: "Action Interval (s)",
    saveSettings: "Save Settings",
    displayActionDesc: "Display Action Description",
    displayTitles: "Display Section Titles"
  },
  et: {
    title: "Pantomiimi Treener",
    actionTitle: "Tegevus",
    languageEnglish: "Inglise",
    languageEstonian: "Eesti",
    nextAction: "Järgmine tegevus",
    showSettings: "Näita seadeid",
    hideSettings: "Peida seaded",
    settingsHeader: "Seaded",
    actionInterval: "Tegevuse intervall (s)",
    saveSettings: "Salvesta seaded",
    displayActionDesc: "Kuva tegevuse kirjeldus",
    displayTitles: "Kuva sektsioonide pealkirjad"
  }
};

/************************************************
 * Helper / Utility
 ************************************************/
function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getSelectedLanguage() {
  const radios = document.getElementsByName("lang");
  for (let r of radios) {
    if (r.checked) return r.value;
  }
  return "en"; // fallback
}

/************************************************
 * UI Translation Update Function
 ************************************************/
function updateUITranslations() {
  const lang = getSelectedLanguage();
  
  // Update document title
  document.title = uiTranslations[lang].title;
  
  // Action title
  document.getElementById("actionTitle").textContent =
    uiTranslations[lang].actionTitle;
  
  // Language toggle labels
  document.getElementById("langEnglishLabel").textContent =
    uiTranslations[lang].languageEnglish;
  document.getElementById("langEstonianLabel").textContent =
    uiTranslations[lang].languageEstonian;
  
  // Button text for next action
  document.getElementById("nextActionBtn").textContent =
    uiTranslations[lang].nextAction;
  
  // Settings toggle
  const toggleBtn = document.getElementById("toggle-settings-btn");
  const settingsPanel = document.getElementById("settings-panel");
  if (settingsPanel.style.display === "block") {
    toggleBtn.textContent = uiTranslations[lang].hideSettings;
  } else {
    toggleBtn.textContent = uiTranslations[lang].showSettings;
  }
  
  // Settings panel texts
  document.getElementById("settingsHeader").textContent =
    uiTranslations[lang].settingsHeader;
  document.getElementById("actionIntervalLabel").textContent =
    uiTranslations[lang].actionInterval;
  document.getElementById("saveSettingsBtn").textContent =
    uiTranslations[lang].saveSettings;
  document.getElementById("displayActionDescLabel").textContent =
    uiTranslations[lang].displayActionDesc;
  document.getElementById("displayTitlesLabel").textContent =
    uiTranslations[lang].displayTitles;
}

/************************************************
 * DOM Elements
 ************************************************/
const actionDisplay = document.getElementById("actionDisplay");
const actionDesc = document.getElementById("actionDesc");

/************************************************
 * Timers
 ************************************************/
let actionInterval = defaultSettings.actionInterval;
let actionTimer;

// Current Item
let currentAction = null;

/************************************************
 * Generate & Display Functions
 ************************************************/
function generateAction() {
  const lang = getSelectedLanguage();
  // Choose the proper actions array based on the language.
  const actionsData = (lang === "en")
    ? window.actionsData_en
    : window.actionsData_et;
    
  if (!actionsData || actionsData.length === 0) return;
  currentAction = getRandomItem(actionsData);
  displayAction();
}

function displayAction() {
  if (!currentAction) return;
  actionDisplay.textContent = currentAction;
  actionDesc.textContent = "";
}

/************************************************
 * Shuffle & Timer Reset Function
 ************************************************/
function shuffleActionAndResetTimer() {
  generateAction();
  // Reset the timer
  startTimers();
}

/************************************************
 * Display Options
 ************************************************/
function updateDisplayOptions() {
  // Show/hide action description
  const showDesc = document.getElementById("displayActionDesc").checked;
  actionDesc.style.display = showDesc ? "block" : "none";
  
  // Show/hide section titles
  const showTitles = document.getElementById("displayTitles").checked;
  document.getElementById("actionTitle").style.display =
    showTitles ? "block" : "none";
}

/************************************************
 * Start / Clear Timers
 ************************************************/
function startTimers() {
  clearTimers();
  actionTimer = setInterval(() => {
    generateAction();
  }, actionInterval * 1000);
}

function clearTimers() {
  if (actionTimer) clearInterval(actionTimer);
}

/************************************************
 * Settings Panel
 ************************************************/
function initSettingsPanel() {
  const toggleBtn = document.getElementById("toggle-settings-btn");
  const settingsPanel = document.getElementById("settings-panel");
  let isOpen = false;
  
  toggleBtn.addEventListener("click", () => {
    isOpen = !isOpen;
    settingsPanel.style.display = isOpen ? "block" : "none";
    updateUITranslations();
  });
  
  const saveBtn = document.getElementById("saveSettingsBtn");
  const aIntervalInput = document.getElementById("actionInterval");
  
  saveBtn.addEventListener("click", () => {
    actionInterval = parseInt(aIntervalInput.value, 10) ||
      defaultSettings.actionInterval;
    startTimers();
    settingsPanel.style.display = "none";
    isOpen = false;
  });
}

/************************************************
 * Initialization
 ************************************************/
function init() {
  // Next Action button now shuffles and resets timer
  document.getElementById("nextActionBtn").addEventListener("click", shuffleActionAndResetTimer);
  
  // Language radios now regenerate action immediately on change
  const langRadios = document.getElementsByName("lang");
  for (let radio of langRadios) {
    radio.addEventListener("change", () => {
      updateUITranslations();
      shuffleActionAndResetTimer();
    });
  }
  
  // Settings panel
  initSettingsPanel();
  
  // Display options
  document.getElementById("displayActionDesc").addEventListener("change", updateDisplayOptions);
  document.getElementById("displayTitles").addEventListener("change", updateDisplayOptions);
  
  updateUITranslations();
  updateDisplayOptions();
  
  document.getElementById("actionInterval").value = actionInterval;
  document.getElementById("actionIntervalValue").textContent = actionInterval;
  
  generateAction();
  startTimers();
}

window.addEventListener("DOMContentLoaded", init);

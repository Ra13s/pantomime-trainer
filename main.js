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
  
  // Update section titles and labels
  document.getElementById("actionTitle").textContent = uiTranslations[lang].actionTitle;
  document.getElementById("langEnglishLabel").textContent = uiTranslations[lang].languageEnglish;
  document.getElementById("langEstonianLabel").textContent = uiTranslations[lang].languageEstonian;
  document.getElementById("nextActionBtn").textContent = uiTranslations[lang].nextAction;
  
  // Settings toggle button text based on panel display
  const toggleBtn = document.getElementById("toggle-settings-btn");
  const settingsPanel = document.getElementById("settings-panel");
  toggleBtn.textContent = settingsPanel.style.display === "block"
    ? uiTranslations[lang].hideSettings
    : uiTranslations[lang].showSettings;
  
  // Settings panel texts
  document.getElementById("settingsHeader").textContent = uiTranslations[lang].settingsHeader;
  document.getElementById("actionIntervalLabel").textContent = uiTranslations[lang].actionInterval;
  document.getElementById("saveSettingsBtn").textContent = uiTranslations[lang].saveSettings;
  document.getElementById("displayActionDescLabel").textContent = uiTranslations[lang].displayActionDesc;
  document.getElementById("displayTitlesLabel").textContent = uiTranslations[lang].displayTitles;
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
let currentAction = null; // Current Action

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
  document.getElementById("actionTitle").style.display = showTitles ? "block" : "none";
}

/************************************************
 * Start / Clear Timers
 ************************************************/
function startTimers() {
  clearTimers();
  actionTimer = setInterval(generateAction, actionInterval * 1000);
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
    actionInterval = parseInt(aIntervalInput.value, 10) || defaultSettings.actionInterval;
    startTimers();
    settingsPanel.style.display = "none";
    isOpen = false;
  });
}

/************************************************
 * URL Parameter Language Setter
 ************************************************/
function setLanguageFromUrlParam() {
  const urlParams = new URLSearchParams(window.location.search);
  const langParam = urlParams.get('lang');
  if (langParam && (langParam === 'en' || langParam === 'et')) {
    const langRadios = document.getElementsByName("lang");
    for (let radio of langRadios) {
      radio.checked = (radio.value === langParam);
    }
  }
}

/************************************************
 * Initialization
 ************************************************/
function init() {
  // Set language based on URL parameter if provided
  setLanguageFromUrlParam();
  
  // Next Action button event
  document.getElementById("nextActionBtn").addEventListener("click", shuffleActionAndResetTimer);
  
  // Language radios event: update UI on change
  const langRadios = document.getElementsByName("lang");
  for (let radio of langRadios) {
    radio.addEventListener("change", () => {
      updateUITranslations();
      shuffleActionAndResetTimer();
    });
  }
  
  // Initialize settings panel and display options
  initSettingsPanel();
  document.getElementById("displayActionDesc").addEventListener("change", updateDisplayOptions);
  document.getElementById("displayTitles").addEventListener("change", updateDisplayOptions);
  
  // Initial UI update and timer setup
  updateUITranslations();
  updateDisplayOptions();
  document.getElementById("actionInterval").value = actionInterval;
  document.getElementById("actionIntervalValue").textContent = actionInterval;
  
  generateAction();
  startTimers();
}

window.addEventListener("DOMContentLoaded", init);

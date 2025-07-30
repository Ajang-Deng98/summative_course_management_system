// DOM elements
const titleElement = document.getElementById('title');
const welcomeElement = document.getElementById('welcome');
const question1Element = document.getElementById('question1');
const question2Element = document.getElementById('question2');
const question3Element = document.getElementById('question3');
const submitButton = document.getElementById('submit-btn');
const footerTextElement = document.getElementById('footer-text');
const enButton = document.getElementById('en-btn');
const frButton = document.getElementById('fr-btn');

// Current language (default: English)
let currentLanguage = 'en';

// Check browser language or stored preference
function detectLanguage() {
    // Try to get stored language preference
    const storedLanguage = localStorage.getItem('preferredLanguage');
    if (storedLanguage) {
        return storedLanguage;
    }
    
    // Check browser language
    const browserLanguage = navigator.language || navigator.userLanguage;
    if (browserLanguage.startsWith('fr')) {
        return 'fr';
    }
    
    // Default to English
    return 'en';
}

// Update page content based on selected language
function updateContent(language) {
    // Update current language
    currentLanguage = language;
    
    // Store language preference
    localStorage.setItem('preferredLanguage', language);
    
    // Update button states
    if (language === 'en') {
        enButton.classList.add('active');
        frButton.classList.remove('active');
    } else {
        enButton.classList.remove('active');
        frButton.classList.add('active');
    }
    
    // Update page content
    titleElement.textContent = translations[language].title;
    welcomeElement.textContent = translations[language].welcome;
    question1Element.textContent = translations[language].question1;
    question2Element.textContent = translations[language].question2;
    question3Element.textContent = translations[language].question3;
    submitButton.textContent = translations[language].submitBtn;
    footerTextElement.textContent = translations[language].footerText;
    
    // Update document language
    document.documentElement.lang = language;
}

// Event listeners for language buttons
enButton.addEventListener('click', () => updateContent('en'));
frButton.addEventListener('click', () => updateContent('fr'));

// Submit button event listener
submitButton.addEventListener('click', () => {
    const answer1 = document.getElementById('answer1').value.trim();
    const answer2 = document.getElementById('answer2').value.trim();
    const answer3 = document.getElementById('answer3').value.trim();
    
    if (answer1 && answer2 && answer3) {
        alert(currentLanguage === 'en' ? 
            'Thank you for your reflection!' : 
            'Merci pour votre réflexion !');
            
        // In a real application, you would send this data to a server
        console.log({
            language: currentLanguage,
            answers: {
                question1: answer1,
                question2: answer2,
                question3: answer3
            }
        });
        
        // Clear form
        document.getElementById('answer1').value = '';
        document.getElementById('answer2').value = '';
        document.getElementById('answer3').value = '';
    } else {
        alert(currentLanguage === 'en' ? 
            'Please answer all questions.' : 
            'Veuillez répondre à toutes les questions.');
    }
});

// Initialize page with detected language
updateContent(detectLanguage());
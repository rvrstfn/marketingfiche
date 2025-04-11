/**
 * Main application logic
 */

// App state
let currentPhase = "technical";
let chatHistory = [];
let apiKey = localStorage.getItem('openai_api_key') || '';

// DOM elements
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const phaseButtons = document.querySelectorAll('.phase-btn');
const apiKeyInput = document.getElementById('apiKey');
const saveApiKeyButton = document.getElementById('saveApiKey');
const apiKeyContainer = document.getElementById('apiKeyContainer');
const clearChatButton = document.getElementById('clearChat');

// Initialize
(function initialize() {
    console.log(`%c📱 APP INITIALIZATION`, 'color: blue; font-weight: bold;');
    console.log(`🧠 Loading configuration from config.js`);
    console.log(`📏 Technical system prompt: ${config.system_prompt_technical_phase.length} chars`);
    console.log(`📏 Marketing system prompt: ${config.system_prompt_marketing_phase.length} chars`);
    console.log(`📏 Analysis special string: ${config.special_string_analysis_phase.length} chars`);
    
    if (apiKey) {
        console.log(`🔑 API key found in local storage (length: ${apiKey.length})`);
        apiKeyInput.value = apiKey;
        apiKeyContainer.style.display = 'none';
    } else {
        console.log(`🔑 No API key found in local storage - showing key input form`);
    }
    
    console.log(`%c✅ APP INITIALIZED - Ready for user interaction`, 'color: green; font-weight: bold;');
})();

// Function to change phase
function changePhase(phase) {
    const oldPhase = currentPhase;
    currentPhase = phase;
    console.log(`%c🔄 PHASE CHANGE: ${oldPhase} → ${phase}`, 'color: blue; font-weight: bold;');
}

// Function to handle sending a message
async function handleSendMessage() {
    console.log(`%c💬 USER MESSAGE HANDLER STARTED`, 'color: green; font-weight: bold;');
    const message = userInput.value.trim();
    if (!message) {
        console.log('🚫 Empty message, ignoring');
        return;
    }

    // Check if API key is provided
    if (!apiKey) {
        console.log('🔑 No API key provided');
        apiKeyContainer.style.display = 'block';
        alert('Please enter your OpenAI API key first');
        return;
    }

    console.log(`📤 User message (${message.length} chars): "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`);
    addMessage(message, 'user');
    userInput.value = '';
    
    // Show loading indicator
    const loadingElement = addLoadingIndicator();

    const startTime = performance.now();
    
    try {
        // Process based on current phase
        let response;
        
        if (currentPhase === "technical") {
            console.log(`%c⚙️ TECHNICAL PHASE - Using ${config.models.technical} model`, 'color: purple; font-weight: bold;');
            const systemPrompt = config.system_prompt_technical_phase;
            console.log(`🧠 System prompt length: ${systemPrompt.length} chars`);
            response = await callOpenAI(message, systemPrompt, config.models.technical);
        } else if (currentPhase === "analysis") {
            console.log(`%c🔬 ANALYSIS PHASE - Using ${config.models.analysis} model`, 'color: purple; font-weight: bold;');
            const specialString = config.special_string_analysis_phase;
            console.log(`📋 Special string length: ${specialString.length} chars`);
            const analysisPrompt = `${message}\n\n-------------\n\n${specialString}`;
            console.log(`📤 Final analysis prompt length: ${analysisPrompt.length} chars`);
            response = await callOpenAI(analysisPrompt, "", config.models.analysis);
        } else if (currentPhase === "marketing") {
            console.log(`%c📊 MARKETING PHASE - Using ${config.models.marketing} model`, 'color: purple; font-weight: bold;');
            const systemPrompt = config.system_prompt_marketing_phase;
            console.log(`🧠 System prompt length: ${systemPrompt.length} chars`);
            response = await callOpenAI(message, systemPrompt, config.models.marketing);
        }

        const endTime = performance.now();
        const elapsedTime = (endTime - startTime) / 1000;
        console.log(`%c⏱️ Response received in ${elapsedTime.toFixed(2)} seconds`, 'color: green;');
        console.log(`📥 Response (${response.length} chars): "${response.substring(0, 50)}${response.length > 50 ? '...' : ''}"`);

        // Remove loading indicator
        removeLoadingIndicator();
        
        // Add response to chat
        addMessage(response, 'assistant');
        
        // Update chat history
        console.log(`📚 Adding messages to chat history (now ${chatHistory.length + 2} messages)`);
        chatHistory.push({ role: "user", content: message });
        chatHistory.push({ role: "assistant", content: response });
    } catch (error) {
        const endTime = performance.now();
        const elapsedTime = (endTime - startTime) / 1000;
        console.error(`%c❌ ERROR after ${elapsedTime.toFixed(2)} seconds:`, 'color: red; font-weight: bold;', error);
        // Remove loading indicator
        removeLoadingIndicator();
        // Show error message
        addMessage(`Error: ${error.message}`, 'assistant');
    }
}

// Phase button click handler
async function handlePhaseButtonClick(phase) {
    console.log(`%c🔘 PHASE BUTTON CLICKED`, 'color: blue; font-weight: bold;');
    
    // Log phase change info
    console.log(`🔄 Changing phase to: ${phase}`);
    changePhase(phase);
    
    // Update active button
    updateActivePhasesUI(phase);
    console.log(`🎨 Updated UI for active phase: ${phase}`);
    
    // Add system message about phase change
    console.log(`📢 Adding phase change notification message`);
    addMessage(`Switched to ${phase} phase`, 'assistant');
    
    // Send default prompt based on phase
    const defaultPrompt = config.defaultPrompts[phase];
    console.log(`📋 Auto-generated default prompt: "${defaultPrompt}"`);
    
    // Show loading indicator
    const loadingElement = addLoadingIndicator();
    
    const phaseChangeStartTime = performance.now();
    console.log(`%c🚀 PHASE CHANGE AUTO-REQUEST STARTED`, 'color: blue; font-weight: bold;');
    
    try {
        // Process based on current phase
        let response;
        
        if (phase === "technical") {
            console.log(`%c⚙️ AUTO-REQUEST: TECHNICAL PHASE - Using ${config.models.technical} model`, 'color: purple; font-weight: bold;');
            response = await callOpenAI(defaultPrompt, config.system_prompt_technical_phase, config.models.technical);
        } else if (phase === "analysis") {
            console.log(`%c🔬 AUTO-REQUEST: ANALYSIS PHASE - Using ${config.models.analysis} model`, 'color: purple; font-weight: bold;');
            const analysisPrompt = `${defaultPrompt}\n\n-------------\n\n${config.special_string_analysis_phase}`;
            response = await callOpenAI(analysisPrompt, "", config.models.analysis);
        } else if (phase === "marketing") {
            console.log(`%c📊 AUTO-REQUEST: MARKETING PHASE - Using ${config.models.marketing} model`, 'color: purple; font-weight: bold;');
            response = await callOpenAI(defaultPrompt, config.system_prompt_marketing_phase, config.models.marketing);
        }
        
        const phaseChangeEndTime = performance.now();
        const phaseChangeElapsedTime = (phaseChangeEndTime - phaseChangeStartTime) / 1000;
        console.log(`%c✅ PHASE CHANGE AUTO-REQUEST COMPLETED in ${phaseChangeElapsedTime.toFixed(2)} seconds`, 'color: green; font-weight: bold;');
        
        // Remove loading indicator
        removeLoadingIndicator();
        
        // Add response to chat
        console.log(`📝 Adding auto-response to chat`);
        addMessage(response, 'assistant');
        
        // Update chat history
        console.log(`📚 Adding auto-request messages to chat history (user prompt + response)`);
        chatHistory.push({ role: "user", content: defaultPrompt });
        chatHistory.push({ role: "assistant", content: response });
    } catch (error) {
        const phaseChangeEndTime = performance.now();
        const phaseChangeElapsedTime = (phaseChangeEndTime - phaseChangeStartTime) / 1000;
        console.error(`%c❌ PHASE CHANGE AUTO-REQUEST FAILED after ${phaseChangeElapsedTime.toFixed(2)} seconds:`, 'color: red; font-weight: bold;', error);
        
        // Remove loading indicator
        removeLoadingIndicator();
        // Show error message
        addMessage(`Error: ${error.message}`, 'assistant');
    }
}

// Function to clear chat
function clearChat() {
    console.log(`%c🧹 CLEAR CHAT BUTTON CLICKED`, 'color: red; font-weight: bold;');
    console.log(`📚 Clearing chat history array (was ${chatHistory.length} messages)`);
    chatHistory = [];
    
    // Reset to technical phase
    const oldPhase = currentPhase;
    currentPhase = "technical";
    console.log(`🔄 Resetting to technical phase (was ${oldPhase})`);
    
    // Update UI to show technical phase is active
    updateActivePhasesUI("technical");
    console.log(`🎨 Updated UI to show technical phase is active`);
    
    console.log(`🗑️ Clearing chat messages from DOM`);
    chatMessages.innerHTML = `
        <div class="message assistant-message">
            Welcome to the Intercos Group assistant! I can help with product documentation.<br><br>
            The system is in technical phase. Paste your TDS document to begin.
        </div>
    `;
    console.log(`✅ Chat cleared, welcome message restored, now in technical phase`);
}

// Event listeners
sendButton.addEventListener('click', handleSendMessage);

userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
    }
});

saveApiKeyButton.addEventListener('click', () => {
    console.log(`%c🔑 SAVE API KEY BUTTON CLICKED`, 'color: purple; font-weight: bold;');
    apiKey = apiKeyInput.value.trim();
    if (apiKey) {
        console.log(`✅ API key provided (length: ${apiKey.length}), saving to local storage`);
        localStorage.setItem('openai_api_key', apiKey);
        apiKeyContainer.style.display = 'none';
        console.log(`🔒 API key saved and form hidden`);
    } else {
        console.log(`❌ Empty API key, not saving`);
    }
});

clearChatButton.addEventListener('click', clearChat);

// Add event listeners to phase buttons
phaseButtons.forEach(button => {
    button.addEventListener('click', () => {
        const phase = button.dataset.phase;
        handlePhaseButtonClick(phase);
    });
});
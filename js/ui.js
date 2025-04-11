/**
 * UI interaction functions
 */

// Function to add message to the chat
function addMessage(text, sender) {
    console.log(`%c📝 ADDING MESSAGE - Sender: ${sender}`, 'color: teal;');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}-message`;
    
    // Process markdown
    console.log(`🖋️ Processing markdown (${text.length} chars)`);
    const startMarkdown = performance.now();
    messageElement.innerHTML = marked.parse(text);
    const endMarkdown = performance.now();
    console.log(`⏱️ Markdown processed in ${((endMarkdown - startMarkdown)/1000).toFixed(3)} seconds`);
    
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    console.log(`✅ Message added to chat`);
}

// Function to create and add loading indicator
function addLoadingIndicator() {
    console.log(`⏳ Adding loading indicator`);
    const loadingElement = document.createElement('div');
    loadingElement.className = 'loading';
    loadingElement.textContent = 'Processing...';
    loadingElement.id = 'loadingIndicator';
    chatMessages.appendChild(loadingElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return loadingElement;
}

// Function to remove loading indicator
function removeLoadingIndicator() {
    const loadingElement = document.getElementById('loadingIndicator');
    if (loadingElement) {
        console.log(`🧹 Removing loading indicator`);
        chatMessages.removeChild(loadingElement);
    }
}

// Function to set active phase
function updateActivePhasesUI(phase) {
    console.log(`🎨 Updating active phase UI to: ${phase}`);
    phaseButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.phase-btn[data-phase="${phase}"]`).classList.add('active');
}
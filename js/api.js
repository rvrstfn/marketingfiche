/**
 * API module for OpenAI interactions
 */

// API functions
async function callOpenAI(message, systemPrompt, model) {
    console.log(`%c🌐 OPENAI API CALL - Model: ${model}`, 'color: orange; font-weight: bold;');
    const requestStartTime = performance.now();
    
    const messages = [];
    
    // Add system message if provided
    if (systemPrompt) {
        messages.push({
            role: "system",
            content: systemPrompt
        });
        console.log(`🧠 Added system prompt (${systemPrompt.length} chars)`);
    } else {
        console.log(`🧠 No system prompt provided`);
    }
    
    // Add chat history
    console.log(`📚 Adding chat history - ${chatHistory.length} messages`);
    messages.push(...chatHistory);
    
    // Add user message
    messages.push({
        role: "user",
        content: message
    });
    console.log(`📤 Added user message (${message.length} chars)`);
    
    // Calculate token estimation
    const estimatedTokens = Math.ceil(
        messages.reduce((acc, msg) => acc + msg.content.length, 0) / 4
    );
    console.log(`🧮 Estimated tokens: ~${estimatedTokens}`);

    console.log(`📡 Sending request to OpenAI API...`);
    const apiStartTime = performance.now();
    
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: messages,
                temperature: 1
            })
        });
        
        const apiEndTime = performance.now();
        const apiElapsedTime = (apiEndTime - apiStartTime) / 1000;
        console.log(`⏱️ API response received in ${apiElapsedTime.toFixed(2)} seconds`);

        if (!response.ok) {
            const errorData = await response.json();
            console.error(`❌ API Error:`, errorData);
            throw new Error(errorData.error?.message || "Failed to get response from OpenAI");
        }

        const data = await response.json();
        
        // Log token usage if available
        if (data.usage) {
            console.log(`%c📊 TOKEN USAGE:`, 'color: blue;');
            console.log(`   Prompt tokens: ${data.usage.prompt_tokens}`);
            console.log(`   Completion tokens: ${data.usage.completion_tokens}`);
            console.log(`   Total tokens: ${data.usage.total_tokens}`);
        }
        
        const content = data.choices[0].message.content;
        const requestEndTime = performance.now();
        const totalTime = (requestEndTime - requestStartTime) / 1000;
        
        console.log(`%c✅ OpenAI request completed in ${totalTime.toFixed(2)} seconds`, 'color: green; font-weight: bold;');
        console.log(`📥 Response content length: ${content.length} chars`);
        
        return content;
    } catch (error) {
        const requestEndTime = performance.now();
        const totalTime = (requestEndTime - requestStartTime) / 1000;
        console.error(`%c❌ OpenAI request failed after ${totalTime.toFixed(2)} seconds:`, 'color: red; font-weight: bold;', error);
        throw error;
    }
}
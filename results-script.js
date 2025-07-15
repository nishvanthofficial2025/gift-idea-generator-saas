document.addEventListener('DOMContentLoaded', async () => {
    // --- IMPORTANT: PASTE YOUR N8N WEBHOOK URL HERE ---
    const N8N_WEBHOOK_URL = 'https://capital-monkfish-wrongly.ngrok-free.app/webhook-test/4c035729-6429-4891-b426-a9b7b0411cbe'; 

    const resultsContainer = document.getElementById('results-container');
    
    // Function to display an error message
    const displayError = (message) => {
        resultsContainer.innerHTML = `<div class="error-card">${message}</div>`;
    };

    // Show loader immediately
    resultsContainer.innerHTML = `
        <div class="loader-container">
            <div class="loader"></div>
            <p>Contacting the creative core...</p>
        </div>
    `;

    const payloadString = sessionStorage.getItem('userPayload');

    if (!payloadString) {
        displayError('No prompt data found. Please <a href="index.html">go back</a> and enter a prompt.');
        return;
    }
    
    if (N8N_WEBHOOK_URL === 'YOUR_N8N_WEBHOOK_URL_HERE') {
        displayError("Developer Error: n8n webhook URL is not set in results-script.js. Please paste your webhook URL.");
        return;
    }

    try {
        const payload = JSON.parse(payloadString);

        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`The workflow returned an error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        resultsContainer.innerHTML = ''; // Clear loader
        
        if (data.results && data.results.length > 0) {
            data.results.forEach(item => {
                const resultWrapper = document.createElement('div');
                resultWrapper.className = 'result-item-wrapper';

                resultWrapper.innerHTML = `
                    <div class="product-card">
                        <div class="product-image-placeholder"></div>
                        <div class="product-info">
                            <h3>${item.title}</h3>
                            <p>${item.description}</p>
                        </div>
                        <a href="#" class="cta-button">View Product Example →</a>
                    </div>
                    <div class="experience-panel">
                        <div class="experience-item">
                            <strong>💌 Card Message</strong><p>${item.cardMessage}</p>
                        </div>
                        <div class="experience-item">
                            <strong>🎁 Presentation</strong><p>${item.presentationIdea}</p>
                        </div>
                        <div class="experience-item">
                            <strong>🎉 Paired Activity</strong><p>${item.activityIdea}</p>
                        </div>
                    </div>
                `;
                resultsContainer.appendChild(resultWrapper);
            });
        } else {
             displayError("The AI didn't return any results. Please try refining your prompt.");
        }
    } catch (error) {
        console.error('An error occurred:', error);
        displayError(`An error occurred while fetching your results. Please check the browser console for details and ensure your n8n workflow is active.`);
    }
});
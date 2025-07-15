document.addEventListener('DOMContentLoaded', () => {
    // --- ENHANCED BUDGET SLIDER SCRIPT ---
    const budgetSlider = document.getElementById('budget-slider');
    const budgetValueDisplay = document.getElementById('budget-value');
    const sliderValueTooltip = document.getElementById('slider-value-tooltip');
    const budgetOptions = ['Any', '$0 - $25', '$25 - $50', '$50 - $100+'];

    function updateBudgetValueAndPosition() {
        if (!budgetSlider || !budgetValueDisplay || !sliderValueTooltip) return;

        const value = budgetSlider.value;
        budgetValueDisplay.textContent = budgetOptions[value];

        const min = budgetSlider.min ? budgetSlider.min : 0;
        const max = budgetSlider.max ? budgetSlider.max : 100;
        const percent = (value - min) / (max - min);

        const tooltipPosition = percent * (budgetSlider.offsetWidth - 20) + 10;
        sliderValueTooltip.style.left = `calc(${tooltipPosition}px - ${sliderValueTooltip.offsetWidth / 2}px)`;
    }

    if (budgetSlider) {
        budgetSlider.addEventListener('input', updateBudgetValueAndPosition);
        updateBudgetValueAndPosition();
        window.addEventListener('resize', updateBudgetValueAndPosition);
    }

    // --- NEW: Advanced Exclusions Script ---
    const addExclusionsBtn = document.getElementById('add-exclusions-btn');
    const avoidDetails = document.getElementById('avoid-details');
    const avoidInput = document.getElementById('avoid-tags');
    const suggestedTags = document.querySelectorAll('.suggested-tags .tag');

    if (addExclusionsBtn) {
        addExclusionsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            avoidDetails.classList.toggle('hidden');
        });
    }

    suggestedTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const tagText = tag.textContent;
            // Prevent adding duplicate tags
            const currentValues = avoidInput.value.split(',').map(v => v.trim().toLowerCase());
            if (currentValues.includes(tagText.toLowerCase())) return;

            if (avoidInput.value.trim() === '') {
                avoidInput.value = tagText;
            } else {
                avoidInput.value += `, ${tagText}`;
            }
            tag.classList.add('added'); // Visually mark as added
        });
    });
    
    // --- FORM SUBMISSION SCRIPT ---
    const promptForm = document.getElementById('prompt-form');
    if (promptForm) {
        promptForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const payload = {
                occasion: document.getElementById('occasion').value,
                budget: document.getElementById('budget-value').textContent,
                interests: document.getElementById('interests').value.trim(),
                prompt: document.getElementById('user-prompt').value.trim(),
                avoid: document.getElementById('avoid-tags').value.trim() // Reads from the new input
            };

            if (!payload.prompt) {
                alert('Please describe the person and the occasion to get the best results.');
                return;
            }

            sessionStorage.setItem('userPayload', JSON.stringify(payload));
            window.location.href = 'results.html';
        });
    }
});
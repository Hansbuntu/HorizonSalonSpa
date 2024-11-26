document.addEventListener('DOMContentLoaded', async () => {
    const serviceSelect = document.getElementById('service');
    const timeSelect = document.getElementById('time');
    const dateInput = document.getElementById('date');

    // Check if messageContainer already exists, else create one
    let messageContainer = document.querySelector('.message');
    if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.classList.add('message');
        timeSelect.parentElement.appendChild(messageContainer); // Append below time dropdown
    }

    // Fetch and populate services
    const fetchServices = async () => {
        try {
            const response = await fetch('http://localhost:3000/services');
            const services = await response.json();
            console.log('Fetched services:', services);
            services.forEach(service => {
                const option = document.createElement('option');
                option.value = service.id;
                option.textContent = service.name;
                serviceSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    // Fetch and populate available times based on selected date
    const fetchAvailability = async (date) => {
        try {
            const response = await fetch(`http://localhost:3000/availability/${date}`);
            const times = await response.json();
            console.log('Fetched times for date', date, ':', times);

            // Clear previous options and message
            timeSelect.innerHTML = '';
            messageContainer.textContent = '';

            if (times.length === 0) {
                messageContainer.textContent = 'No available times for this date. Please choose another date.';
            } else {
                times.forEach(time => {
                    const option = document.createElement('option');
                    option.value = time;
                    option.textContent = time;
                    timeSelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Error fetching availability:', error);
            messageContainer.textContent = 'Error fetching available times. Please try again.';
        }
    };

    // Initialize services on page load
    await fetchServices();

    // Listen for changes on the date input and fetch available times
    dateInput.addEventListener('change', (event) => {
        const selectedDate = event.target.value;
        if (selectedDate) {
            fetchAvailability(selectedDate);
        }
    });
});

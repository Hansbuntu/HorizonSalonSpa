document.addEventListener('DOMContentLoaded', () => {
    const bookingsTable = document.getElementById('bookingsTable').querySelector('tbody');

    // Fetch all bookings
    const fetchBookings = async () => {
        try {
            const response = await fetch('/admin/bookings');
            const bookings = await response.json();
            console.log('Fetched bookings:', bookings);

            bookingsTable.innerHTML = ''; // Clear the table
            bookings.forEach(booking => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${booking.id}</td>
                    <td>${booking.name}</td>
                    <td>${booking.service}</td>
                    <td>${booking.appointment_date}</td>
                    <td>${booking.appointment_time}</td>
                    <td>${booking.status}</td>
                    <td class="actions">
                        ${booking.status === 'Pending' ? `
                            <button class="approve" data-id="${booking.id}">Approve</button>
                            <button class="cancel" data-id="${booking.id}">Cancel</button>
                            <button class="delete" data-id="${booking.id}">Delete</button>
                        ` : ''}
                    </td>
                `;
                bookingsTable.appendChild(row);
            });

            // Attach event listeners to buttons
            document.querySelectorAll('.approve').forEach(button => {
                button.addEventListener('click', () => handleBookingAction(button.dataset.id, 'Approved'));
            });

            document.querySelectorAll('.cancel').forEach(button => {
                button.addEventListener('click', () => handleBookingAction(button.dataset.id, 'Canceled'));
            });

            document.querySelectorAll('.delete').forEach(button => {
                button.addEventListener('click', () => deleteBooking(button.dataset.id));
            });
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    // Handle booking action (Approve or Cancel)
    const handleBookingAction = async (id, status) => {
        try {
            const response = await fetch(`/admin/bookings/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            const updatedBooking = await response.json();
            console.log('Updated booking:', updatedBooking);
            fetchBookings(); // Refresh the bookings table
        } catch (error) {
            console.error(`Error updating booking ID ${id}:`, error);
        }
    };

    // Delete a booking
    const deleteBooking = async (id) => {
        try {
            await fetch(`/admin/bookings/${id}`, {
                method: 'DELETE'
            });
            console.log(`Booking ID ${id} deleted.`);
            fetchBookings(); // Refresh the bookings table
        } catch (error) {
            console.error(`Error deleting booking ID ${id}:`, error);
        }
    };

    fetchBookings(); // Fetch bookings on page load
});

// Import the necessary modules
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path'); // Required for serving static files
const app = express();

// Sample data for services and availability
const services = [
    { id: 1, name: 'Massage' },
    { id: 2, name: 'Manicure' },
    { id: 3, name: 'Facials' },
    { id: 4, name: 'Waxing' }
];

const availability = {
    '2024-11-11': ['10:00 AM', '11:00 AM', '2:00 PM'],
    '2024-11-12': ['9:00 AM', '1:00 PM', '3:00 PM'],
    '2024-11-16': ['9:00 AM', '1:00 PM', '3:00 PM']
};

// Store bookings in an array (to be replaced with a database later)
let bookings = [];

// Middleware to parse JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the "public" folder
app.use(express.static('public'));

// Nodemailer configuration (replace with HorizonSalonSpa’s email credentials)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'hansdevtest450@gmail.com', // HorizonSalonSpa's email
        pass: 'afgf cltl wiyu pfmr' // HorizonSalonSpa's app-specific password
    }
});

// Route to get services
app.get('/services', (req, res) => {
    res.json(services); // Sends JSON data for services
});

// Route to get available times for a given date
app.get('/availability/:date', (req, res) => {
    const date = req.params.date;
    const times = availability[date] || []; // Sends available times or an empty array if date not found
    res.json(times);
});

// Route to handle new bookings
app.post('/book-appointment', (req, res) => {
    const { service_id, appointment_date, appointment_time, name, email, phone, comments } = req.body;

    const newBooking = {
        id: bookings.length + 1, // Generate a unique ID
        service: services.find(service => service.id == service_id)?.name || 'Unknown Service',
        appointment_date,
        appointment_time,
        name,
        email,
        phone,
        comments,
        status: 'Pending' // Default status
    };

    // Add the new booking to the array
    bookings.push(newBooking);
    console.log('New booking added:', newBooking);

    // Email content for HorizonSalonSpa
    const mailOptions = {
        from: email, // Send from the client's email
        to: 'tineiyafarrhan@gmail.com', // HorizonSalonSpa's email
        subject: 'New Appointment Booking at HorizonSalonSpa',
        text: `
            A new booking has been made with the following details:

            Service: ${newBooking.service}
            Date: ${appointment_date}
            Time: ${appointment_time}

            Client Information:
            Name: ${name}
            Email: ${email}
            Phone: ${phone}

            Comments:
            ${comments}
        `
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            res.status(500).send('There was an error with your booking. Please try again.');
        } else {
            console.log('Email sent:', info.response);
            res.redirect('/confirmation.html');
        }
    });
});

// Route to fetch all bookings for the admin dashboard
app.get('/admin/bookings', (req, res) => {
    res.json(bookings); // Send all bookings as JSON
});

// Route to update a booking's status
app.put('/admin/bookings/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const booking = bookings.find(b => b.id === parseInt(id));
    if (!booking) return res.status(404).send('Booking not found.');

    booking.status = status; // Update the booking's status
    console.log(`Booking ID ${id} updated to status: ${status}`);
    res.json(booking);
});

// Route to delete a booking
app.delete('/admin/bookings/:id', (req, res) => {
    const { id } = req.params;

    const index = bookings.findIndex(b => b.id === parseInt(id));
    if (index === -1) return res.status(404).send('Booking not found.');

    bookings.splice(index, 1); // Remove the booking from the array
    console.log(`Booking ID ${id} deleted.`);
    res.sendStatus(204); // No Content
});

// Serve the confirmation page
app.get('/confirmation.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'confirmation.html'));
});

// Serve the admin dashboard
app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Test route to ensure server is running
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Set the server to listen on a specific port
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

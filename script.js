// script.js

// 1. Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// 2. Job Seeker Form Submission
const jobSeekerForm = document.getElementById('job-seeker-form');
const jobSeekerList = document.getElementById('job-seeker-list');

// Load existing job seekers from localStorage (if any)
let jobSeekers = JSON.parse(localStorage.getItem('jobSeekers')) || [];

jobSeekerForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent page refresh

    // Get form values
    const jobSeeker = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        category: document.getElementById('category').value,
        skills: document.getElementById('skills').value.split(',').map(skill => skill.trim()),
        experience: document.getElementById('experience').value,
        id: Date.now() // Unique ID based on timestamp
    };

    // Add to array and save to localStorage
    jobSeekers.push(jobSeeker);
    localStorage.setItem('jobSeekers', JSON.stringify(jobSeekers));

    // Clear form
    jobSeekerForm.reset();

    // Update employer dashboard
    displayJobSeekers(jobSeekers);

    alert('Registration successful! Employers can now find you.');
});

// 3. Employer Dashboard Functions
function displayJobSeekers(jobSeekersArray) {
    jobSeekerList.innerHTML = ''; // Clear current list

    jobSeekersArray.forEach(seeker => {
        const seekerCard = document.createElement('div');
        seekerCard.classList.add('job-seeker-card');
        seekerCard.innerHTML = `
            <h3>${seeker.name}</h3>
            <p><strong>Category:</strong> ${seeker.category}</p>
            <p><strong>Skills:</strong> ${seeker.skills.join(', ')}</p>
            <p><strong>Experience:</strong> ${seeker.experience} years</p>
            <p><strong>Contact:</strong> ${seeker.email} | ${seeker.phone}</p>
            <button onclick="contactJobSeeker('${seeker.email}')">Contact</button>
        `;
        jobSeekerList.appendChild(seekerCard);
    });
}

// Initial display of all job seekers
displayJobSeekers(jobSeekers);

// Search Job Seekers
function searchJobSeekers() {
    const searchTerm = document.getElementById('employer-search').value.toLowerCase();
    const filteredSeekers = jobSeekers.filter(seeker => 
        seeker.name.toLowerCase().includes(searchTerm) ||
        seeker.skills.some(skill => skill.toLowerCase().includes(searchTerm)) ||
        seeker.category.toLowerCase().includes(searchTerm)
    );
    displayJobSeekers(filteredSeekers);
}

// Filter Job Seekers by Category
function filterJobSeekers() {
    const category = document.getElementById('filter-category').value;
    const filteredSeekers = category === 'all' 
        ? jobSeekers 
        : jobSeekers.filter(seeker => seeker.category === category);
    displayJobSeekers(filteredSeekers);
}

// Contact Job Seeker (placeholder - could integrate email later)
function contactJobSeeker(email) {
    alert(`Contacting ${email} - feature coming soon!`);
}

// 4. Scroll Animation for Sections
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.content-section').forEach(section => {
    observer.observe(section);
});

// script.js

// 1. Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
} else {
    console.error('Hamburger or nav-links not found');
}

// 2. Data Storage and Retrieval Functions
const JOB_SEEKERS_KEY = 'jobSeekers';

function getJobSeekers() {
    try {
        const data = localStorage.getItem(JOB_SEEKERS_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error retrieving job seekers:', error);
        return [];
    }
}

function saveJobSeekers(jobSeekers) {
    try {
        localStorage.setItem(JOB_SEEKERS_KEY, JSON.stringify(jobSeekers));
        return true;
    } catch (error) {
        console.error('Error saving job seekers:', error);
        return false;
    }
}

function getJobSeekerById(id) {
    const jobSeekers = getJobSeekers();
    return jobSeekers.find(seeker => seeker.id === id) || null;
}

// 3. Job Seeker Form Submission
const jobSeekerForm = document.getElementById('job-seeker-form');
const jobSeekerList = document.getElementById('job-seeker-list');

if (!jobSeekerForm) {
    console.error('Form with ID "job-seeker-form" not found');
} else {
    console.log('Form found, attaching event listener');
    jobSeekerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Form submitted');

        const jobSeeker = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            category: document.getElementById('category').value,
            skills: document.getElementById('skills').value.split(',').map(skill => skill.trim()),
            experience: parseInt(document.getElementById('experience').value, 10),
            id: Date.now()
        };

        console.log('Job Seeker Data:', jobSeeker);

        if (!jobSeeker.name || !jobSeeker.email || !jobSeeker.phone || !jobSeeker.category || !jobSeeker.skills.length || isNaN(jobSeeker.experience)) {
            alert('Please fill out all fields correctly.');
            console.log('Validation failed');
            return;
        }

        jobSeekers.push(jobSeeker);
        if (saveJobSeekers(jobSeekers)) {
            jobSeekerForm.reset();
            displayJobSeekers(jobSeekers);
            alert('Registration successful! Employers can now find you.');
            console.log('Data saved and displayed');
        } else {
            alert('Failed to save your data. Please try again.');
            console.log('Save failed');
        }
    });
}

let jobSeekers = getJobSeekers();

// 4. Employer Dashboard Functions
function displayJobSeekers(jobSeekersArray) {
    if (!jobSeekerList) {
        console.error('Job seeker list container not found');
        return;
    }
    jobSeekerList.innerHTML = '';

    if (jobSeekersArray.length === 0) {
        jobSeekerList.innerHTML = '<p>No job seekers found.</p>';
        return;
    }

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
            <button onclick="deleteJobSeeker(${seeker.id})" class="delete-btn">Delete</button>
        `;
        jobSeekerList.appendChild(seekerCard);
    });
}

// Initial display
displayJobSeekers(jobSeekers);

// 5. Search Job Seekers
function searchJobSeekers() {
    const searchInput = document.getElementById('employer-search');
    if (!searchInput) {
        console.error('Search input not found');
        return;
    }
    const searchTerm = searchInput.value.toLowerCase().trim();
    const filteredSeekers = jobSeekers.filter(seeker => 
        seeker.name.toLowerCase().includes(searchTerm) ||
        seeker.skills.some(skill => skill.toLowerCase().includes(searchTerm)) ||
        seeker.category.toLowerCase().includes(searchTerm)
    );
    displayJobSeekers(filteredSeekers);
}

// 6. Filter Job Seekers by Category
function filterJobSeekers() {
    const filterSelect = document.getElementById('filter-category');
    if (!filterSelect) {
        console.error('Filter select not found');
        return;
    }
    const category = filterSelect.value;
    const filteredSeekers = category === 'all' 
        ? jobSeekers 
        : jobSeekers.filter(seeker => seeker.category === category);
    displayJobSeekers(filteredSeekers);
}

// 7. Contact and Delete Functions
function contactJobSeeker(email) {
    alert(`Contacting ${email} - feature coming soon!`);
}

function deleteJobSeeker(id) {
    if (confirm('Are you sure you want to delete this job seeker?')) {
        jobSeekers = jobSeekers.filter(seeker => seeker.id !== id);
        if (saveJobSeekers(jobSeekers)) {
            displayJobSeekers(jobSeekers);
            alert('Job seeker deleted successfully.');
        } else {
            alert('Failed to delete job seeker.');
        }
    }
}

// 8. Scroll Animation for Sections
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
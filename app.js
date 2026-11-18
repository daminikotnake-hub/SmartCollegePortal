
let collegeData = {};

// LOAD JSON DATA
async function loadData() {
    try {
        const response = await fetch("data.json");

        if (!response.ok) {
            throw new Error("Could not load college data");
        }

        collegeData = await response.json();
        renderPage();

    } catch (error) {
        document.getElementById("content").innerHTML =
            "<h2>Unable to load data. Please run using Live Server.</h2>";
        console.error(error);
    }
}

// SPA ROUTING
function renderPage() {
    const page = location.hash.replace("#", "") || "home";

    const content = document.getElementById("content");

    if (page === "home") {
        content.innerHTML = `
            <section class="hero">
                <h1>Welcome to DYP College</h1>
                <p>Learn, Grow and Build Your Future With Us.</p>
                <a href="#departments" class="btn">
                    Explore Departments
                </a>
            </section>
        `;
    }

    else if (page === "departments") {
        content.innerHTML = `
            <h2>Our Departments</h2>
            <div class="card-container">
                ${collegeData.departments.map(dept => `
                    <div class="card">
                        <h3>${dept.name}</h3>
                        <p>${dept.description}</p>
                    </div>
                `).join("")}
            </div>
        `;
    }

    else if (page === "courses") {
        content.innerHTML = `
            <h2>Our Courses</h2>
            <div class="card-container">
                ${collegeData.courses.map(course => `
                    <div class="card">
                        <h3>${course.name}</h3>
                        <p>Duration: ${course.duration}</p>
                    </div>
                `).join("")}
            </div>
        `;
    }

    else if (page === "faculty") {
        content.innerHTML = `
            <h2>Our Faculty</h2>
            <div class="card-container">
                ${collegeData.faculty.map(person => `
                    <div class="card">
                        <h3>${person.name}</h3>
                        <p>${person.department}</p>
                        <p>${person.designation}</p>
                    </div>
                `).join("")}
            </div>
        `;
    }

    else if (page === "notices") {
        content.innerHTML = `
            <h2>College Notices</h2>
            <div class="card-container">
                ${collegeData.notices.map(notice => `
                    <div class="card">
                        <h3>${notice.title}</h3>
                        <p>${notice.description}</p>
                    </div>
                `).join("")}
            </div>
        `;
    }

    else if (page === "enquiry") {
        content.innerHTML = `
            <h2>Student Enquiry Form</h2>

            <form id="enquiryForm">
                <input type="text" id="name"
                    placeholder="Enter your name" required>

                <input type="email" id="email"
                    placeholder="Enter your email" required>

                <input type="tel" id="phone"
                    placeholder="Enter 10 digit mobile number"
                    pattern="[0-9]{10}" required>

                <select id="department" required>
                    <option value="">Select Department</option>
                    ${collegeData.departments.map(dept => `
                        <option value="${dept.name}">
                            ${dept.name}
                        </option>
                    `).join("")}
                </select>

                <textarea id="message"
                    placeholder="Enter your enquiry"
                    required></textarea>

                <button type="submit">Submit Enquiry</button>
            </form>

            <p id="formMessage"></p>
        `;

        document.getElementById("enquiryForm")
            .addEventListener("submit", validateForm);
    }

    else {
        content.innerHTML = `
            <h2>Page Not Found</h2>
            <a href="#home">Go to Home</a>
        `;
    }
}

// FORM VALIDATION
function validateForm(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const department = document.getElementById("department").value;
    const message = document.getElementById("message").value.trim();

    const formMessage = document.getElementById("formMessage");

    if (!name || !email || !phone || !department || !message) {
        formMessage.textContent = "Please fill all fields.";
        return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
        formMessage.textContent =
            "Please enter a valid 10 digit mobile number.";
        return;
    }

    formMessage.textContent =
        "Your enquiry has been submitted successfully!";

    document.getElementById("enquiryForm").reset();
}

// NAVIGATION WITHOUT PAGE RELOAD
window.addEventListener("hashchange", renderPage);

// INITIALIZE WEBSITE
loadData();

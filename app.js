/**
 * ALFRED UNIVERSITY - SMART COLLEGE PORTAL
 * SPA Routing, Dynamic JSON Data Loading, Responsive UI, and Client-Side Validation
 * Web Technology CCE-5 Project • Damini Kotnake (Roll No: 229, Batch WT C1)
 */

// Application State
let portalData = null;
let currentSlideIndex = 0;
let carouselTimer = null;

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
    initApp();
});

async function initApp() {
    setupEventListeners();
    await loadData();
    renderPage();
}

/**
 * ASYNCHRONOUS JSON DATA LOADING
 */
async function loadData() {
    try {
        const response = await fetch("data.json");
        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        portalData = await response.json();
    } catch (error) {
        console.error("Failed to load college data from data.json:", error);
        // Fallback placeholder data if running directly via file:// protocol
        portalData = getFallbackData();
        showToast("Loaded local college dataset.", "info");
    }
}

/**
 * CLIENT-SIDE ROUTER (SPA WITHOUT PAGE RELOAD)
 */
function renderPage() {
    const rawRoute = window.location.hash.replace("#", "").trim();
    const route = rawRoute.split("?")[0] || "home";

    // Update Document Title
    const routeTitles = {
        home: "Home | Founded in 1836",
        admissions: "Admissions & Aid",
        academics: "Academics & Departments",
        "campus-life": "Campus Life & Arts",
        individuals: "Individuals & AU Stars",
        athletics: "Saxon Athletics",
        news: "Newsroom & Media",
        enquiry: "Schedule a Visit & Student Enquiry",
        visit: "Schedule a Visit & Student Enquiry"
    };

    document.title = `Alfred University | ${routeTitles[route] || "Page Not Found"}`;

    // Update active state in Navigation
    updateActiveNav(route);

    // Close mobile nav if open
    const mainNav = document.getElementById("mainNav");
    if (mainNav) mainNav.classList.remove("open");

    // Clear any previous carousel timer
    if (carouselTimer) {
        clearInterval(carouselTimer);
        carouselTimer = null;
    }

    const contentArea = document.getElementById("content");
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Route dispatch
    switch (route) {
        case "home":
            contentArea.innerHTML = getHomeHTML();
            initHomeInteractions();
            break;
        case "admissions":
            contentArea.innerHTML = getAdmissionsHTML();
            break;
        case "academics":
            contentArea.innerHTML = getAcademicsHTML();
            initAcademicsFilter();
            break;
        case "campus-life":
            contentArea.innerHTML = getCampusLifeHTML();
            break;
        case "individuals":
            contentArea.innerHTML = getIndividualsHTML();
            break;
        case "athletics":
            contentArea.innerHTML = getAthleticsHTML();
            break;
        case "news":
            contentArea.innerHTML = getNewsHTML();
            break;
        case "enquiry":
        case "visit":
            contentArea.innerHTML = getEnquiryHTML();
            initEnquiryValidation();
            break;
        default:
            contentArea.innerHTML = getNotFoundHTML();
            break;
    }
}

function updateActiveNav(activeRoute) {
    document.querySelectorAll(".nav-item").forEach(item => {
        const itemRoute = item.getAttribute("data-route");
        if (itemRoute === activeRoute || (activeRoute === "home" && itemRoute === "")) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });
}

/**
 * VIEW GENERATORS
 */

// 1. HOME VIEW (Matches the screenshot layout & elements)
function getHomeHTML() {
    if (!portalData) return `<div class="loading-spinner-container"><div class="spinner"></div><p>Loading...</p></div>`;

    const slides = portalData.heroSlides || [];
    const activeSlide = slides[currentSlideIndex] || slides[0] || {};
    const visit = portalData.visitCampus || {};
    const news = portalData.inTheNews || [];
    const spotlight = portalData.spotlight || [];
    const didYouKnow = portalData.didYouKnow || {};
    const stayConnected = portalData.stayConnected || {};
    const auStars = portalData.auStars || {};

    return `
        <!-- HERO BANNER -->
        <section class="hero-banner" id="heroBanner">
            <div class="container hero-container">
                <div class="hero-grid">
                    <div class="hero-left">
                        <h1 class="hero-headline" id="heroTagline">
                            <span>${activeSlide.tagline1 || "INDIVIDUALS."}</span>
                            <span>${activeSlide.tagline2 || "INSPIRED."}</span>
                        </h1>
                    </div>
                    <div class="hero-right">
                        <p class="hero-subtitle" id="heroSubtitle">
                            ${activeSlide.subtitle || "Follow your inspiration. Pursue your interests. Study abroad. Join a team. Start something new. AU is the place where you can be yourself - whoever you may be."}
                        </p>
                        <a href="${activeSlide.buttonAction || "#academics"}" class="btn btn-hero" id="heroCta">
                            ${activeSlide.buttonText || "Find your major"}
                        </a>
                    </div>
                </div>

                <!-- Carousel indicator dots -->
                <div class="hero-dots" aria-label="Hero carousel pagination">
                    ${slides.map((_, i) => `
                        <button class="dot ${i === currentSlideIndex ? 'active' : ''}" 
                                onclick="switchHeroSlide(${i})" 
                                aria-label="Slide ${i + 1}"></button>
                    `).join("")}
                </div>
            </div>
        </section>

        <!-- OVERLAPPING MID SECTION: VISITING / NEWS + SPOTLIGHT -->
        <section class="home-mid-section">
            <div class="container">
                <div class="home-mid-grid">
                    
                    <!-- LEFT STACKED CARDS -->
                    <div class="cards-stacked">
                        <!-- Visit the Campus Card -->
                        <div class="visit-card">
                            <h3>${visit.title || "VISIT THE CAMPUS"}</h3>
                            <p>${visit.description || "Experience life at Alfred University firsthand. Tour our beautiful valley campus, meet inspiring faculty, and discover the creative spirit that makes AU extraordinary."}</p>
                            
                            <div class="visit-actions-row">
                                <a href="#enquiry" class="btn btn-visit">${visit.scheduleButton || "Schedule a visit"}</a>
                                <a href="javascript:void(0)" class="link-directions" onclick="openDirectionsModal()">
                                    ${visit.directionsLink || "Get directions"}
                                </a>
                            </div>

                            <a href="javascript:void(0)" class="btn btn-outline" onclick="openGalleryModal()">
                                ${visit.galleryButton || "Visit our gallery"}
                            </a>
                        </div>

                        <!-- In The News Card -->
                        <div class="news-card">
                            <h3>IN THE NEWS</h3>
                            <div class="news-headlines-list">
                                ${news.map(item => `
                                    <div class="news-headline-item">
                                        <a href="javascript:void(0)" onclick="openNewsDetailModal('${item.id}')">
                                            ${item.title}
                                        </a>
                                    </div>
                                `).join("")}
                            </div>
                            <a href="#news" class="btn btn-newsroom">Newsroom</a>
                        </div>
                    </div>

                    <!-- RIGHT SPOTLIGHT COLUMN -->
                    <div class="spotlight-box">
                        <div class="spotlight-header">
                            <h2>SPOTLIGHT</h2>
                        </div>
                        <div class="spotlight-list">
                            ${spotlight.map(item => `
                                <article class="spotlight-item">
                                    <div class="spotlight-thumb">
                                        <img src="${item.image}" alt="${item.title}" loading="lazy">
                                    </div>
                                    <div class="spotlight-content">
                                        <h3 class="spotlight-title">
                                            <a href="javascript:void(0)" onclick="openSpotlightDetailModal('${item.id}')">
                                                ${item.title}
                                            </a>
                                        </h3>
                                        <time class="spotlight-date">${item.date}</time>
                                        <p class="spotlight-desc">${item.description}</p>
                                    </div>
                                </article>
                            `).join("")}
                        </div>
                    </div>

                </div>
            </div>
        </section>

        <!-- LOWER 3-COLUMN FEATURE SECTION -->
        <section class="home-features-section">
            <div class="container">
                <div class="features-grid">
                    
                    <!-- Column 1: DID YOU KNOW? -->
                    <div class="feature-col">
                        <h4>${didYouKnow.title || "DID YOU KNOW?"}</h4>
                        <p>${didYouKnow.highlight || "AU's School of Business is again rated one of the top in the nation by the Princeton Review."}</p>
                        <p style="margin-top: 10px; font-size: 0.82rem; color: #64748b;">
                            13:1 Student-Faculty Ratio &bull; 98% Graduate Success Rate &bull; Founded 1836
                        </p>
                    </div>

                    <!-- Column 2: STAY CONNECTED -->
                    <div class="feature-col">
                        <h4>${stayConnected.title || "STAY CONNECTED"}</h4>
                        <p>${stayConnected.description || "Stay informed with the latest campus breakthroughs, Saxon athletic victories, alumni milestones, and regional cultural events."}</p>
                        <p style="margin-top: 12px;">
                            <a href="#news" class="link-purple">${stayConnected.primaryLink || "Alfred Online"}</a> | 
                            <a href="#enquiry" class="link-purple">${stayConnected.secondaryLink || "E-News"}</a>
                        </p>
                    </div>

                    <!-- Column 3: AU STARS -->
                    <div class="feature-col">
                        <h4>${auStars.title || "AU STARS"}</h4>
                        <div class="star-card">
                            <img src="${auStars.avatar || 'assets/images/dr-peggy-wozniak.svg'}" 
                                 alt="${auStars.name || 'AU Star'}" 
                                 class="star-avatar">
                            <div class="star-info">
                                <p>
                                    ${auStars.achievement || "AU Alumna Dr. Peggy Wozniak entered the Commission on Independent Colleges and Universities' Hall of Fame."}
                                    <a href="#individuals" class="link-more">More</a>
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    `;
}

// 2. ADMISSIONS VIEW
function getAdmissionsHTML() {
    return `
        <div class="page-header-banner">
            <div class="container">
                <h1>Admissions & Aid</h1>
                <p>Begin your journey as a Saxon. Discover application deadlines, academic scholarships, and personalized campus visits.</p>
            </div>
        </div>

        <div class="container">
            <div class="section-wrapper">
                <h2 class="section-title">Explore Your Path</h2>
                <div class="dynamic-grid" style="margin-top: 25px;">
                    <div class="portal-card">
                        <div class="portal-card-header">
                            <span class="card-icon">🎓</span>
                            <h3>Undergraduate</h3>
                        </div>
                        <p>First-year students ready to discover their major, build hands-on skills, and engage with world-class faculty.</p>
                        <a href="#enquiry" class="btn btn-purple" style="margin-top: auto;">Apply as Freshman</a>
                    </div>
                    <div class="portal-card">
                        <div class="portal-card-header">
                            <span class="card-icon">🔄</span>
                            <h3>Transfer Students</h3>
                        </div>
                        <p>Transfer your completed credits seamlessly. Generous merit scholarships available for qualified transfer candidates.</p>
                        <a href="#enquiry" class="btn btn-purple" style="margin-top: auto;">Transfer Admissions</a>
                    </div>
                    <div class="portal-card">
                        <div class="portal-card-header">
                            <span class="card-icon">📜</span>
                            <h3>Graduate Programs</h3>
                        </div>
                        <p>Ranked MBA programs, top-tier MFA in ceramic & glass arts, and advanced engineering degrees.</p>
                        <a href="#enquiry" class="btn btn-purple" style="margin-top: auto;">Graduate Studies</a>
                    </div>
                </div>
            </div>

            <div class="section-wrapper">
                <h2 class="section-title">Visit & Connect</h2>
                <p style="margin-bottom: 20px;">The best way to know Alfred University is to experience our campus firsthand.</p>
                <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                    <a href="#enquiry" class="btn btn-purple">Schedule an In-Person Tour</a>
                    <button class="btn btn-outline" style="color: var(--color-primary-purple); border-color: var(--color-primary-purple);" onclick="openDirectionsModal()">Get Driving Directions</button>
                    <button class="btn btn-outline" style="color: var(--color-primary-purple); border-color: var(--color-primary-purple);" onclick="openGalleryModal()">Virtual Art Gallery</button>
                </div>
            </div>
        </div>
    `;
}

// 3. ACADEMICS & DEPARTMENTS VIEW
function getAcademicsHTML() {
    const departments = portalData?.departments || [];
    const courses = portalData?.courses || [];

    return `
        <div class="page-header-banner">
            <div class="container">
                <h1>Academic Programs & Majors</h1>
                <p>Innovative education fusing artistic creativity, business leadership, scientific discovery, and engineering excellence.</p>
            </div>
        </div>

        <div class="container">
            <!-- Search & Filter Controls -->
            <div class="filter-search-bar">
                <input type="text" id="academicSearchInput" placeholder="🔍 Search majors, courses, or departments..." aria-label="Search academics">
                <select id="departmentFilterSelect" aria-label="Filter by department">
                    <option value="ALL">All Departments</option>
                    ${departments.map(d => `<option value="${d.name}">${d.name}</option>`).join("")}
                </select>
            </div>

            <!-- DEPARTMENTS SECTION -->
            <div class="section-wrapper">
                <h2 class="section-title">Colleges & Schools</h2>
                <div class="dynamic-grid" id="departmentsContainer" style="margin-top: 25px;">
                    ${departments.map(dept => `
                        <div class="portal-card department-card" data-name="${dept.name.toLowerCase()}">
                            <div class="portal-card-header">
                                <span class="card-icon">${dept.icon || '🏛️'}</span>
                                <h3>${dept.name}</h3>
                            </div>
                            <p>${dept.description}</p>
                            <div style="margin-top: 8px;">
                                <strong style="font-size: 0.8rem; text-transform: uppercase; color: #64748b;">Key Majors:</strong>
                                <div class="tags-list">
                                    ${(dept.majors || []).map(m => `<span class="tag-badge">${m}</span>`).join("")}
                                </div>
                            </div>
                        </div>
                    `).join("")}
                </div>
            </div>

            <!-- COURSES SECTION -->
            <div class="section-wrapper">
                <h2 class="section-title">Featured Courses (Dynamic Catalog)</h2>
                <div class="dynamic-grid" id="coursesContainer" style="margin-top: 25px;">
                    ${courses.map(course => `
                        <div class="portal-card course-card" data-dept="${course.department}" data-name="${course.name.toLowerCase()}">
                            <div class="course-card-top">
                                <span class="course-code">${course.code}</span>
                                <span class="course-credits">${course.credits} Credits</span>
                            </div>
                            <h3>${course.name}</h3>
                            <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 6px;">${course.department}</p>
                            <p>${course.description}</p>
                            <div style="margin-top: auto;">
                                <span class="tag-badge" style="background: #f1f5f9;">${course.level}</span>
                                <span class="tag-badge" style="background: #eef2ff;">${course.duration}</span>
                            </div>
                        </div>
                    `).join("")}
                </div>
            </div>
        </div>
    `;
}

// 4. CAMPUS LIFE VIEW
function getCampusLifeHTML() {
    return `
        <div class="page-header-banner">
            <div class="container">
                <h1>Campus Life</h1>
                <p>Nestled in the picturesque foothills of Western New York, Alfred is a community where creativity and passion thrive.</p>
            </div>
        </div>

        <div class="container">
            <div class="section-wrapper">
                <h2 class="section-title">Life as a Saxon</h2>
                <div class="dynamic-grid" style="margin-top: 25px;">
                    <div class="portal-card">
                        <div class="portal-card-header">
                            <span class="card-icon">🏡</span>
                            <h3>Residence Halls</h3>
                        </div>
                        <p>Comfortable campus housing communities with high-speed internet, modern lounges, study hubs, and living-learning floors.</p>
                    </div>
                    <div class="portal-card">
                        <div class="portal-card-header">
                            <span class="card-icon">🎨</span>
                            <h3>Harder Hall & Galleries</h3>
                        </div>
                        <p>World-class kilns, hot glass shops, sound recording studios, digital labs, and rotating exhibitions open to all students.</p>
                        <button class="btn btn-purple" onclick="openGalleryModal()" style="margin-top: auto;">View Gallery Preview</button>
                    </div>
                    <div class="portal-card">
                        <div class="portal-card-header">
                            <span class="card-icon">🎭</span>
                            <h3>Over 80 Student Clubs</h3>
                        </div>
                        <p>From Student Senate and Outdoor Recreation Club to Solar Car Racing, Ceramics Guild, and Orchestra Ensemble.</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 5. INDIVIDUALS & AU STARS VIEW
function getIndividualsHTML() {
    const faculty = portalData?.faculty || [];
    const auStars = portalData?.auStars || {};

    return `
        <div class="page-header-banner">
            <div class="container">
                <h1>Individuals. Inspired.</h1>
                <p>Celebrating the remarkable students, trailblazing alumni, and world-renowned faculty who define Alfred University.</p>
            </div>
        </div>

        <div class="container">
            <!-- AU STAR SPOTLIGHT -->
            <div class="section-wrapper" style="border-left: 5px solid var(--color-primary-purple);">
                <h2 class="section-title">AU Star: ${auStars.name || "Dr. Peggy Wozniak"}</h2>
                <div class="star-card" style="margin-top: 20px; align-items: center;">
                    <img src="${auStars.avatar || 'assets/images/dr-peggy-wozniak.svg'}" alt="${auStars.name}" class="star-avatar" style="width: 100px; height: 100px;">
                    <div>
                        <p style="font-size: 1.05rem; line-height: 1.6; color: #2d3748;">
                            ${auStars.achievement || "AU Alumna Dr. Peggy Wozniak entered the Commission on Independent Colleges and Universities' Hall of Fame for K-12 educators who have made a difference in New York."}
                        </p>
                        <p style="margin-top: 10px; color: #64748b; font-size: 0.9rem;">
                            Her visionary leadership in public education exemplifies Alfred University's lifelong dedication to service, mentorship, and empowerment.
                        </p>
                    </div>
                </div>
            </div>

            <!-- DISTINGUISHED FACULTY DIRECTORY -->
            <div class="section-wrapper">
                <h2 class="section-title">Distinguished Faculty Mentors</h2>
                <div class="dynamic-grid" style="margin-top: 25px;">
                    ${faculty.map(prof => `
                        <div class="portal-card">
                            <div class="portal-card-header">
                                <span class="card-icon">👩‍🏫</span>
                                <div>
                                    <h3 style="font-size: 1.1rem;">${prof.name}</h3>
                                    <span style="font-size: 0.8rem; color: var(--color-primary-purple); font-weight: 700;">${prof.title}</span>
                                </div>
                            </div>
                            <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 8px;">Department: ${prof.department}</p>
                            <p>${prof.bio}</p>
                            <div style="margin-top: auto; border-top: 1px solid #f1f5f9; padding-top: 10px;">
                                <a href="mailto:${prof.email}" class="link-purple" style="font-size: 0.82rem;">✉ ${prof.email}</a>
                            </div>
                        </div>
                    `).join("")}
                </div>
            </div>
        </div>
    `;
}

// 6. ATHLETICS VIEW
function getAthleticsHTML() {
    const athletics = portalData?.athletics || {};
    const sports = athletics.sports || [];

    return `
        <div class="page-header-banner">
            <div class="container">
                <h1>Saxon Athletics</h1>
                <p>Home of the Saxons! Proud members of the NCAA Division III and the Empire 8 Athletic Conference.</p>
            </div>
        </div>

        <div class="container">
            <div class="section-wrapper">
                <h2 class="section-title">Saxon Pride</h2>
                <p style="margin-bottom: 25px;">Mascot: <strong>${athletics.mascot || "King Saxon"}</strong> &bull; Conference: <strong>${athletics.conference || "Empire 8"}</strong> &bull; Division: <strong>${athletics.division || "NCAA Division III"}</strong></p>
                <div class="dynamic-grid">
                    ${sports.map(sport => `
                        <div class="portal-card" style="padding: 18px 24px;">
                            <div style="display: flex; align-items: center; justify-content: space-between;">
                                <h3 style="font-size: 1.05rem;">${sport}</h3>
                                <span style="font-size: 1.2rem;">🏆</span>
                            </div>
                        </div>
                    `).join("")}
                </div>
            </div>
        </div>
    `;
}

// 7. NEWSROOM VIEW
function getNewsHTML() {
    const news = portalData?.inTheNews || [];

    return `
        <div class="page-header-banner">
            <div class="container">
                <h1>University Newsroom</h1>
                <p>Stay up to date with official releases, student accomplishments, research milestones, and campus events.</p>
            </div>
        </div>

        <div class="container">
            <div class="section-wrapper">
                <h2 class="section-title">Latest Headlines</h2>
                <div class="dynamic-grid" style="margin-top: 25px;">
                    ${news.map(item => `
                        <div class="portal-card">
                            <span class="tag-badge" style="background: var(--color-purple-light); color: var(--color-primary-purple); width: fit-content; margin-bottom: 8px;">
                                ${item.category}
                            </span>
                            <h3>${item.title}</h3>
                            <time style="font-size: 0.78rem; color: #64748b; margin-bottom: 12px; display: block;">${item.date}</time>
                            <p>${item.summary}</p>
                            <button class="btn btn-outline" style="color: var(--color-primary-purple); border-color: var(--color-primary-purple); margin-top: auto;" onclick="openNewsDetailModal('${item.id}')">
                                Read Full Release
                            </button>
                        </div>
                    `).join("")}
                </div>
            </div>
        </div>
    `;
}

// 8. ENQUIRY & SCHEDULE A VISIT VIEW (CLIENT-SIDE VALIDATED FORM)
function getEnquiryHTML() {
    const departments = portalData?.departments || [];

    return `
        <div class="page-header-banner">
            <div class="container">
                <h1>Schedule a Visit & Student Enquiry</h1>
                <p>Take the next step toward becoming an Alfred Saxon. Connect with admissions counselors or plan your campus tour.</p>
            </div>
        </div>

        <div class="container">
            <div class="enquiry-layout">
                <!-- FORM CARD -->
                <div class="form-card" id="formCardContainer">
                    <h2 class="section-title" style="margin-bottom: 25px;">Admission & Visit Form</h2>
                    
                    <form id="collegeEnquiryForm" novalidate>
                        <!-- Full Name -->
                        <div class="form-group">
                            <label for="fullName" class="form-label">Full Name <span class="required">*</span></label>
                            <input type="text" id="fullName" class="form-control" placeholder="e.g. Jane Saxon" required minlength="3">
                            <div class="error-message" id="fullNameError">Please enter a valid full name (letters only, minimum 3 characters).</div>
                        </div>

                        <!-- Email and Phone -->
                        <div class="form-row">
                            <div class="form-group">
                                <label for="emailAddress" class="form-label">Email Address <span class="required">*</span></label>
                                <input type="email" id="emailAddress" class="form-control" placeholder="jane.saxon@example.com" required>
                                <div class="error-message" id="emailAddressError">Please enter a valid email address.</div>
                            </div>
                            <div class="form-group">
                                <label for="phoneNumber" class="form-label">10-Digit Mobile Number <span class="required">*</span></label>
                                <input type="tel" id="phoneNumber" class="form-control" placeholder="10-digit number (e.g. 9876543210)" maxlength="10" required>
                                <div class="error-message" id="phoneNumberError">Please enter a valid 10-digit mobile number.</div>
                            </div>
                        </div>

                        <!-- Department Selection & Student Level -->
                        <div class="form-row">
                            <div class="form-group">
                                <label for="academicInterest" class="form-label">Academic College / Interest <span class="required">*</span></label>
                                <select id="academicInterest" class="form-control" required>
                                    <option value="">-- Select Academic Department --</option>
                                    ${departments.map(d => `<option value="${d.name}">${d.name}</option>`).join("")}
                                </select>
                                <div class="error-message" id="academicInterestError">Please select your academic area of interest.</div>
                            </div>
                            <div class="form-group">
                                <label for="studentLevel" class="form-label">Student Status <span class="required">*</span></label>
                                <select id="studentLevel" class="form-control" required>
                                    <option value="">-- Select Status --</option>
                                    <option value="First-Year Undergraduate">First-Year Undergraduate</option>
                                    <option value="Transfer Student">Transfer Student</option>
                                    <option value="Graduate (Master / Ph.D.)">Graduate (Master / Ph.D.)</option>
                                    <option value="International Student">International Student</option>
                                </select>
                                <div class="error-message" id="studentLevelError">Please select your student status.</div>
                            </div>
                        </div>

                        <!-- Preferred Visit Date -->
                        <div class="form-group">
                            <label for="visitDate" class="form-label">Preferred Campus Visit Date <span class="required">*</span></label>
                            <input type="date" id="visitDate" class="form-control" required>
                            <div class="error-message" id="visitDateError">Please select a valid future visit date.</div>
                        </div>

                        <!-- Message / Statement of Interest -->
                        <div class="form-group">
                            <label for="enquiryMessage" class="form-label">Your Questions or Areas of Interest <span class="required">*</span></label>
                            <textarea id="enquiryMessage" class="form-control" rows="4" placeholder="Tell us about your interests, artistic or academic goals, sports, or questions for our admissions team..." required minlength="15"></textarea>
                            <div class="error-message" id="enquiryMessageError">Please enter your message (at least 15 characters).</div>
                        </div>

                        <!-- Consent Checkbox -->
                        <div class="form-group">
                            <div class="checkbox-group">
                                <input type="checkbox" id="consentAgree" required>
                                <label for="consentAgree" class="checkbox-label">
                                    I confirm the information provided is accurate and authorize Alfred University Admissions to contact me regarding my enquiry.
                                </label>
                            </div>
                            <div class="error-message" id="consentAgreeError" style="margin-left: 24px;">You must agree before submitting.</div>
                        </div>

                        <!-- Submit Button -->
                        <div class="submit-btn-row">
                            <button type="submit" class="btn btn-submit" id="submitEnquiryBtn">
                                <span>Submit Enquiry & Visit Request</span>
                                <span>&rarr;</span>
                            </button>
                        </div>
                    </form>

                    <!-- SUCCESS CONFIRMATION DISPLAY -->
                    <div id="enquirySuccessCard" class="form-success-card">
                        <div class="success-icon">✓</div>
                        <h3>Enquiry Submitted Successfully!</h3>
                        <p style="color: #64748b;">Thank you for your interest in Alfred University. Our admissions team will connect with you within 24-48 business hours.</p>
                        <div>
                            <span class="ref-number" id="confirmationRefNumber">AU-2026-7842</span>
                        </div>
                        <div id="submittedSummary" style="margin: 20px 0; text-align: left; background: #f8fafc; padding: 18px; border-radius: 4px; font-size: 0.88rem; line-height: 1.6;"></div>
                        <button type="button" class="btn btn-purple" onclick="resetEnquiryForm()">Submit Another Enquiry</button>
                    </div>
                </div>

                <!-- SIDEBAR INFORMATION -->
                <aside class="info-sidebar">
                    <div class="sidebar-box">
                        <h4>Admissions Office</h4>
                        <p><strong>Hours:</strong> Mon - Fri: 8:30 AM - 4:30 PM EST</p>
                        <p><strong>Phone:</strong> <a href="tel:6078712115" class="phone-link" style="color: var(--color-primary-purple);">607.871.2115</a></p>
                        <p><strong>Email:</strong> admissions@alfred.edu</p>
                        <p><strong>Address:</strong><br>Admissions Welcome Center<br>1 Saxon Drive, Alfred, NY 14802</p>
                    </div>

                    <div class="sidebar-box">
                        <h4>Fast Facts</h4>
                        <ul style="font-size: 0.85rem; color: #64748b; line-height: 1.8;">
                            <li>• 98% Graduate placement rate</li>
                            <li>• 13:1 Student to faculty ratio</li>
                            <li>• Test-optional admissions</li>
                            <li>• Over $30M awarded annually in scholarships</li>
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    `;
}

// 9. 404 NOT FOUND VIEW
function getNotFoundHTML() {
    return `
        <div class="container" style="padding: 80px 20px; text-align: center;">
            <h1 style="font-size: 3rem; color: var(--color-primary-purple); margin-bottom: 12px;">404</h1>
            <h2 style="font-size: 1.5rem; margin-bottom: 20px;">Page Not Found</h2>
            <p style="color: #64748b; margin-bottom: 25px;">The section you requested does not exist or has been moved.</p>
            <a href="#home" class="btn btn-purple">Return to Homepage</a>
        </div>
    `;
}

/**
 * CLIENT-SIDE VALIDATION LOGIC
 */
function initEnquiryValidation() {
    const form = document.getElementById("collegeEnquiryForm");
    if (!form) return;

    // Set minimum date for visitDate to today
    const visitDateInput = document.getElementById("visitDate");
    if (visitDateInput) {
        const todayStr = new Date().toISOString().split("T")[0];
        visitDateInput.min = todayStr;
    }

    // Attach real-time validation listeners on blur and input
    const fields = [
        { id: "fullName", validator: validateFullName },
        { id: "emailAddress", validator: validateEmail },
        { id: "phoneNumber", validator: validatePhone },
        { id: "academicInterest", validator: validateSelect },
        { id: "studentLevel", validator: validateSelect },
        { id: "visitDate", validator: validateDate },
        { id: "enquiryMessage", validator: validateMessage },
        { id: "consentAgree", validator: validateCheckbox }
    ];

    fields.forEach(({ id, validator }) => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener("blur", () => validator(el));
            el.addEventListener("input", () => {
                if (el.classList.contains("is-invalid")) {
                    validator(el);
                }
            });
        }
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let isFormValid = true;

        fields.forEach(({ id, validator }) => {
            const el = document.getElementById(id);
            if (el && !validator(el)) {
                isFormValid = false;
            }
        });

        if (isFormValid) {
            handleEnquirySubmit(form);
        } else {
            showToast("Please correct highlighted fields before submitting.", "error");
        }
    });
}

// Validator helper functions
function validateFullName(el) {
    const val = el.value.trim();
    const isValid = val.length >= 3 && /^[a-zA-Z\s.'-]+$/.test(val);
    setFieldStatus(el, isValid, "fullNameError");
    return isValid;
}

function validateEmail(el) {
    const val = el.value.trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const isValid = emailRegex.test(val);
    setFieldStatus(el, isValid, "emailAddressError");
    return isValid;
}

function validatePhone(el) {
    const val = el.value.replace(/[^0-9]/g, "");
    const isValid = val.length === 10;
    setFieldStatus(el, isValid, "phoneNumberError");
    return isValid;
}

function validateSelect(el) {
    const isValid = el.value.trim() !== "";
    setFieldStatus(el, isValid, `${el.id}Error`);
    return isValid;
}

function validateDate(el) {
    const val = el.value;
    if (!val) {
        setFieldStatus(el, false, "visitDateError");
        return false;
    }
    const selected = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isValid = selected >= today;
    setFieldStatus(el, isValid, "visitDateError");
    return isValid;
}

function validateMessage(el) {
    const val = el.value.trim();
    const isValid = val.length >= 15;
    setFieldStatus(el, isValid, "enquiryMessageError");
    return isValid;
}

function validateCheckbox(el) {
    const isValid = el.checked;
    const err = document.getElementById("consentAgreeError");
    if (err) err.style.display = isValid ? "none" : "block";
    return isValid;
}

function setFieldStatus(el, isValid, errorId) {
    const errorEl = document.getElementById(errorId);
    if (isValid) {
        el.classList.remove("is-invalid");
        el.classList.add("is-valid");
        if (errorEl) errorEl.style.display = "none";
    } else {
        el.classList.remove("is-valid");
        el.classList.add("is-invalid");
        if (errorEl) errorEl.style.display = "block";
    }
}

function handleEnquirySubmit(form) {
    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("emailAddress").value.trim();
    const phone = document.getElementById("phoneNumber").value.trim();
    const dept = document.getElementById("academicInterest").value;
    const level = document.getElementById("studentLevel").value;
    const date = document.getElementById("visitDate").value;
    const message = document.getElementById("enquiryMessage").value.trim();

    // Generate random application tracking number
    const refId = `AU-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    // Show confirmation card
    form.style.display = "none";
    const successCard = document.getElementById("enquirySuccessCard");
    const refDisplay = document.getElementById("confirmationRefNumber");
    const summaryDisplay = document.getElementById("submittedSummary");

    if (refDisplay) refDisplay.textContent = refId;
    if (summaryDisplay) {
        summaryDisplay.innerHTML = `
            <p><strong>Student Name:</strong> ${fullName}</p>
            <p><strong>Email Address:</strong> ${email}</p>
            <p><strong>Mobile:</strong> ${phone}</p>
            <p><strong>Academic Department:</strong> ${dept}</p>
            <p><strong>Student Status:</strong> ${level}</p>
            <p><strong>Preferred Visit Date:</strong> ${date}</p>
            <p><strong>Inquiry Note:</strong> "${message}"</p>
        `;
    }

    if (successCard) successCard.style.display = "block";
    showToast(`Success! Your enquiry (${refId}) has been logged.`, "success");
}

function resetEnquiryForm() {
    const form = document.getElementById("collegeEnquiryForm");
    const successCard = document.getElementById("enquirySuccessCard");
    if (form) {
        form.reset();
        form.querySelectorAll(".is-valid, .is-invalid").forEach(el => {
            el.classList.remove("is-valid", "is-invalid");
        });
        form.style.display = "block";
    }
    if (successCard) successCard.style.display = "none";
}

/**
 * HERO SLIDE CAROUSEL
 */
function initHomeInteractions() {
    if (!portalData || !portalData.heroSlides) return;
    
    // Auto-advance hero slides every 7 seconds
    carouselTimer = setInterval(() => {
        const nextIndex = (currentSlideIndex + 1) % portalData.heroSlides.length;
        switchHeroSlide(nextIndex);
    }, 7000);
}

function switchHeroSlide(index) {
    if (!portalData || !portalData.heroSlides || !portalData.heroSlides[index]) return;
    currentSlideIndex = index;
    const slide = portalData.heroSlides[index];

    const taglineEl = document.getElementById("heroTagline");
    const subtitleEl = document.getElementById("heroSubtitle");
    const ctaEl = document.getElementById("heroCta");

    if (taglineEl) {
        taglineEl.innerHTML = `
            <span>${slide.tagline1}</span>
            <span>${slide.tagline2}</span>
        `;
    }
    if (subtitleEl) subtitleEl.textContent = slide.subtitle;
    if (ctaEl) {
        ctaEl.textContent = slide.buttonText;
        ctaEl.setAttribute("href", slide.buttonAction);
    }

    document.querySelectorAll(".hero-dots .dot").forEach((dot, i) => {
        dot.classList.toggle("active", i === currentSlideIndex);
    });
}

/**
 * ACADEMICS SEARCH & FILTER
 */
function initAcademicsFilter() {
    const searchInput = document.getElementById("academicSearchInput");
    const deptSelect = document.getElementById("departmentFilterSelect");

    if (searchInput) {
        searchInput.addEventListener("input", filterAcademics);
    }
    if (deptSelect) {
        deptSelect.addEventListener("change", filterAcademics);
    }
}

function filterAcademics() {
    const query = (document.getElementById("academicSearchInput")?.value || "").toLowerCase().trim();
    const deptFilter = document.getElementById("departmentFilterSelect")?.value || "ALL";

    // Filter Course Cards
    document.querySelectorAll(".course-card").forEach(card => {
        const name = card.getAttribute("data-name") || "";
        const dept = card.getAttribute("data-dept") || "";
        const matchesQuery = query === "" || name.includes(query) || dept.toLowerCase().includes(query);
        const matchesDept = deptFilter === "ALL" || dept === deptFilter;
        card.style.display = (matchesQuery && matchesDept) ? "flex" : "none";
    });

    // Filter Department Cards
    document.querySelectorAll(".department-card").forEach(card => {
        const name = card.getAttribute("data-name") || "";
        const matchesQuery = query === "" || name.includes(query);
        card.style.display = matchesQuery ? "flex" : "none";
    });
}

/**
 * MODAL SYSTEM & OVERLAYS
 */
function openModal(contentHtml) {
    const modalBody = document.getElementById("modalBody");
    const modalOverlay = document.getElementById("modalOverlay");
    if (modalBody && modalOverlay) {
        modalBody.innerHTML = contentHtml;
        modalOverlay.classList.add("active");
        modalOverlay.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }
}

function closeModal(event) {
    if (event && event.target && event.target.id !== "modalOverlay" && !event.target.classList.contains("modal-close-btn")) {
        return;
    }
    const modalOverlay = document.getElementById("modalOverlay");
    if (modalOverlay) {
        modalOverlay.classList.remove("active");
        modalOverlay.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }
}

function openDirectionsModal() {
    const visit = portalData?.visitCampus || {};
    openModal(`
        <h2 style="font-family: var(--font-hero); font-size: 1.4rem; color: var(--color-primary-purple); margin-bottom: 12px;">Directions to Alfred University</h2>
        <p style="margin-bottom: 15px; color: #4a5568;">
            <strong>Campus Address:</strong> ${visit.directions?.address || "1 Saxon Drive, Alfred, NY 14802"}<br>
            <strong>GPS Coordinates:</strong> ${visit.directions?.coordinates || "42.2536° N, 77.7906° W"}
        </p>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 18px; border-radius: 4px; margin-bottom: 20px;">
            <h4 style="font-size: 0.95rem; margin-bottom: 8px;">Driving Directions:</h4>
            <p style="font-size: 0.88rem; color: #64748b; line-height: 1.5;">
                ${visit.directions?.driving || "From I-86 (Southern Tier Expressway), take Exit 36 (Almond) and follow Route 21 South into Alfred."}
            </p>
        </div>
        <div style="display: flex; gap: 10px;">
            <a href="https://maps.google.com/?q=Alfred+University+1+Saxon+Drive+Alfred+NY" target="_blank" rel="noopener noreferrer" class="btn btn-purple">Open in Google Maps</a>
            <a href="#enquiry" class="btn btn-outline" style="color: var(--color-primary-purple); border-color: var(--color-primary-purple);" onclick="closeModal()">Plan a Campus Visit</a>
        </div>
    `);
}

function openGalleryModal() {
    openModal(`
        <h2 style="font-family: var(--font-hero); font-size: 1.4rem; color: var(--color-primary-purple); margin-bottom: 12px;">Harder Hall Art Galleries</h2>
        <p style="margin-bottom: 20px; color: #4a5568;">
            Alfred University's School of Art & Design features rotating exhibits by undergraduate BFA candidates, MFA fellows, and guest international artists.
        </p>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
            <div style="background: #f1f5f9; padding: 12px; border-radius: 4px;">
                <img src="assets/images/art-galleries.svg" alt="Harder Hall" style="width: 100%; height: 110px; object-fit: cover; border-radius: 3px; margin-bottom: 8px;">
                <strong style="font-size: 0.85rem;">Fosdick-Nelson Gallery</strong>
                <p style="font-size: 0.78rem; color: #64748b;">Groundbreaking ceramic, expanded media, and glass sculpture.</p>
            </div>
            <div style="background: #f1f5f9; padding: 12px; border-radius: 4px;">
                <img src="assets/images/winter-courses.svg" alt="Sculpture Lab" style="width: 100%; height: 110px; object-fit: cover; border-radius: 3px; margin-bottom: 8px;">
                <strong style="font-size: 0.85rem;">Cohen Center for the Arts</strong>
                <p style="font-size: 0.78rem; color: #64748b;">Student curated installations and multimedia design works.</p>
            </div>
        </div>
        <a href="#academics" class="btn btn-purple" onclick="closeModal()">Explore Art & Design Degrees</a>
    `);
}

function openNewsDetailModal(newsId) {
    const item = (portalData?.inTheNews || []).find(n => n.id === newsId);
    if (!item) return;

    openModal(`
        <span class="tag-badge" style="background: var(--color-purple-light); color: var(--color-primary-purple); margin-bottom: 8px; display: inline-block;">
            ${item.category}
        </span>
        <h2 style="font-family: var(--font-hero); font-size: 1.35rem; color: var(--color-navy-card); margin-bottom: 8px;">
            ${item.title}
        </h2>
        <time style="font-size: 0.8rem; color: #64748b; margin-bottom: 16px; display: block;">${item.date}</time>
        <p style="font-size: 0.95rem; color: #334155; line-height: 1.6; margin-bottom: 20px;">
            ${item.summary}
        </p>
        <p style="font-size: 0.9rem; color: #64748b; line-height: 1.5; margin-bottom: 25px;">
            For press inquiries or official university media releases, please contact the Office of Marketing and Communication at Alfred University.
        </p>
        <a href="#news" class="btn btn-purple" onclick="closeModal()">View All Newsroom Stories</a>
    `);
}

function openSpotlightDetailModal(spotlightId) {
    const item = (portalData?.spotlight || []).find(s => s.id === spotlightId);
    if (!item) return;

    openModal(`
        <div style="display: flex; gap: 18px; align-items: center; margin-bottom: 16px;">
            <img src="${item.image}" alt="${item.title}" style="width: 70px; height: 70px; border-radius: 4px; object-fit: cover;">
            <div>
                <span class="tag-badge" style="background: var(--color-purple-light); color: var(--color-primary-purple); font-size: 0.75rem;">${item.tag}</span>
                <h2 style="font-family: var(--font-hero); font-size: 1.25rem; color: var(--color-navy-card); margin-top: 4px;">
                    ${item.title}
                </h2>
                <time style="font-size: 0.8rem; color: var(--color-primary-purple); font-weight: 700;">${item.date}</time>
            </div>
        </div>
        <p style="font-size: 0.95rem; color: #334155; line-height: 1.6; margin-bottom: 20px;">
            ${item.description}
        </p>
        <div style="display: flex; gap: 10px;">
            <a href="#enquiry" class="btn btn-purple" onclick="closeModal()">Inquire Today</a>
            <button class="btn btn-outline" style="color: var(--color-navy-card); border-color: #cbd5e1;" onclick="closeModal()">Close</button>
        </div>
    `);
}

/**
 * GLOBAL SEARCH SYSTEM
 */
function handleSearchSubmit() {
    const input = document.getElementById("globalSearchInput");
    if (!input) return;
    const query = input.value.trim().toLowerCase();
    if (!query) {
        showToast("Please enter a term to search.", "info");
        return;
    }

    const results = [];

    // Search Departments & Majors
    (portalData?.departments || []).forEach(dept => {
        if (dept.name.toLowerCase().includes(query) || dept.description.toLowerCase().includes(query)) {
            results.push({ category: "Academic Department", title: dept.name, route: "#academics" });
        }
        (dept.majors || []).forEach(m => {
            if (m.toLowerCase().includes(query)) {
                results.push({ category: "Major / Program", title: `${m} (${dept.name})`, route: "#academics" });
            }
        });
    });

    // Search Courses
    (portalData?.courses || []).forEach(course => {
        if (course.name.toLowerCase().includes(query) || course.code.toLowerCase().includes(query)) {
            results.push({ category: "Course", title: `${course.code}: ${course.name}`, route: "#academics" });
        }
    });

    // Search News
    (portalData?.inTheNews || []).forEach(newsItem => {
        if (newsItem.title.toLowerCase().includes(query) || newsItem.summary.toLowerCase().includes(query)) {
            results.push({ category: "News Article", title: newsItem.title, route: "#news" });
        }
    });

    // Display Search Results Modal
    if (results.length === 0) {
        openModal(`
            <h2 style="font-family: var(--font-hero); font-size: 1.3rem; margin-bottom: 12px;">Search Results for "${query}"</h2>
            <p style="color: #64748b; margin-bottom: 20px;">No exact matches were found for your search term. Try searching for "Art", "Business", "Engineering", or "Courses".</p>
            <a href="#academics" class="btn btn-purple" onclick="closeModal()">Browse Academic Programs</a>
        `);
    } else {
        openModal(`
            <h2 style="font-family: var(--font-hero); font-size: 1.3rem; margin-bottom: 12px;">Search Results (${results.length} found)</h2>
            <p style="color: #64748b; font-size: 0.85rem; margin-bottom: 16px;">Results matching "<strong>${query}</strong>":</p>
            <div style="max-height: 350px; overflow-y: auto;">
                ${results.map(r => `
                    <div class="search-result-item">
                        <div class="search-result-category">${r.category}</div>
                        <a href="${r.route}" class="search-result-title" onclick="closeModal()">${r.title} &rarr;</a>
                    </div>
                `).join("")}
            </div>
        `);
    }
}

/**
 * TOAST NOTIFICATIONS
 */
function showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type === 'success' ? 'toast-success' : ''}`;
    toast.innerHTML = `<span>${message}</span>`;

    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

/**
 * GLOBAL EVENT LISTENERS
 */
function setupEventListeners() {
    // SPA Hash Change Listener
    window.addEventListener("hashchange", renderPage);

    // Mobile Navigation Drawer Toggle
    const mobileBtn = document.getElementById("mobileMenuBtn");
    const mainNav = document.getElementById("mainNav");
    if (mobileBtn && mainNav) {
        mobileBtn.addEventListener("click", () => {
            const isOpen = mainNav.classList.toggle("open");
            mobileBtn.setAttribute("aria-expanded", isOpen);
        });
    }

    // Keyboard Accessibility: Esc closes active modal
    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            closeModal();
        }
    });
}

/**
 * FALLBACK DATA (For offline local execution)
 */
function getFallbackData() {
    return {
        university: { name: "Alfred University", founded: "1836" },
        heroSlides: [
            {
                tagline1: "INDIVIDUALS.",
                tagline2: "INSPIRED.",
                subtitle: "Follow your inspiration. Pursue your interests. Study abroad. Join a team. Start something new. AU is the place where you can be yourself - whoever you may be.",
                buttonText: "Find your major",
                buttonAction: "#academics"
            }
        ],
        visitCampus: {
            title: "VISIT THE CAMPUS",
            description: "Experience life at Alfred University firsthand. Tour our beautiful valley campus, meet inspiring faculty, and connect with current Saxons.",
            scheduleButton: "Schedule a visit",
            directionsLink: "Get directions",
            galleryButton: "Visit our gallery"
        },
        inTheNews: [
            { id: "news-1", title: "Master's in business programs among nation's best says 'The Princeton Review'", date: "Nov 14", category: "Academics", summary: "AU College of Business recognized for academic excellence." },
            { id: "news-2", title: "Orchestra ready to 'scare up' musical sounds for Halloween-themed concert", date: "Oct 28", category: "Arts", summary: "Annual symphony performance featuring student soloists." },
            { id: "news-3", title: "Allen Term 2024-15 classes available to all", date: "Oct 12", category: "Winter Session", summary: "Accelerated winter term courses open for registration." }
        ],
        spotlight: [
            { id: "spotlight-1", image: "assets/images/winter-courses.svg", title: "Take online courses during Winter Break", date: "December 18th - January 18th", description: "Our Allen Term offers more than 20 courses to help you get ahead.", tag: "Winter Term" },
            { id: "spotlight-2", image: "assets/images/homecoming.svg", title: "Homecoming", date: "October 17-19", description: "All alumni, current students, faculty, and friends welcome!", tag: "Tradition" },
            { id: "spotlight-3", image: "assets/images/art-galleries.svg", title: "New Art Galleries", date: "Fall Semester", description: "Online and on-campus galleries at Harder Hall.", tag: "Art & Design" }
        ],
        didYouKnow: { title: "DID YOU KNOW?", highlight: "AU's School of Business is again rated one of the top in the nation by the Princeton Review." },
        stayConnected: { title: "STAY CONNECTED", description: "Stay informed with campus breakthroughs, athletic events, and alumni stories.", primaryLink: "Alfred Online", secondaryLink: "E-News" },
        auStars: { title: "AU STARS", avatar: "assets/images/dr-peggy-wozniak.svg", name: "Dr. Peggy Wozniak", achievement: "AU Alumna Dr. Peggy Wozniak entered the Commission on Independent Colleges and Universities' Hall of Fame." },
        departments: [
            { name: "School of Art and Design", icon: "🎨", description: "World-renowned ceramic, glass, and multi-media arts.", majors: ["Ceramic Art", "Glass", "Graphic Design"] },
            { name: "College of Business", icon: "📈", description: "AACSB-accredited business administration and finance.", majors: ["Business Administration", "Finance", "Marketing"] },
            { name: "Inamori School of Engineering", icon: "⚙️", description: "Pioneering materials science and mechanical engineering.", majors: ["Mechanical Engineering", "Biomaterials"] }
        ],
        courses: [
            { code: "ART-201", name: "Foundations of Ceramic Sculpture", department: "School of Art and Design", credits: "4.0", duration: "1 Sem", level: "Undergraduate", description: "Kiln firing and ceramic wheel work." },
            { code: "BUS-310", name: "Strategic Financial Analysis", department: "College of Business", credits: "3.0", duration: "1 Sem", level: "Undergraduate", description: "Capital budgeting and market analysis." }
        ],
        faculty: [
            { name: "Dr. Sarah Miller", title: "Professor of Ceramic Art", department: "School of Art and Design", email: "smiller@alfred.edu", bio: "Internationally exhibited ceramic sculptor." }
        ]
    };
}

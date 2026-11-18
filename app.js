/**
 * UNIPIX UNIVERSITY - SMART COLLEGE PORTAL
 * SPA Routing, Dynamic JSON Data Loading, Department & Branch Explorer, and Client-Side Validation
 * Web Technology CCE-5 Project • Damini Kotnake (Roll No: 229, Batch WT C1)
 */

// Application State
let unipixData = null;

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
    initPortal();
});

async function initPortal() {
    setupGlobalEvents();
    await loadPortalData();
    renderRoute();
}

/**
 * DYNAMIC JSON DATA LOADING (FETCH API)
 */
async function loadPortalData() {
    try {
        const response = await fetch("data.json");
        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }
        unipixData = await response.json();
    } catch (error) {
        console.error("Could not fetch data.json, falling back to local dataset:", error);
        unipixData = getFallbackUnipixData();
    }
}

/**
 * CLIENT-SIDE ROUTER (SPA WITHOUT PAGE RELOAD)
 */
function renderRoute() {
    const rawHash = window.location.hash.replace("#", "").trim();
    const route = rawHash.split("?")[0] || "home";

    // Dynamic Page Titles
    const titleMap = {
        home: "Home | Knowledge Meets Innovation",
        about: "About & History",
        departments: "Academic Departments & Branches",
        courses: "Course Curriculum & Syllabi",
        events: "Upcoming Events & Summits",
        news: "Research Blog & Press Releases",
        enquiry: "Admissions Now & Student Enquiry"
    };

    document.title = `Unipix University | ${titleMap[route] || "Page Not Found"}`;

    // Highlight Active Navbar Link
    updateNavState(route);

    // Close Mobile Menu if Open
    const mainNav = document.getElementById("mainNav");
    if (mainNav) mainNav.classList.remove("open");

    // Scroll to Top smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });

    const contentArea = document.getElementById("content");

    // Route Switching without Page Reload
    switch (route) {
        case "home":
            contentArea.innerHTML = getHomeViewHTML();
            initAdmissionFormEvents();
            break;
        case "about":
            contentArea.innerHTML = getAboutViewHTML();
            break;
        case "departments":
            contentArea.innerHTML = getDepartmentsViewHTML();
            initDepartmentFilterEvents();
            break;
        case "courses":
            contentArea.innerHTML = getCoursesViewHTML();
            break;
        case "events":
            contentArea.innerHTML = getEventsViewHTML();
            break;
        case "news":
            contentArea.innerHTML = getNewsViewHTML();
            break;
        case "enquiry":
            contentArea.innerHTML = getEnquiryViewHTML();
            initAdmissionFormEvents();
            break;
        default:
            contentArea.innerHTML = getNotFoundHTML();
            break;
    }
}

function updateNavState(activeRoute) {
    document.querySelectorAll(".nav-link").forEach(link => {
        const routeAttr = link.getAttribute("data-route");
        if (routeAttr === activeRoute || (activeRoute === "home" && routeAttr === "home")) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
}

/**
 * VIEW GENERATORS
 */

// 1. HOME VIEW (MATCHING THE SCREENSHOT)
function getHomeViewHTML() {
    if (!unipixData) return `<div class="loading-state"><div class="unipix-spinner"></div><p>Loading...</p></div>`;

    const hero = unipixData.hero || {};
    const marquee = unipixData.marquee || [];
    const about = unipixData.about || {};
    const programCategories = unipixData.programCategories || [];
    const departments = unipixData.departments || [];
    const campusLife = unipixData.campusLife || {};
    const quote = unipixData.facultyQuote || {};
    const events = unipixData.events || [];
    const news = unipixData.news || [];

    return `
        <!-- HERO SECTION -->
        <section class="unipix-hero">
            <div class="container">
                <div class="hero-top-row">
                    <div>
                        <div class="section-badge">
                            <span>🎓</span>
                            <span>${hero.badge || "Knowledge Meets Innovation"}</span>
                        </div>
                        <h1 class="hero-title">
                            ${hero.titleLine1 || "Explore Boundless"}<br>
                            ${hero.titleLine2 || "Opportunities at Unipix"}
                        </h1>
                    </div>
                    <div>
                        <p class="hero-intro-text">
                            ${hero.description || "Welcome to Unipix, where academic excellence converges with a vibrant community spirit to shape the leaders of tomorrow."}
                        </p>
                        <a href="${hero.ctaLink || "#departments"}" class="hero-link-underline">
                            ${hero.ctaText || "View Our Program"} ↗
                        </a>
                    </div>
                </div>

                <!-- Hero Media Row: Rotating Badge + Huge Rounded Campus Banner -->
                <div class="hero-media-row">
                    <div class="circular-badge-wrap">
                        <svg class="circular-badge-svg" viewBox="0 0 160 160">
                            <defs>
                                <path id="circleTextPath" d="M 80, 80 m -60, 0 a 60,60 0 1,1 120,0 a 60,60 0 1,1 -120,0" />
                            </defs>
                            <text font-family="'Plus Jakarta Sans', sans-serif" font-size="11.5" font-weight="700" fill="#a01a32" letter-spacing="2.8">
                                <textPath href="#circleTextPath" startOffset="50%" text-anchor="middle">
                                    • EXPLORE UNIPIX UNIVERSITY • ESTD 1971 •
                                </textPath>
                            </text>
                        </svg>
                        <button class="play-center-btn" onclick="openCampusTourVideoModal()" aria-label="Play virtual campus tour">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <polygon points="6 3 20 12 6 21 6 3"></polygon>
                            </svg>
                        </button>
                    </div>

                    <div class="hero-banner-image-wrap">
                        <img src="${hero.heroImage || 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80'}" alt="Unipix Historic Campus Building" loading="lazy">
                    </div>
                </div>
            </div>
        </section>

        <!-- DUAL STRIPE TICKER / MARQUEE -->
        <section class="marquee-section">
            <!-- Navy Stripe -->
            <div class="marquee-stripe navy-stripe">
                <div class="marquee-content">
                    ${marquee.map(item => `
                        <span class="marquee-item">
                            <span>${item}</span>
                            <span class="asterisk">✻</span>
                        </span>
                    `).join("")}
                    ${marquee.map(item => `
                        <span class="marquee-item">
                            <span>${item}</span>
                            <span class="asterisk">✻</span>
                        </span>
                    `).join("")}
                </div>
            </div>
            <!-- Crimson Stripe -->
            <div class="marquee-stripe crimson-stripe">
                <div class="marquee-content">
                    ${marquee.map(item => `
                        <span class="marquee-item">
                            <span>${item}</span>
                            <span class="asterisk">✻</span>
                        </span>
                    `).join("")}
                    ${marquee.map(item => `
                        <span class="marquee-item">
                            <span>${item}</span>
                            <span class="asterisk">✻</span>
                        </span>
                    `).join("")}
                </div>
            </div>
        </section>

        <!-- HISTORY UNIPIX UNIVERSITY SECTION -->
        <section class="history-section" id="aboutSection">
            <div class="container">
                <div class="history-header-grid">
                    <div>
                        <div class="section-badge">
                            <span>🏛️</span>
                            <span>${about.badge || "About"}</span>
                        </div>
                        <h2 class="section-headline">${about.title || "History Unipix University"}</h2>
                    </div>
                    <div>
                        <p class="section-subtext">
                            ${about.description || "Welcome to Unipix, where academic excellence, innovation, and community thrive. With a rich history of scholarship and commitment to cutting-edge research, Unipix offers a wide range of programs across various disciplines."}
                        </p>
                    </div>
                </div>

                <div class="history-image-wrap">
                    <img src="${about.image || 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&q=80'}" alt="Unipix Quadrangle" loading="lazy">
                </div>

                <!-- Stats Bar -->
                <div class="stats-grid">
                    ${(about.stats || []).map(stat => `
                        <div class="stat-item">
                            <div class="stat-value">${stat.value}</div>
                            <div class="stat-label">${stat.label}</div>
                        </div>
                    `).join("")}
                </div>
            </div>
        </section>

        <!-- OUR PROGRAMS (4-CARD GRID) -->
        <section class="programs-section" id="programsSection">
            <div class="container">
                <div class="programs-top-row">
                    <div>
                        <div class="section-badge">
                            <span>📚</span>
                            <span>Program</span>
                        </div>
                        <h2 class="section-headline">Our Programs</h2>
                        <p class="section-subtext">
                            Embark on a journey of knowledge, discovery, and growth at Unipix University. Our admissions process is designed to identify bright, motivated individuals eager to contribute to our dynamic academic community.
                        </p>
                    </div>
                    <div>
                        <a href="#departments" class="btn-tilted-pill">View All Program ↗</a>
                    </div>
                </div>

                <div class="program-cards-grid">
                    ${programCategories.map(cat => `
                        <div class="program-card">
                            <div class="program-card-thumb">
                                <img src="${cat.image}" alt="${cat.title}" loading="lazy">
                            </div>
                            <div class="program-card-body">
                                <h3 class="program-card-title">${cat.title}</h3>
                                <p class="program-card-desc">${cat.subtitle}</p>
                                <a href="${cat.route}" class="program-link">Explore Degrees ↗</a>
                            </div>
                        </div>
                    `).join("")}
                </div>
            </div>
        </section>

        <!-- DEPARTMENTS & SPECIALIZED BRANCHES SECTION -->
        <section class="departments-section" id="departmentsSection">
            <div class="container">
                <div style="text-align: center; margin-bottom: 35px;">
                    <div class="section-badge">
                        <span>🔬</span>
                        <span>Academics &amp; Specializations</span>
                    </div>
                    <h2 class="section-headline">Academic Departments &amp; Branches</h2>
                    <p class="section-subtext" style="margin: 0 auto;">
                        Choose your academic path across our 6 accredited departments and 16 specialized branches tailored for industry excellence.
                    </p>
                </div>

                <!-- Live Search and Filter Controls -->
                <div class="dept-filter-controls">
                    <input type="text" id="deptSearchInput" placeholder="🔍 Search branches (e.g. AI, Cloud, Cyber Security, Robotics)..." aria-label="Search departments and branches">
                    <select id="deptSelectFilter" aria-label="Filter by department">
                        <option value="ALL">All Departments (6)</option>
                        ${departments.map(d => `<option value="${d.id}">${d.name}</option>`).join("")}
                    </select>
                </div>

                <!-- Departments Grid -->
                <div class="departments-grid" id="departmentsContainer">
                    ${departments.map(dept => `
                        <div class="department-full-card" data-dept-id="${dept.id}" data-search="${(dept.name + ' ' + dept.branches.map(b => b.name).join(' ')).toLowerCase()}">
                            <div class="dept-card-header">
                                <div class="dept-icon-box">${dept.icon}</div>
                                <div class="dept-title-group">
                                    <span class="dept-code-badge">${dept.code}</span>
                                    <h3>${dept.name}</h3>
                                </div>
                            </div>
                            <p class="dept-desc">${dept.description}</p>
                            <div class="dept-head-info">
                                Department Chair: <strong>${dept.head}</strong>
                            </div>

                            <div class="branches-title">Specialized Branches &amp; Curricula:</div>
                            <div class="branches-list">
                                ${dept.branches.map(branch => `
                                    <div class="branch-sub-item">
                                        <div class="branch-name-row">
                                            <span class="branch-name">${branch.name}</span>
                                            <span class="branch-seats">${branch.seats} Seats</span>
                                        </div>
                                        <p class="branch-focus">${branch.focus}</p>
                                    </div>
                                `).join("")}
                            </div>
                        </div>
                    `).join("")}
                </div>
            </div>
        </section>

        <!-- CAMPUS LIFE BANNER (DEEP CRIMSON) -->
        <section class="campus-life-section">
            <div class="container">
                <div class="campus-life-grid">
                    <div class="campus-life-content">
                        <div class="section-badge">
                            <span>🎓</span>
                            <span>${campusLife.badge || "Campus Life"}</span>
                        </div>
                        <h2 class="section-headline">${campusLife.title || "Thriving Beyond Classes - Campus Life at Unipix"}</h2>
                        <p>${campusLife.description || "College life at Unipix is about much more than classrooms. Join over 120 student organizations, championship athletics, music ensembles, and hackathons."}</p>
                        <a href="#events" class="btn btn-crimson" style="background-color: #ffffff; color: var(--color-crimson-dark);">Explore Campus Life ↗</a>
                    </div>
                    <div class="campus-life-img-wrap">
                        <img src="${campusLife.image || 'https://images.unsplash.com/photo-1627556704290-2b1f5853ff78?auto=format&fit=crop&w=1000&q=80'}" alt="Graduates walking in robes" loading="lazy">
                    </div>
                </div>
            </div>
        </section>

        <!-- FACULTY SPOTLIGHT / QUOTE SECTION -->
        <section class="faculty-quote-section">
            <div class="container">
                <div class="quote-grid">
                    <div class="quote-photo-wrap">
                        <img src="${quote.image || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80'}" alt="${quote.author}" loading="lazy">
                    </div>
                    <div class="quote-content">
                        <div class="quote-mark">““</div>
                        <blockquote class="quote-text">
                            "${quote.quote || 'We can completely reimagine how our cities, hospitals, and families prepare for and deal with cold and flu season.'}"
                        </blockquote>
                        <div class="quote-author">${quote.author || "Dr. Peter Thorne"}</div>
                        <div class="quote-title">${quote.title || "Chair, Department of Biomedical Engineering & Global Health"}</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- ADMISSION NOW FORM & CLIENT-SIDE VALIDATION -->
        <section class="admission-now-section" id="admissionSection">
            <div class="container admission-container">
                <div style="text-align: center; margin-bottom: 30px;">
                    <div class="section-badge">
                        <span>📝</span>
                        <span>Enrollment 2026-27</span>
                    </div>
                    <h2 class="section-headline">Admission Now</h2>
                    <p class="section-subtext" style="margin: 0 auto;">
                        Apply to your preferred academic department and branch specialization with our streamlined student application.
                    </p>
                </div>

                <div class="form-wrapper-card">
                    <form id="admissionEnquiryForm" novalidate>
                        <!-- Full Name -->
                        <div class="form-group">
                            <label for="studentFullName" class="form-label">Full Name <span class="req">*</span></label>
                            <input type="text" id="studentFullName" class="form-input" placeholder="e.g. Alexander Hamilton" required minlength="3">
                            <div class="error-text" id="studentFullNameError">Please enter a valid full name (minimum 3 letters, alphabets only).</div>
                        </div>

                        <!-- Email & Phone -->
                        <div class="form-row">
                            <div class="form-group">
                                <label for="studentEmail" class="form-label">Email Address <span class="req">*</span></label>
                                <input type="email" id="studentEmail" class="form-input" placeholder="alexander@unipix.edu" required>
                                <div class="error-text" id="studentEmailError">Please enter a valid email address.</div>
                            </div>
                            <div class="form-group">
                                <label for="studentPhone" class="form-label">10-Digit Mobile Number <span class="req">*</span></label>
                                <input type="tel" id="studentPhone" class="form-input" placeholder="10-digit mobile number" maxlength="10" required>
                                <div class="error-text" id="studentPhoneError">Please enter a valid 10-digit mobile number.</div>
                            </div>
                        </div>

                        <!-- Cascading Department & Branch Selectors -->
                        <div class="form-row">
                            <div class="form-group">
                                <label for="selectedDepartment" class="form-label">Academic Department <span class="req">*</span></label>
                                <select id="selectedDepartment" class="form-select" required>
                                    <option value="">-- Choose Department --</option>
                                    ${departments.map(d => `<option value="${d.id}">${d.name}</option>`).join("")}
                                </select>
                                <div class="error-text" id="selectedDepartmentError">Please select an academic department.</div>
                            </div>

                            <div class="form-group">
                                <label for="selectedBranch" class="form-label">Specialized Branch <span class="req">*</span></label>
                                <select id="selectedBranch" class="form-select" required disabled>
                                    <option value="">-- First Select Department --</option>
                                </select>
                                <div class="error-text" id="selectedBranchError">Please select a specialized branch.</div>
                            </div>
                        </div>

                        <!-- Student Level -->
                        <div class="form-group">
                            <label for="studyLevel" class="form-label">Academic Level <span class="req">*</span></label>
                            <select id="studyLevel" class="form-select" required>
                                <option value="">-- Select Study Level --</option>
                                <option value="Undergraduate (B.Tech / B.S.)">Undergraduate (B.Tech / B.S.)</option>
                                <option value="Graduate (M.S. / M.Tech)">Graduate (M.S. / M.Tech)</option>
                                <option value="Doctoral (Ph.D. Fellow)">Doctoral (Ph.D. Fellow)</option>
                                <option value="Executive Diploma">Executive Diploma</option>
                            </select>
                            <div class="error-text" id="studyLevelError">Please select your academic study level.</div>
                        </div>

                        <!-- Message / Statement of Interest -->
                        <div class="form-group">
                            <label for="admissionStatement" class="form-label">Statement of Interest / Academic Query <span class="req">*</span></label>
                            <textarea id="admissionStatement" class="form-textarea" rows="4" placeholder="Detail your career goals, prior coursework, research passion, or specific questions..." required minlength="15"></textarea>
                            <div class="error-text" id="admissionStatementError">Please write at least 15 characters regarding your goals.</div>
                        </div>

                        <!-- Consent Checkbox -->
                        <div class="form-group">
                            <div class="checkbox-wrap">
                                <input type="checkbox" id="admissionConsent" required>
                                <label for="admissionConsent" class="checkbox-label">
                                    I certify that all supplied credentials are accurate and authorize Unipix University Admissions to communicate with me.
                                </label>
                            </div>
                            <div class="error-text" id="admissionConsentError" style="margin-left: 24px;">You must agree before submitting.</div>
                        </div>

                        <!-- Submit Button -->
                        <button type="submit" class="btn btn-crimson" style="width: 100%; font-size: 1.05rem; padding: 15px;">
                            <span>Submit Application / Enquiry</span>
                            <span>↗</span>
                        </button>
                    </form>

                    <!-- Success Card Display -->
                    <div id="admissionSuccessCard" class="success-box-card">
                        <div class="success-check-icon">✓</div>
                        <h3 style="font-family: var(--font-heading); font-size: 1.6rem; color: var(--color-text-dark); margin-bottom: 8px;">
                            Application Logged Successfully!
                        </h3>
                        <p style="color: var(--color-text-body); font-size: 0.95rem;">
                            Congratulations on taking your first step toward Unipix University. Your admission ticket has been dispatched to admissions councilors.
                        </p>
                        <div>
                            <span class="app-ref-id" id="displayRefNumber">UPIX-2026-8941</span>
                        </div>
                        <div id="applicationSummaryBox" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 20px; text-align: left; margin: 20px 0; font-size: 0.9rem; line-height: 1.6;"></div>
                        <button type="button" class="btn btn-outline-dark" onclick="resetAdmissionForm()">Submit Another Application</button>
                    </div>
                </div>
            </div>
        </section>

        <!-- UPCOMING EVENTS & NEWS -->
        <section class="events-news-section">
            <div class="container">
                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 10px;">
                    <div>
                        <div class="section-badge">
                            <span>📅</span>
                            <span>Happenings</span>
                        </div>
                        <h2 class="section-headline">Upcoming Events</h2>
                    </div>
                    <a href="#events" class="hero-link-underline">View All Events ↗</a>
                </div>

                <div class="events-grid">
                    ${events.map(ev => `
                        <div class="event-card">
                            <span class="event-date-badge">${ev.date}</span>
                            <h3 class="event-title">${ev.title}</h3>
                            <p style="font-size: 0.88rem; color: var(--color-text-muted); margin-bottom: 16px;">📍 ${ev.location}</p>
                            <button class="btn btn-outline-dark" style="margin-top: auto; padding: 8px 18px; font-size: 0.85rem;" onclick="openEventRegisterModal('${ev.id}')">
                                Register / RSVP ↗
                            </button>
                        </div>
                    `).join("")}
                </div>

                <!-- Latest News -->
                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 60px; margin-bottom: 10px;">
                    <div>
                        <div class="section-badge">
                            <span>📰</span>
                            <span>Research &amp; Blog</span>
                        </div>
                        <h2 class="section-headline">Read Our Latest News</h2>
                    </div>
                    <a href="#news" class="hero-link-underline">All News Stories ↗</a>
                </div>

                <div class="news-grid">
                    ${news.map(n => `
                        <div class="news-card">
                            <span class="badge-pill" style="margin-bottom: 12px; width: fit-content;">${n.category}</span>
                            <h3 class="news-title">${n.title}</h3>
                            <time style="font-size: 0.78rem; color: #64748b; margin-bottom: 10px; display: block;">${n.date}</time>
                            <p style="font-size: 0.88rem; color: var(--color-text-body); margin-bottom: 18px;">${n.summary}</p>
                            <a href="#news" class="program-link" style="margin-top: auto;">Read Full Article ↗</a>
                        </div>
                    `).join("")}
                </div>
            </div>
        </section>

        <!-- NEWSLETTER SUBSCRIPTION BAR -->
        <section class="newsletter-bar">
            <div class="container newsletter-container">
                <div>
                    <h3 style="font-family: var(--font-heading); font-size: 1.8rem; margin-bottom: 6px;">Don't Miss Academic News</h3>
                    <p style="font-size: 0.95rem; opacity: 0.9;">Subscribe to receive research publications, department seminars, and scholarship updates.</p>
                </div>
                <form class="newsletter-form" onsubmit="event.preventDefault(); showToast('Subscribed to Unipix academic newsletter!', 'success'); this.reset();">
                    <input type="email" placeholder="Enter your email address" class="newsletter-input" required>
                    <button type="submit" class="newsletter-btn">Subscribe</button>
                </form>
            </div>
        </section>
    `;
}

// 2. ABOUT VIEW
function getAboutViewHTML() {
    const about = unipixData?.about || {};

    return `
        <div style="background-color: var(--color-navy-dark); color: #ffffff; padding: 60px 0;">
            <div class="container">
                <h1 style="font-family: var(--font-heading); font-size: 2.8rem; margin-bottom: 10px;">About Unipix University</h1>
                <p style="color: #cbd5e1; font-size: 1.1rem; max-width: 650px;">
                    Founded in 1971, Unipix stands at the vanguard of higher education, merging rigorous scientific methodology with humanistic inquiry.
                </p>
            </div>
        </div>

        <div class="container" style="padding: 60px 24px;">
            <div style="background: #ffffff; border: 1px solid var(--color-border-subtle); border-radius: var(--radius-md); padding: 40px; box-shadow: var(--shadow-card); margin-bottom: 40px;">
                <h2 class="section-headline">Our Founding Heritage &amp; Vision</h2>
                <p style="font-size: 1.05rem; line-height: 1.8; color: var(--color-text-body); margin-bottom: 25px;">
                    ${about.description || "With a rich history of scholarship and commitment to cutting-edge research, Unipix offers a wide range of programs across various disciplines, ensuring that every student can find their passion and pursue their goals."}
                </p>
                <div class="history-image-wrap">
                    <img src="${about.image || 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&q=80'}" alt="Unipix Campus Quadrangle">
                </div>
            </div>

            <div class="stats-grid">
                ${(about.stats || []).map(stat => `
                    <div class="stat-item">
                        <div class="stat-value">${stat.value}</div>
                        <div class="stat-label">${stat.label}</div>
                    </div>
                `).join("")}
            </div>
        </div>
    `;
}

// 3. DEPARTMENTS & BRANCHES VIEW (EXPLICIT USER REQUEST)
function getDepartmentsViewHTML() {
    const departments = unipixData?.departments || [];

    return `
        <div style="background-color: var(--color-primary-crimson); color: #ffffff; padding: 60px 0;">
            <div class="container">
                <h1 style="font-family: var(--font-heading); font-size: 2.8rem; margin-bottom: 10px;">Academic Departments &amp; Specialized Branches</h1>
                <p style="color: #fde8eb; font-size: 1.1rem; max-width: 700px;">
                    Explore our comprehensive spectrum of degree programs, state-of-the-art research laboratories, and specialized industry tracks.
                </p>
            </div>
        </div>

        <div class="container" style="padding: 50px 24px;">
            <!-- Filter Bar -->
            <div class="dept-filter-controls">
                <input type="text" id="deptSearchInput" placeholder="🔍 Search branches (e.g. Cloud, Machine Learning, Robotics, Biomaterials)...">
                <select id="deptSelectFilter">
                    <option value="ALL">All Departments (${departments.length})</option>
                    ${departments.map(d => `<option value="${d.id}">${d.name}</option>`).join("")}
                </select>
            </div>

            <div class="departments-grid" id="departmentsContainer">
                ${departments.map(dept => `
                    <div class="department-full-card" data-dept-id="${dept.id}" data-search="${(dept.name + ' ' + dept.branches.map(b => b.name).join(' ')).toLowerCase()}">
                        <div class="dept-card-header">
                            <div class="dept-icon-box">${dept.icon}</div>
                            <div class="dept-title-group">
                                <span class="dept-code-badge">${dept.code}</span>
                                <h3>${dept.name}</h3>
                            </div>
                        </div>
                        <p class="dept-desc">${dept.description}</p>
                        <div class="dept-head-info">
                            Department Chair: <strong>${dept.head}</strong>
                        </div>

                        <div class="branches-title">Specialized Branches:</div>
                        <div class="branches-list">
                            ${dept.branches.map(branch => `
                                <div class="branch-sub-item">
                                    <div class="branch-name-row">
                                        <span class="branch-name">${branch.name}</span>
                                        <span class="branch-seats">${branch.seats} Seats</span>
                                    </div>
                                    <p class="branch-focus">${branch.focus}</p>
                                </div>
                            `).join("")}
                        </div>
                    </div>
                `).join("")}
            </div>
        </div>
    `;
}

// 4. COURSES VIEW
function getCoursesViewHTML() {
    const courses = unipixData?.courses || [];

    return `
        <div style="background-color: var(--color-navy-dark); color: #ffffff; padding: 60px 0;">
            <div class="container">
                <h1 style="font-family: var(--font-heading); font-size: 2.8rem; margin-bottom: 10px;">Curriculum &amp; Course Syllabi</h1>
                <p style="color: #cbd5e1; font-size: 1.1rem; max-width: 650px;">
                    Explore our dynamic course offerings mapped across undergraduate, graduate, and research specializations.
                </p>
            </div>
        </div>

        <div class="container" style="padding: 50px 24px;">
            <div class="departments-grid">
                ${courses.map(course => `
                    <div class="department-full-card">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <span class="badge-pill">${course.code}</span>
                            <span style="font-size: 0.85rem; font-weight: 700; color: var(--color-primary-crimson);">${course.credits} Credits</span>
                        </div>
                        <h3 style="font-family: var(--font-heading); font-size: 1.25rem; margin-bottom: 6px;">${course.name}</h3>
                        <p style="font-size: 0.82rem; color: #64748b; margin-bottom: 6px;"><strong>Department:</strong> ${course.department}</p>
                        <p style="font-size: 0.82rem; color: var(--color-primary-crimson); margin-bottom: 12px;"><strong>Branch Track:</strong> ${course.branch}</p>
                        <div style="display: flex; gap: 8px; margin-top: auto;">
                            <span style="background: #f1f5f9; font-size: 0.75rem; padding: 3px 8px; border-radius: 4px; font-weight: 600;">${course.level}</span>
                            <span style="background: #fdf2f4; color: var(--color-primary-crimson); font-size: 0.75rem; padding: 3px 8px; border-radius: 4px; font-weight: 600;">${course.duration}</span>
                        </div>
                    </div>
                `).join("")}
            </div>
        </div>
    `;
}

// 5. EVENTS VIEW
function getEventsViewHTML() {
    const events = unipixData?.events || [];

    return `
        <div style="background-color: var(--color-primary-crimson); color: #ffffff; padding: 60px 0;">
            <div class="container">
                <h1 style="font-family: var(--font-heading); font-size: 2.8rem; margin-bottom: 10px;">Campus Events &amp; Symposia</h1>
                <p style="color: #fde8eb; font-size: 1.1rem; max-width: 650px;">
                    Join cutting-edge academic forums, career networking expos, and student cultural celebrations.
                </p>
            </div>
        </div>

        <div class="container" style="padding: 50px 24px;">
            <div class="events-grid">
                ${events.map(ev => `
                    <div class="event-card">
                        <span class="event-date-badge">${ev.date}</span>
                        <h3 class="event-title">${ev.title}</h3>
                        <p style="font-size: 0.88rem; color: var(--color-text-muted); margin-bottom: 16px;">📍 Location: ${ev.location}</p>
                        <button class="btn btn-outline-dark" style="margin-top: auto; padding: 8px 18px; font-size: 0.85rem;" onclick="openEventRegisterModal('${ev.id}')">
                            Register / RSVP ↗
                        </button>
                    </div>
                `).join("")}
            </div>
        </div>
    `;
}

// 6. NEWS VIEW
function getNewsViewHTML() {
    const news = unipixData?.news || [];

    return `
        <div style="background-color: var(--color-navy-dark); color: #ffffff; padding: 60px 0;">
            <div class="container">
                <h1 style="font-family: var(--font-heading); font-size: 2.8rem; margin-bottom: 10px;">Unipix Research News &amp; Blog</h1>
                <p style="color: #cbd5e1; font-size: 1.1rem; max-width: 650px;">
                    Discover our latest discoveries, faculty honors, and breakthrough student ventures.
                </p>
            </div>
        </div>

        <div class="container" style="padding: 50px 24px;">
            <div class="news-grid">
                ${news.map(n => `
                    <div class="news-card">
                        <span class="badge-pill" style="margin-bottom: 12px; width: fit-content;">${n.category}</span>
                        <h3 class="news-title">${n.title}</h3>
                        <time style="font-size: 0.78rem; color: #64748b; margin-bottom: 10px; display: block;">${n.date}</time>
                        <p style="font-size: 0.88rem; color: var(--color-text-body); margin-bottom: 18px;">${n.summary}</p>
                    </div>
                `).join("")}
            </div>
        </div>
    `;
}

// 7. ENQUIRY & ADMISSION VIEW
function getEnquiryViewHTML() {
    const departments = unipixData?.departments || [];

    return `
        <div style="background-color: var(--color-primary-crimson); color: #ffffff; padding: 60px 0;">
            <div class="container">
                <h1 style="font-family: var(--font-heading); font-size: 2.8rem; margin-bottom: 10px;">Admissions &amp; Department Enquiry</h1>
                <p style="color: #fde8eb; font-size: 1.1rem; max-width: 650px;">
                    Select your academic department and specialization branch below to begin your admission process.
                </p>
            </div>
        </div>

        <div class="container" style="padding: 60px 24px; max-width: 860px;">
            <div class="form-wrapper-card">
                <form id="admissionEnquiryForm" novalidate>
                    <!-- Full Name -->
                    <div class="form-group">
                        <label for="studentFullName" class="form-label">Full Name <span class="req">*</span></label>
                        <input type="text" id="studentFullName" class="form-input" placeholder="e.g. Jane Saxon" required minlength="3">
                        <div class="error-text" id="studentFullNameError">Please enter a valid full name (minimum 3 letters).</div>
                    </div>

                    <!-- Email & Phone -->
                    <div class="form-row">
                        <div class="form-group">
                            <label for="studentEmail" class="form-label">Email Address <span class="req">*</span></label>
                            <input type="email" id="studentEmail" class="form-input" placeholder="jane@unipix.edu" required>
                            <div class="error-text" id="studentEmailError">Please enter a valid email address.</div>
                        </div>
                        <div class="form-group">
                            <label for="studentPhone" class="form-label">10-Digit Mobile Number <span class="req">*</span></label>
                            <input type="tel" id="studentPhone" class="form-input" placeholder="10-digit mobile number" maxlength="10" required>
                            <div class="error-text" id="studentPhoneError">Please enter a valid 10-digit mobile number.</div>
                        </div>
                    </div>

                    <!-- Cascading Department & Branch Selectors -->
                    <div class="form-row">
                        <div class="form-group">
                            <label for="selectedDepartment" class="form-label">Academic Department <span class="req">*</span></label>
                            <select id="selectedDepartment" class="form-select" required>
                                <option value="">-- Choose Department --</option>
                                ${departments.map(d => `<option value="${d.id}">${d.name}</option>`).join("")}
                            </select>
                            <div class="error-text" id="selectedDepartmentError">Please select an academic department.</div>
                        </div>

                        <div class="form-group">
                            <label for="selectedBranch" class="form-label">Specialized Branch <span class="req">*</span></label>
                            <select id="selectedBranch" class="form-select" required disabled>
                                <option value="">-- First Select Department --</option>
                            </select>
                            <div class="error-text" id="selectedBranchError">Please select a specialized branch.</div>
                        </div>
                    </div>

                    <!-- Student Level -->
                    <div class="form-group">
                        <label for="studyLevel" class="form-label">Academic Level <span class="req">*</span></label>
                        <select id="studyLevel" class="form-select" required>
                            <option value="">-- Select Study Level --</option>
                            <option value="Undergraduate (B.Tech / B.S.)">Undergraduate (B.Tech / B.S.)</option>
                            <option value="Graduate (M.S. / M.Tech)">Graduate (M.S. / M.Tech)</option>
                            <option value="Doctoral (Ph.D. Fellow)">Doctoral (Ph.D. Fellow)</option>
                            <option value="Executive Diploma">Executive Diploma</option>
                        </select>
                        <div class="error-text" id="studyLevelError">Please select your academic study level.</div>
                    </div>

                    <!-- Statement -->
                    <div class="form-group">
                        <label for="admissionStatement" class="form-label">Statement of Interest / Academic Query <span class="req">*</span></label>
                        <textarea id="admissionStatement" class="form-textarea" rows="4" placeholder="Detail your career goals, prior coursework, research passion, or specific questions..." required minlength="15"></textarea>
                        <div class="error-text" id="admissionStatementError">Please write at least 15 characters regarding your goals.</div>
                    </div>

                    <!-- Consent Checkbox -->
                    <div class="form-group">
                        <div class="checkbox-wrap">
                            <input type="checkbox" id="admissionConsent" required>
                            <label for="admissionConsent" class="checkbox-label">
                                I certify that all supplied credentials are accurate and authorize Unipix University Admissions to communicate with me.
                            </label>
                        </div>
                        <div class="error-text" id="admissionConsentError" style="margin-left: 24px;">You must agree before submitting.</div>
                    </div>

                    <!-- Submit Button -->
                    <button type="submit" class="btn btn-crimson" style="width: 100%; font-size: 1.05rem; padding: 15px;">
                        <span>Submit Application / Enquiry</span>
                        <span>↗</span>
                    </button>
                </form>

                <!-- Success Confirmation -->
                <div id="admissionSuccessCard" class="success-box-card">
                    <div class="success-check-icon">✓</div>
                    <h3 style="font-family: var(--font-heading); font-size: 1.6rem; color: var(--color-text-dark); margin-bottom: 8px;">
                        Application Logged Successfully!
                    </h3>
                    <p style="color: var(--color-text-body); font-size: 0.95rem;">
                        Congratulations on taking your first step toward Unipix University. Your admission ticket has been dispatched to admissions councilors.
                    </p>
                    <div>
                        <span class="app-ref-id" id="displayRefNumber">UPIX-2026-8941</span>
                    </div>
                    <div id="applicationSummaryBox" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 20px; text-align: left; margin: 20px 0; font-size: 0.9rem; line-height: 1.6;"></div>
                    <button type="button" class="btn btn-outline-dark" onclick="resetAdmissionForm()">Submit Another Application</button>
                </div>
            </div>
        </div>
    `;
}

// 8. NOT FOUND VIEW
function getNotFoundHTML() {
    return `
        <div class="container" style="padding: 100px 24px; text-align: center;">
            <h1 style="font-family: var(--font-heading); font-size: 3.5rem; color: var(--color-primary-crimson); margin-bottom: 12px;">404</h1>
            <h2 style="font-family: var(--font-heading); font-size: 1.8rem; margin-bottom: 18px;">Page Not Found</h2>
            <p style="color: var(--color-text-muted); margin-bottom: 25px;">The section you requested does not exist or has been relocated.</p>
            <a href="#home" class="btn btn-crimson">Return to Unipix Home</a>
        </div>
    `;
}

/**
 * CASCADING DEPARTMENT & BRANCH DROPDOWN LOGIC
 */
function initAdmissionFormEvents() {
    const deptSelect = document.getElementById("selectedDepartment");
    const branchSelect = document.getElementById("selectedBranch");

    if (deptSelect && branchSelect) {
        deptSelect.addEventListener("change", () => {
            const chosenDeptId = deptSelect.value;
            branchSelect.innerHTML = `<option value="">-- Choose Branch Specialization --</option>`;

            if (!chosenDeptId) {
                branchSelect.disabled = true;
                return;
            }

            const deptObj = (unipixData?.departments || []).find(d => d.id === chosenDeptId);
            if (deptObj && deptObj.branches) {
                deptObj.branches.forEach(b => {
                    const opt = document.createElement("option");
                    opt.value = b.name;
                    opt.textContent = `${b.name} (${b.seats} seats)`;
                    branchSelect.appendChild(opt);
                });
                branchSelect.disabled = false;
            } else {
                branchSelect.disabled = true;
            }
        });
    }

    // Attach Client-Side Form Validation
    const form = document.getElementById("admissionEnquiryForm");
    if (!form) return;

    const fields = [
        { id: "studentFullName", validator: (el) => el.value.trim().length >= 3 && /^[a-zA-Z\s.'-]+$/.test(el.value.trim()) },
        { id: "studentEmail", validator: (el) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(el.value.trim()) },
        { id: "studentPhone", validator: (el) => el.value.replace(/\D/g, "").length === 10 },
        { id: "selectedDepartment", validator: (el) => el.value !== "" },
        { id: "selectedBranch", validator: (el) => el.value !== "" },
        { id: "studyLevel", validator: (el) => el.value !== "" },
        { id: "admissionStatement", validator: (el) => el.value.trim().length >= 15 },
        { id: "admissionConsent", validator: (el) => el.checked }
    ];

    fields.forEach(({ id, validator }) => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener("blur", () => applyValidation(el, validator(el), `${id}Error`));
            el.addEventListener("input", () => {
                if (el.classList.contains("is-invalid")) {
                    applyValidation(el, validator(el), `${id}Error`);
                }
            });
            if (el.tagName === "SELECT") {
                el.addEventListener("change", () => applyValidation(el, validator(el), `${id}Error`));
            }
        }
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        let valid = true;

        fields.forEach(({ id, validator }) => {
            const el = document.getElementById(id);
            if (el) {
                const isFieldValid = validator(el);
                applyValidation(el, isFieldValid, `${id}Error`);
                if (!isFieldValid) valid = false;
            }
        });

        if (valid) {
            processAdmissionSubmission(form);
        } else {
            showToast("Please correct highlighted fields before submitting.", "error");
        }
    });
}

function applyValidation(el, isValid, errorId) {
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

function processAdmissionSubmission(form) {
    const name = document.getElementById("studentFullName").value.trim();
    const email = document.getElementById("studentEmail").value.trim();
    const phone = document.getElementById("studentPhone").value.trim();
    const deptSelect = document.getElementById("selectedDepartment");
    const deptName = deptSelect.options[deptSelect.selectedIndex].text;
    const branch = document.getElementById("selectedBranch").value;
    const level = document.getElementById("studyLevel").value;
    const statement = document.getElementById("admissionStatement").value.trim();

    const refCode = `UPIX-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    form.style.display = "none";
    const successCard = document.getElementById("admissionSuccessCard");
    const refEl = document.getElementById("displayRefNumber");
    const summaryBox = document.getElementById("applicationSummaryBox");

    if (refEl) refEl.textContent = refCode;
    if (summaryBox) {
        summaryBox.innerHTML = `
            <p><strong>Candidate Name:</strong> ${name}</p>
            <p><strong>Registered Email:</strong> ${email}</p>
            <p><strong>Mobile Contact:</strong> ${phone}</p>
            <p><strong>Department:</strong> ${deptName}</p>
            <p><strong>Selected Branch:</strong> ${branch}</p>
            <p><strong>Academic Level:</strong> ${level}</p>
            <p><strong>Statement of Purpose:</strong> "${statement}"</p>
        `;
    }

    if (successCard) successCard.style.display = "block";
    showToast(`Application successfully logged with Ref ${refCode}!`, "success");
}

function resetAdmissionForm() {
    const form = document.getElementById("admissionEnquiryForm");
    const successCard = document.getElementById("admissionSuccessCard");
    if (form) {
        form.reset();
        form.querySelectorAll(".is-valid, .is-invalid").forEach(el => el.classList.remove("is-valid", "is-invalid"));
        form.style.display = "block";
    }
    if (successCard) successCard.style.display = "none";
}

/**
 * DEPARTMENT & BRANCH EXPLORER FILTER
 */
function initDepartmentFilterEvents() {
    const searchInput = document.getElementById("deptSearchInput");
    const filterSelect = document.getElementById("deptSelectFilter");

    if (searchInput) {
        searchInput.addEventListener("input", filterDepartments);
    }
    if (filterSelect) {
        filterSelect.addEventListener("change", filterDepartments);
    }
}

function filterDepartments() {
    const query = (document.getElementById("deptSearchInput")?.value || "").toLowerCase().trim();
    const selectedDeptId = document.getElementById("deptSelectFilter")?.value || "ALL";

    document.querySelectorAll(".department-full-card").forEach(card => {
        const cardDeptId = card.getAttribute("data-dept-id") || "";
        const cardSearchText = card.getAttribute("data-search") || "";

        const matchesQuery = query === "" || cardSearchText.includes(query);
        const matchesDept = selectedDeptId === "ALL" || cardDeptId === selectedDeptId;

        card.style.display = (matchesQuery && matchesDept) ? "flex" : "none";
    });
}

/**
 * MODAL SYSTEM
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

function openCampusTourVideoModal() {
    openModal(`
        <h2 style="font-family: var(--font-heading); font-size: 1.5rem; color: var(--color-primary-crimson); margin-bottom: 12px;">
            Explore Unipix University Campus
        </h2>
        <p style="color: var(--color-text-body); margin-bottom: 18px;">
            Nestled across historic Cambridge, Massachusetts, Unipix University blends 19th-century architecture with cutting-edge laboratories, innovation accelerators, and residential student quads.
        </p>
        <div style="background-color: #0b132b; border-radius: 8px; padding: 30px; text-align: center; color: #ffffff; margin-bottom: 20px;">
            <div style="font-size: 3rem; margin-bottom: 10px;">🎥</div>
            <h4>Virtual 360° Campus Walkthrough</h4>
            <p style="font-size: 0.85rem; color: #94a3b8; margin-top: 6px;">Experience the Great Quadrangle, Robotics Labs, and fosdick research centers.</p>
        </div>
        <a href="#departments" class="btn btn-crimson" onclick="closeModal()">Explore Department Facilities ↗</a>
    `);
}

function openSearchModal() {
    openModal(`
        <h2 style="font-family: var(--font-heading); font-size: 1.4rem; margin-bottom: 15px;">Search Unipix University</h2>
        <input type="text" id="modalSearchInput" placeholder="Type department, branch, or course name..." 
               style="width: 100%; padding: 12px 16px; border: 1.5px solid var(--color-border-subtle); border-radius: 6px; font-size: 1rem; margin-bottom: 20px;"
               oninput="executeModalSearch(this.value)">
        <div id="modalSearchResults" style="max-height: 320px; overflow-y: auto;">
            <p style="color: #64748b; font-size: 0.9rem;">Type above to instantly search across 6 departments, 16 branches, and course catalogs.</p>
        </div>
    `);
}

function executeModalSearch(query) {
    const q = query.trim().toLowerCase();
    const container = document.getElementById("modalSearchResults");
    if (!container) return;

    if (!q) {
        container.innerHTML = `<p style="color: #64748b; font-size: 0.9rem;">Type above to search.</p>`;
        return;
    }

    const matches = [];

    // Search Departments & Branches
    (unipixData?.departments || []).forEach(dept => {
        if (dept.name.toLowerCase().includes(q)) {
            matches.push({ type: "Department", title: dept.name, link: "#departments" });
        }
        (dept.branches || []).forEach(b => {
            if (b.name.toLowerCase().includes(q) || b.focus.toLowerCase().includes(q)) {
                matches.push({ type: "Specialized Branch", title: `${b.name} (${dept.name})`, link: "#departments" });
            }
        });
    });

    // Search Courses
    (unipixData?.courses || []).forEach(c => {
        if (c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)) {
            matches.push({ type: "Course", title: `${c.code}: ${c.name}`, link: "#courses" });
        }
    });

    if (matches.length === 0) {
        container.innerHTML = `<p style="color: #94a3b8; font-size: 0.9rem;">No matches found for "${q}". Try "AI", "Cloud", or "Mechanical".</p>`;
    } else {
        container.innerHTML = matches.map(m => `
            <div style="padding: 10px 0; border-bottom: 1px solid #edf2f7;">
                <span class="badge-pill" style="font-size: 0.65rem;">${m.type}</span>
                <a href="${m.link}" onclick="closeModal()" style="display: block; font-weight: 700; color: var(--color-primary-crimson); margin-top: 4px;">
                    ${m.title} ↗
                </a>
            </div>
        `).join("");
    }
}

function openEventRegisterModal(eventId) {
    const ev = (unipixData?.events || []).find(e => e.id === eventId);
    if (!ev) return;

    openModal(`
        <span class="event-date-badge">${ev.date}</span>
        <h2 style="font-family: var(--font-heading); font-size: 1.4rem; margin: 10px 0;">${ev.title}</h2>
        <p style="color: #64748b; margin-bottom: 16px;">📍 ${ev.location}</p>
        <p style="font-size: 0.95rem; color: var(--color-text-body); margin-bottom: 25px;">
            Reserve your seat for this upcoming Unipix university symposium. A confirmation badge will be emailed to you.
        </p>
        <button class="btn btn-crimson" onclick="showToast('RSVP confirmed for ${ev.title}!', 'success'); closeModal();">Confirm RSVP &amp; Register</button>
    `);
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
function setupGlobalEvents() {
    window.addEventListener("hashchange", renderRoute);

    const mobileBtn = document.getElementById("mobileMenuBtn");
    const mainNav = document.getElementById("mainNav");
    if (mobileBtn && mainNav) {
        mobileBtn.addEventListener("click", () => {
            const isOpen = mainNav.classList.toggle("open");
            mobileBtn.setAttribute("aria-expanded", isOpen);
        });
    }

    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeModal();
    });
}

/**
 * FALLBACK DATA
 */
function getFallbackUnipixData() {
    return {
        hero: { badge: "Knowledge Meets Innovation", titleLine1: "Explore Boundless", titleLine2: "Opportunities at Unipix", ctaText: "View Our Program", ctaLink: "#departments" },
        marquee: ["Applied Mathematics", "Biomedical Engineering", "Anthropology", "Astrophysics", "Computer Science", "Artificial Intelligence", "Data Science"],
        departments: [
            { id: "comp-eng", name: "Department of Computer Engineering", code: "CE", icon: "💻", description: "Computing architectures and cloud systems.", head: "Dr. Angela Merkel", branches: [{ name: "Software Systems & Cloud Architecture", seats: 60, focus: "Cloud pipelines." }] },
            { id: "ai-ds", name: "Department of Artificial Intelligence & Data Science", code: "AIDS", icon: "🤖", description: "Machine intelligence and deep learning.", head: "Dr. Rajeev Motwani", branches: [{ name: "Machine Learning & Deep Learning", seats: 60, focus: "Transformers & LLMs." }] }
        ]
    };
}

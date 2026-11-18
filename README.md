# Alfred University - Smart College Portal (Single Page Application)

![Alfred University Portal](assets/images/winter-courses.svg)

## Project Information
- **Subject:** Web Technology 1 (WT-1)
- **CCE Component:** CCE-5
- **Student Name:** Damini Kotnake
- **Roll Number:** 229
- **Batch:** WT C1
- **GitHub Repository:** [https://github.com/daminikotnake-hub/SmartCollegePortal.git](https://github.com/daminikotnake-hub/SmartCollegePortal.git)

---

## Project Overview
The **Alfred University Smart College Portal** is a modern, responsive Single Page Application (SPA) designed to match the authentic university website design (Founded in 1836). The web application delivers an immersive, interactive experience with client-side routing, dynamic JSON data loading, real-time client-side form validation, and responsive UI components.

### Core Architecture & Key Features:
1. **SPA-Style Navigation without Page Reload**:
   - Complete single-page user experience where all section transitions (`#home`, `#admissions`, `#academics`, `#campus-life`, `#individuals`, `#athletics`, `#news`, `#enquiry`, `#visit`) happen instantaneously without browser reloading.
2. **Client-Side Routing Using JavaScript**:
   - Hash-based router (`window.location.hash` and `hashchange` event listener) maps routes directly to modular view renderers.
   - Dynamic document title updates and active navigation state indicators.
   - Graceful fallback for non-existent routes (404 Not Found view).
3. **Dynamic Data Loading (JSON)**:
   - All content (Hero carousel slides, spotlight news, recent press releases, academic colleges, course catalog, faculty directory, AU Stars alumni, and fast facts) is loaded asynchronously from `data.json` via the JavaScript `Fetch API`.
   - Real-time instant search across departments, courses, and news articles with modal overlay.
   - Interactive filtering by department and keyword query in the Academics tab.
4. **Client-Side Validation**:
   - Comprehensive interactive "Schedule a Visit & Student Enquiry" application form.
   - Real-time field validation on `blur` and `input`:
     - **Full Name**: Non-empty, 3+ characters, letters and spaces only.
     - **Email Address**: Standard RFC email format verification regex.
     - **Mobile Number**: Strict 10-digit mobile number validation pattern (`^\d{10}$`).
     - **Academic Department & Student Status**: Required selection dropdowns.
     - **Preferred Visit Date**: Ensures selected date is a valid future date.
     - **Enquiry Message**: Minimum 15 characters for detailed questions.
     - **Terms & Consent**: Required confirmation checkbox.
   - Visual indicators: Red error borders and descriptive error messages for invalid fields; green borders for valid fields; interactive success card displaying a generated unique application reference number (e.g. `AU-2026-7842`).
5. **Responsive UI & Authentic University Design**:
   - Deep royal purple branding (`#51296E`), dark violet utility bar (`#402456`), warm bronze visit card (`#9A7C5F`), and dark navy news card (`#282F39`).
   - Overlapping floating cards layout on desktop accurately reflecting the university design mockup.
   - Fluid typography and responsive CSS Grid/Flexbox architecture.
   - Mobile navigation drawer toggle for smartphones and tablets.

---

## Directory Structure
```text
WT_CCE5_229_SmartCollegePortal/
├── index.html           # Main HTML5 semantic SPA shell
├── style.css            # Responsive CSS styles, variables & media queries
├── app.js               # Client-side router, JSON fetch, search & validation
├── data.json            # Dynamic university dataset (academics, news, spotlight)
├── README.md            # Comprehensive project documentation
├── assets/
│   └── images/          # Scalable vector graphics & thumbnail illustrations
│       ├── au-seal.svg
│       ├── winter-courses.svg
│       ├── homecoming.svg
│       ├── art-galleries.svg
│       └── dr-peggy-wozniak.svg
└── screenshots/         # Reference screenshots of the portal
```

---

## Technologies Used
- **HTML5**: Semantic tags, accessibility attributes (`aria-expanded`, `aria-label`, `aria-live`).
- **CSS3**: Custom CSS variables, CSS Grid, Flexbox, keyframe animations, overlapping negative margin layouts, media queries.
- **JavaScript (ES6+)**: Async/await, Fetch API, DOM manipulation, Regex validation, event listeners.
- **JSON**: Structured dynamic data storage.
- **Git & GitHub**: Version control and remote repository hosting.

---

## How to Run Locally

### Option 1: VS Code Live Server (Recommended)
1. Open the project folder `WT_CCE5_229_SmartCollegePortal` in **VS Code**.
2. Right-click `index.html` and select **"Open with Live Server"**.
3. The website will open in your default browser at `http://127.0.0.1:5500/index.html`.

### Option 2: Python Local Server
Run the following command in PowerShell/Terminal inside the project directory:
```powershell
python -m http.server 8000
```
Then navigate to `http://localhost:8000` in any web browser.

---

## Single Page Navigation Routes
- `/#home` - Homepage with Hero banner, overlapping Visit/News cards, Spotlight, and Did You Know features.
- `/#admissions` - Admissions paths (Undergraduate, Transfer, Graduate) and campus visit options.
- `/#academics` - Searchable and filterable colleges, majors, and dynamic course catalog.
- `/#campus-life` - Residence life, student clubs, and Harder Hall art galleries.
- `/#individuals` - AU Stars spotlight (Dr. Peggy Wozniak) and distinguished faculty directory.
- `/#athletics` - Saxon athletics, mascot, Empire 8 Conference, and varsity teams.
- `/#news` - Official university press releases and newsroom.
- `/#enquiry` - Client-side validated Student Enquiry & Campus Visit booking form.

---

## Academic Declaration
This project is submitted by **Damini Kotnake** (Roll No: 229, Batch WT C1) in partial fulfillment of the requirements for **Web Technology 1 - Continuous Comprehensive Evaluation (CCE-5)**.

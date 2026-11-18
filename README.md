# Unipix University - Smart College Portal (Single Page Application)

![Unipix University](assets/images/campus-hero.svg)

## Project Information
- **Subject:** Web Technology 1 (WT-1)
- **CCE Component:** CCE-5
- **Student Name:** Damini Kotnake
- **Roll Number:** 229
- **Batch:** WT C1
- **GitHub Repository:** [https://github.com/daminikotnake-hub/SmartCollegePortal.git](https://github.com/daminikotnake-hub/SmartCollegePortal.git)

---

## Project Overview
The **Unipix University Smart College Portal** is an authentic, responsive Single Page Application (SPA) designed to match the **Unipix University** visual design ("Knowledge Meets Innovation - Estd 1971"). The application features comprehensive academic departments, specialized branch specializations, client-side routing, dynamic JSON data loading, dual-stripe marquee ticker, and cascading client-side form validation.

### Key Highlights & Features:
1. **SPA-Style Navigation without Page Reload**:
   - Single-page application architecture where clicking navigation links (`#home`, `#about`, `#departments`, `#courses`, `#events`, `#news`, `#enquiry`) renders views dynamically without full page reloads.
2. **Client-Side Routing Using JavaScript**:
   - Hash-based router maps URLs directly to modular view functions with document title updates, active link highlighting, and a 404 fallback page.
3. **Comprehensive Academic Departments & Branches**:
   - **Department of Computer Engineering (CE)**:
     - Software Systems & Cloud Architecture (60 seats)
     - Cyber Security & Cryptography (45 seats)
     - Computer Networks & Internet of Things (40 seats)
   - **Department of Artificial Intelligence & Data Science (AIDS)**:
     - Machine Learning & Deep Learning (60 seats)
     - Generative AI & Natural Language Processing (50 seats)
     - Autonomous Robotics & Computer Vision (40 seats)
   - **Department of Information Technology (IT)**:
     - Full-Stack Web Architectures & SPAs (60 seats)
     - Enterprise Cloud DevOps & CI/CD (45 seats)
   - **Department of Mechanical Engineering (ME)**:
     - Robotics, Mechatronics & Automation (50 seats)
     - Thermal & Renewable Clean Energy (40 seats)
     - Smart CAD/CAM & Additive Manufacturing (40 seats)
   - **Department of Biomedical Engineering (BME)**:
     - Biomaterials & Medical Implants (35 seats)
     - Neural Engineering & Biosensors (35 seats)
   - **Department of Applied Mathematics & Astrophysics (AMA)**:
     - Computational Mathematics & Quantum Computing (30 seats)
     - Astrophysics & Space Science (30 seats)
4. **Dynamic Data Loading (JSON)**:
   - All departments, branches, course syllabi, campus life data, faculty quote, events, and news articles are loaded asynchronously from `data.json` via the JavaScript `Fetch API`.
   - Real-time department and branch search filter.
   - Interactive live search modal dialog across all curricula.
5. **Cascading Client-Side Form Validation**:
   - "Admission Now" enquiry and enrollment form.
   - **Cascading dropdowns**: Selecting an academic department dynamically populates the specialized branch options available for that department.
   - Real-time field validation on `blur` and `input`:
     - **Full Name**: Non-empty, 3+ characters, letters only.
     - **Email Address**: Standard RFC email format verification regex.
     - **Mobile Number**: Strict 10-digit mobile number format (`^\d{10}$`).
     - **Department & Branch**: Cascading required selections.
     - **Study Level**: Required degree level selection.
     - **Statement of Purpose**: Minimum 15 characters.
     - **Terms & Consent**: Required checkbox.
   - Generates unique reference code (e.g. `UPIX-2026-8941`) and summary upon successful submission.
6. **Authentic Visual Design & Responsive UI**:
   - Dual-stripe continuous moving ticker (Navy Blue and Crimson Red tracks).
   - Rotating circular video badge with Play button modal.
   - Rounded hero banners, neoclassical quadrangle history section, 4-card program grid, and faculty spotlight quote.
   - Responsive across mobile, tablet, and desktop viewports.

---

## Directory Structure
```text
WT_CCE5_229_SmartCollegePortal/
├── index.html           # Main semantic SPA HTML shell
├── style.css            # Responsive CSS styles & keyframe animations
├── app.js               # Client-side router, JSON fetch, cascading validation
├── data.json            # Dynamic university dataset (departments, branches, courses)
├── README.md            # Comprehensive project documentation
├── assets/
│   └── images/          # Scalable vector graphics & illustrations
│       ├── unipix-crest.svg
│       ├── campus-hero.svg
│       ├── campus-history.svg
│       ├── campus-life-grads.svg
│       ├── professor-thorne.svg
│       ├── program-undergrad.svg
│       ├── program-grad.svg
│       ├── program-lifelong.svg
│       └── program-global.svg
└── screenshots/         # Screenshots archive
```

---

## How to Run Locally

### Option 1: VS Code Live Server (Recommended)
1. Open the project folder `WT_CCE5_229_SmartCollegePortal` in **VS Code**.
2. Right-click `index.html` and select **"Open with Live Server"**.
3. The website will open in your browser at `http://127.0.0.1:5501/index.html`.

### Option 2: Python HTTP Server
Run the following command in PowerShell/Terminal:
```powershell
python -m http.server 8000
```
Then navigate to `http://localhost:8000/index.html`.

---

## Academic Declaration
This project is submitted by **Damini Kotnake** (Roll No: 229, Batch WT C1) in partial fulfillment of the requirements for **Web Technology 1 - Continuous Comprehensive Evaluation (CCE-5)**.

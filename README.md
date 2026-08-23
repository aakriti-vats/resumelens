# ResumeLens 📄🔍

An AI-assisted, client-side ATS (Applicant Tracking System) resume analyzer. This Single Page Application (SPA) allows users to evaluate their resumes against specific job descriptions to calculate keyword match scores and identify missing qualifications.

**Built for Front End Engineering-II Project Evaluation.**

## ✨ Features
* **Interactive File Parsing:** Drag-and-drop upload zone for text extraction.
* **Dynamic ATS Scoring:** Visual SVG score rings and keyword badge generators to display ATS compatibility.
* **Side-by-Side Comparison:** Compare different resume iterations against a target job description.
* **Data Persistence:** Local scan history saved synchronously using browser `localStorage`.
* **Seamless Routing:** Lightning-fast SPA navigation without page reloads.

## 🛠️ Tech Stack & Architecture
This project was built adhering to strict frontend constraints, utilizing zero external utility frameworks (no Tailwind or Bootstrap).
* **Core:** React, Vite
* **Routing:** React Router v6 (`react-router-dom`)
* **Styling:** CSS Modules, strict semantic HTML5
* **State Management:** React Hooks (`useState`, `useEffect`)

## 🚀 Getting Started

To run this project locally on your machine:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/aakriti-vats/resumelens.git](https://github.com/aakriti-vats/resumelens.git)

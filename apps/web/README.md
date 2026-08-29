# 📝 VedaAI - Smart Exam Evaluation & Answer Mapping

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![Google Gemini](https://img.shields.io/badge/AI-Gemini%203.6%20Flash-4285F4?style=flat-square&logo=google)](https://aistudio.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%20v4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

An intelligent examination evaluation platform that automates question paper extraction, handwritten student answer localization, spatial bounding box highlighting, and automated grading with AI feedback.

Built with a responsive, modern interface for both desktop and mobile devices.

---

## ✨ Features & Capabilities

- 📄 **Universal Document Ingestion**: Upload Question Papers and handwritten Student Answer Sheets as multi-page **PDFs** or **Images (JPEG/PNG)**.
- ⚡ **1-Click Demo Evaluation**: Instant evaluation demonstration with a pre-configured Class 10 Biology test dataset for zero-friction testing.
- 🔍 **Sub-Part Extraction**: Intelligent separation of compound sub-questions (e.g. `11 (a)` and `11 (b)`) into distinct question cards with individual marks and feedback.
- 📍 **Precise Spatial Bounding Box Highlighting**: Computes normalized coordinates `[ymin, xmin, ymax, xmax]` to render a glowing neon-green highlight box with `Q{number}.` badge over handwritten responses on the answer sheet.
- 🔄 **Out-of-Order Answer Mapping**: Accurately maps answers written in arbitrary or non-sequential order; clicking any question card automatically scrolls and navigates the viewer to the corresponding page.
- 🔗 **Multi-Page Spanning Answers**: Supports answers spanning across consecutive pages (e.g. Page 1 bottom to Page 2 top), maintaining highlight boxes per page.
- ⚠️ **Unmatched Writing & Rough Work**: Identifies student rough calculations or unassigned writing not matching any exam question, displaying them as dedicated amber cards.
- 📊 **Automated Grading & AI Feedback**: Per-question score pills (`2/2`, `1/3`, `0/2`), constructive feedback explanations, student handwriting transcription, and overall performance metrics.
- 📱 **Mobile-First Responsive UI**: Dual-pane split workspace on desktop and segmented tab switcher (`[ Questions | Answer Sheet ]`) on mobile devices.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) & React 19
- **Styling**: Tailwind CSS v4 & Lucide Icons
- **Vision & AI Engine**: [Google Gemini 3.6 Flash](https://aistudio.google.com/) (`gemini-3.6-flash`) with structured JSON schema mode
- **Document Processing**: Client-side [PDF.js](https://mozilla.github.io/pdf.js/) rendering with canvas downsampling for rapid, high-resolution OCR
- **Deployment**: [Vercel](https://vercel.com/) with serverless API route configuration (`maxDuration = 120s`)

---

## 🚀 Quick Start (Local Setup)

### 1. Clone the repository
```bash
git clone https://github.com/Rudra2637/paper-check.git
cd paper-check
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:
```bash
# Get your free Gemini API key from https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# Active Gemini Model
GEMINI_MODEL=gemini-3.6-flash
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Edge Cases Handled

| Edge Case | Solution & Handling |
|---|---|
| **Sub-Parts (`11(a)`, `11(b)`)** | Decomposed into discrete question entries with separate marks and AI evaluations. |
| **Out-of-Order Answers** | Identified by content; viewer auto-jumps to whichever page contains the answer. |
| **Multi-Page Answers** | Multi-region coordinate storage (`regions[]`), highlighting each page sequentially. |
| **Unanswered Questions** | Tagged as `Unanswered` (`0/maxMarks`) without drawing false bounding boxes. |
| **Unmatched Rough Work** | Flagged with `status: "UNMATCHED"` and highlighted in amber (`📝 Unmatched Writing`). |
| **Invalid / Swapped Files** | Validated before processing; shows user-friendly error banners if files are swapped. |

---

## 🌐 Deploying to Vercel

1. Push your code to your GitHub repository.
2. Import the repository on [Vercel](https://vercel.com/).
3. In **Settings → Environment Variables**, add:
   - `GEMINI_API_KEY`: `your_gemini_api_key`
   - `GEMINI_MODEL`: `gemini-3.6-flash`
4. Click **Deploy**.

---

## 📄 License
This project is licensed under the MIT License.

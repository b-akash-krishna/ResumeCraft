# Design Guidelines: ATS Resume Builder & AI Mock Interview Platform

## Design Approach

**Selected System:** Material Design 3 + Custom Professional Theme  
**Rationale:** Material Design 3 provides excellent patterns for productivity tools, data-dense interfaces, and form-heavy applications. We'll customize it for a professional, minimalist aesthetic focusing on clarity and trust.

**Core Principles:**
- **Clarity First:** Every element serves a clear purpose in resume optimization or interview preparation
- **Professional Trust:** Clean, authoritative design that conveys competence and reliability
- **Guided Experience:** Progressive disclosure and clear visual hierarchy guide users through complex workflows
- **Performance Feedback:** Real-time visual feedback on ATS scores and interview metrics builds confidence

---

## Color Palette

### Light Mode (Primary)
**Primary (Blue):** 217 91% 60% - Main CTAs, links, active states, ATS score indicators  
**Primary Variant:** 217 91% 70% - Hover states, lighter accents  
**Background:** 0 0% 100% - Main canvas  
**Surface:** 220 14% 96% - Cards, elevated components  
**Surface Variant:** 220 14% 92% - Secondary surfaces, disabled states  
**Text Primary:** 220 13% 18% - Main content  
**Text Secondary:** 220 9% 46% - Supporting text, labels  
**Success (Green):** 142 76% 36% - High ATS scores, positive feedback  
**Warning (Amber):** 38 92% 50% - Medium ATS scores, caution states  
**Error (Red):** 0 84% 60% - Low scores, validation errors

### Dark Mode
**Primary (Blue):** 217 91% 65% - Slightly lighter for contrast  
**Background:** 220 13% 10% - Deep dark canvas  
**Surface:** 220 13% 14% - Elevated cards  
**Surface Variant:** 220 13% 18% - Secondary surfaces  
**Text Primary:** 220 14% 96% - Main readable text  
**Text Secondary:** 220 9% 72% - Supporting text

---

## Typography

**Font Families:**  
- **Primary:** Inter (Google Fonts) - Clean, professional, excellent readability for forms and data
- **Headings:** Inter with tighter tracking (-0.02em) for impact
- **Monospace:** JetBrains Mono (Google Fonts) - For resume code view and technical content

**Type Scale:**
- **H1 (Page Titles):** 2.5rem (40px), font-weight 700, line-height 1.2
- **H2 (Section Headers):** 2rem (32px), font-weight 700, line-height 1.3
- **H3 (Card Titles):** 1.5rem (24px), font-weight 600, line-height 1.4
- **Body Large:** 1.125rem (18px), font-weight 400, line-height 1.6
- **Body:** 1rem (16px), font-weight 400, line-height 1.6
- **Body Small:** 0.875rem (14px), font-weight 400, line-height 1.5
- **Caption:** 0.75rem (12px), font-weight 500, line-height 1.4

---

## Layout System

**Spacing Scale:** Use Tailwind units 2, 4, 6, 8, 12, 16, 20, 24 for consistency

**Container Strategy:**
- **Max Width:** max-w-7xl for main content areas
- **Padding:** px-4 (mobile), px-6 (tablet), px-8 (desktop)
- **Section Spacing:** py-12 (mobile), py-16 (tablet), py-20 (desktop)

**Grid Systems:**
- **Dashboard Cards:** 1 column (mobile), 2 columns (md), 3 columns (lg) - gap-6
- **Resume Editor:** 2-column split on lg+ (60/40 for editor/preview)
- **Template Picker:** 1 column (mobile), 2 columns (md), 3 columns (lg)

---

## Component Library

### Navigation
**Navbar:** Fixed top, backdrop-blur, white/dark surface with subtle shadow, height 64px. Logo left, navigation center, user avatar right. Blue underline for active links (4px thick).

### Hero Section (Home Page)
**Layout:** Single column centered, max-w-4xl, py-24 (desktop)  
**Headline:** H1 with gradient text (blue to blue-variant)  
**Subheading:** Body Large, text-secondary color  
**CTAs:** Two primary buttons side-by-side (gap-4), "Optimize Resume" (filled primary), "Start Mock Interview" (outline primary with backdrop-blur)  
**Supporting Element:** Trust indicators below CTAs (e.g., "Trusted by 50,000+ job seekers" with checkmark icon)

### Cards
**Standard Card:** Rounded-lg (12px), surface background, border (1px, surface-variant), p-6, shadow-sm with hover:shadow-md transition  
**Metric Card:** Includes large number (H2), label (caption), colored accent bar on left (4px wide)  
**Resume Card:** Thumbnail preview (aspect-ratio 8.5/11), title, last edited date, ATS score badge (top-right corner)

### Forms & Inputs
**Text Inputs:** Rounded-lg, border (2px, surface-variant), focus:border-primary, px-4 py-3, transition-all  
**Labels:** Body Small, font-weight 600, mb-2, text-primary  
**Dropdowns:** Same styling as inputs, chevron icon right-aligned  
**File Upload:** Dashed border (2px), rounded-lg, p-8, text-center with upload icon, drag-and-drop visual feedback (border-primary on hover)

### Buttons
**Primary (Filled):** bg-primary, text-white, px-6 py-3, rounded-lg, font-weight 600, shadow-sm, hover:shadow-md  
**Secondary (Outline):** border-2 border-primary, text-primary, bg-transparent, same padding/rounding  
**Ghost:** text-primary, hover:bg-surface-variant, same padding/rounding  
**Icon Buttons:** Square (40px), rounded-lg, hover:bg-surface-variant

### ATS Score Meter
**Visual:** Horizontal progress bar with gradient fill (red → amber → green based on score), rounded-full, height 12px  
**Label:** Score percentage in H3, positioned above bar  
**Context:** Descriptive text below (e.g., "Excellent - Ready to submit")

### Resume Editor Split View
**Left Panel (Editor):** Tabbed interface (Experience, Projects, Skills), each with textarea inputs, AI Assist floating button (bottom-right, primary, with sparkle icon)  
**Right Panel (Preview):** PDF-style preview with fixed aspect ratio, scrollable, subtle shadow, white background even in dark mode

### Interview Session Interface
**Layout:** Full viewport height  
**Top Bar:** Question counter, timer, pause/end controls (ghost buttons)  
**Main Area:** 2-column grid (lg+) - Left: AI avatar/visual (40%), Right: User camera preview (40%) with question text overlay  
**Bottom Controls:** Large "Next Question" button (primary, full-width on mobile, centered on desktop)

### Interview Report Dashboard
**Metrics Section:** 3-column grid of metric cards (Confidence, Grammar, Relevance) each with circular progress indicator  
**Charts:** Bar charts for question-by-question performance, line chart for time-based metrics  
**Color Coding:** Use success/warning/error colors consistently

### Toast Notifications
**Position:** Top-right, stacked  
**Design:** Surface background, rounded-lg, shadow-lg, p-4, icon left (16px), message center, close button right  
**Types:** Success (green accent), Warning (amber accent), Error (red accent), Info (blue accent)

---

## Images

**Hero Section:** No large hero image - focus on clean typography and CTAs with optional subtle gradient background  
**Interview Avatar Placeholder:** 400x400px abstract geometric illustration representing AI (blue/purple tones), circular crop  
**Empty States:** Simple line illustrations (400x300px) for "No resumes yet", "No interviews completed" - minimalist style, primary blue color  
**Resume Template Thumbnails:** 200x260px previews of each template design showing layout structure

---

## Animations

**Minimal Approach - Use Sparingly:**
- **Page Transitions:** Simple fade (200ms)
- **ATS Score Bar:** Animated fill on load (800ms ease-out)
- **Card Hover:** Subtle lift with shadow (150ms)
- **Button States:** Scale (0.98) on active (100ms)
- **Loading States:** Skeleton shimmer for content placeholders

**Avoid:** Elaborate scroll animations, parallax effects, or distracting motion

---

## Accessibility & Responsive Design

- Maintain WCAG AA contrast ratios (4.5:1 for text, 3:1 for UI components)
- All interactive elements minimum 44x44px touch targets
- Keyboard navigation with visible focus rings (2px primary color, 4px offset)
- ARIA labels for icon-only buttons
- Mobile breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Stack all multi-column layouts to single column below md breakpoint
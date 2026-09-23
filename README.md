# 🚀 100-Day Life Tracker

A modern, responsive, privacy-focused habit and personal productivity dashboard built for consistency, transformation, and daily momentum across desktop, tablet, and mobile devices.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FVikesh5086%2Fpersonal-tracker)

---

## 🌟 Key Highlights & Features

- **🛡️ 100% Offline-First Architecture**: Powered by browser IndexedDB (Dexie). All notes, habits, counters, and photos stay fast, private, and accessible even without internet.
- **☁️ Multi-Device Real-Time Cloud Sync (Firebase & Google)**: Sign in with Google to sync your progress automatically between your mobile phone and PC in real time.
- **🔥 10 Dynamic Habit Modules**:
  1. **DSA & Problem Solving**: Difficulty pills (Easy/Med/Hard), problem URLs, takeaway notes.
  2. **Workout & Fitness**: Split selection (Push, Pull, Legs, Cardio, etc.), duration timer, calories burned, exercise list.
  3. **Clean Eating & Diet**: Calorie tracking, macro targets (Protein, Carbs, Fats), clean meal toggles.
  4. **AI / ML / Dev Focus**: Project topics, papers read, architecture notes, reference links.
  5. **Learned Something New Today**: Dedicated habit card with category tagging, key takeaways, and web links.
  6. **Water Intake**: Interactive fluid animation with quick `+250ml` hydration logging.
  7. **Sleep Hygiene**: Bedtime & wake time calculator with sleep quality rating.
  8. **Daily Selfie / Body Photo**: Split-screen before/after slider with side-by-side comparison mode.
  9. **Mood & Daily Journal**: Emoji mood selector, wins, blockers, reflections, and tomorrow's focus.
  10. **Top 3 Daily Priorities**: Checkbox completion tracking with priority ordering.
- **🎙️ Hero Motivational Banner**: Large typography quote hero with Web Speech API text-to-speech voice read-aloud, quote categories, copy to clipboard, and instant shuffle.
- **🎵 Tactile Audio Feedback**: Zero-dependency Web Audio API synthesizer for satisfying checkmark dings, water bloops, button clicks, and level-up fanfare chords.
- **📊 Analytics & Visualizations**:
  - GitHub-style 100-Day Commit Heatmap.
  - Mini 28-day individual habit streak matrices.
  - Interactive SVG trend charts for Water, Sleep, Workout Split, and DSA Problem volume.
- **🏆 Gamification System**:
  - XP points, dynamic streak counting, and 10 progressive titles (from *Novice Spark* to *Legendary Titan*).
  - 16 unlockable achievement badges with progress tracking.
- **⏱️ Productivity Suite**:
  - Integrated Pomodoro focus timer with category links (DSA, AI/ML, Reading, Workout).
  - Time-block schedule planner.
  - Sub-goals and milestone roadmaps.
  - Sunday weekly retrospectives.
- **💾 Full Data Ownership**: Instant JSON complete backup/restore (with photos) and CSV spreadsheet export for Excel / Google Sheets.

---

## 🚀 1-Click Deployment to Vercel (Real-Time Auto Updates)

Whenever you push changes to your GitHub repository `Vikesh5086/personal-tracker`, Vercel will automatically build and deploy the update live to your custom web URL.

1. Go to [vercel.com](https://vercel.com) and click **Add New > Project**.
2. Connect your GitHub account and select **`Vikesh5086/personal-tracker`**.
3. (Optional) In the **Environment Variables** section, add your Firebase keys (see below).
4. Click **Deploy**. Your site is now live with a free HTTPS URL!

---

## ⚡ Multi-Device Cloud Sync Setup (Firebase)

To keep your mobile phone and laptop automatically in sync:

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a free project (e.g. `personal-tracker`).
2. **Enable Authentication**:
   - Go to **Build > Authentication > Sign-in method**.
   - Enable **Google** provider and save.
3. **Enable Firestore Database**:
   - Go to **Build > Firestore Database > Create Database**.
   - Choose **Start in test mode** (or configure authenticated user rules: `allow read, write: if request.auth != null;`).
4. **Get Project Credentials**:
   - Go to **Project Settings (⚙️) > General**.
   - Scroll down to *Your apps* and click the **Web (</>)** icon to register your app.
   - Copy the `firebaseConfig` keys.
5. **Connect to Your App**:
   - Option A: Open **Settings** inside your deployed app, click **Firebase API Credentials & Project Setup**, and paste the keys directly into the app.
   - Option B: Add these environment variables in your Vercel Project Settings or local `.env`:
     ```env
     VITE_FIREBASE_API_KEY=AIzaSy...
     VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
     VITE_FIREBASE_PROJECT_ID=your-project-id
     VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
     VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
     VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef
     ```

Now simply click **Sign in with Google** from both your mobile phone browser and your PC! Your data will seamlessly sync between both devices!

---

## 💻 Local Development

```bash
# Clone the repository
git clone https://github.com/Vikesh5086/personal-tracker.git
cd personal-tracker

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 🛡️ Privacy & Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Local Storage**: IndexedDB via Dexie.js
- **Cloud Backend**: Google Firebase Authentication & Cloud Firestore
- **Icons & Visuals**: Lucide Icons, Canvas-Confetti, SVG Charts
- **Audio & Voice**: Web Audio API Sound Synthesizer, Web Speech API TTS


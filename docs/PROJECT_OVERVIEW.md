# 🧠 MemoryLens - Project Overview

## 📋 Quick Reference

**Project:** MemoryLens - Privacy-First AI Memory Assistant  
**Hackathon:** Midnight Network (May 2026)  
**Track:** AI Track  
**Team Size:** 3 developers  
**Timeline:** 48 hours  
**Status:** In Development

---

## 🎯 Elevator Pitch

**AI memory assistant that processes sensitive patient data without seeing it. Real-time face recognition + zero-knowledge storage = HIPAA-compliant dementia care.**

*(160 characters - fits DevPost requirement)*

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     MemoryLens Frontend                      │
│                    (React + TypeScript)                      │
├─────────────────────────────────────────────────────────────┤
│  Camera View  │  Assistant  │  Caregiver Dashboard  │ Login │
└────────┬──────────────────────────────────┬─────────────────┘
         │                                   │
         ├───────────────┬───────────────────┤
         │               │                   │
    ┌────▼────┐    ┌────▼────┐       ┌─────▼──────┐
    │ AI/ML   │    │ Storage │       │  Midnight  │
    │ Layer   │    │ Layer   │       │ Blockchain │
    └─────────┘    └─────────┘       └────────────┘
         │               │                   │
    ┌────▼────┐    ┌────▼────┐       ┌─────▼──────┐
    │TensorFlow│   │Supabase │       │  Compact   │
    │Face-API │   │(Fast)   │       │ Contract   │
    │COCO-SSD │   └─────────┘       │(Private)   │
    │Gemini AI│                     └────────────┘
    └─────────┘
```

---

## 🔑 Key Features

### Core Functionality
1. **Real-Time Memory Assistance**
   - Continuous camera monitoring
   - Face recognition (TensorFlow.js)
   - Object detection (COCO-SSD)
   - Voice capture & transcription
   - Context linking (faces + voices + objects)

2. **Privacy-Preserving Storage**
   - Dual storage: Supabase (fast) vs Midnight (private)
   - Zero-knowledge proofs for data integrity
   - Selective disclosure for caregivers
   - Immutable audit trail

3. **Caregiver Dashboard**
   - Add/manage patient memories
   - Authorize caregivers
   - View audit logs
   - Privacy settings

---

## 🎨 User Flows

### Flow 1: Patient Using Camera
```
1. Patient opens app → Camera activates
2. Person enters room → Face detected
3. TensorFlow.js extracts face descriptor
4. App shows: "This is Shakiran, you talked about family"
5. Patient starts conversation → Voice captured
6. Speech-to-text extracts: "Hi Shakiran, how are you?"
7. Context saved: [Face + Voice + Timestamp]
```

### Flow 2: Caregiver Adding Memory
```
1. Caregiver logs in → Dashboard
2. Clicks "Add Person"
3. Uploads photo + enters name/relationship
4. Toggles: "Store on Midnight" (private)
5. Clicks Save → ZK proof generated (2-5s)
6. Memory encrypted & stored on blockchain
7. Success: Transaction hash displayed
```

### Flow 3: Selective Disclosure
```
1. Patient authorizes doctor
2. Grants access: "Medication reminders only"
3. Doctor logs in → Sees medication data ✅
4. Doctor CANNOT see: Personal conversations ❌
5. Access logged on blockchain (audit trail)
```

---

## 🛠️ Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- TailwindCSS
- Zustand (state)
- React Router

### AI/ML
- TensorFlow.js (face recognition)
- Face-API.js (descriptors)
- COCO-SSD (object detection)
- Google Gemini (AI assistance)

### Backend
- Supabase (fast storage)
- Midnight Blockchain (private storage)
- Compact (smart contracts)
- Midnight.js SDK

### Privacy
- Zero-Knowledge Proofs
- Selective Disclosure
- End-to-End Encryption
- On-Device Processing

---

## 📁 File Structure

```
MemoryLens/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   ├── PrivacyToggle.tsx       [Person 1]
│   │   ├── WalletConnect.tsx       [Person 1]
│   │   └── MidnightLoader.tsx      [Person 1]
│   ├── pages/
│   │   ├── CameraView.tsx
│   │   ├── AssistantMode.tsx
│   │   ├── CaregiverDashboard.tsx  [Person 1]
│   │   ├── PrivacyDashboard.tsx    [Person 1]
│   │   ├── ComparisonDemo.tsx      [Person 1]
│   │   └── Login.tsx
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── storage.ts              [Person 3]
│   │   └── utils.ts
│   ├── midnight/
│   │   ├── contracts/
│   │   │   ├── PatientMemory.compact [Person 2]
│   │   │   └── PatientMemory.abi.json [Person 2]
│   │   ├── lib/
│   │   │   ├── provider.ts         [Person 3]
│   │   │   ├── wallet.ts           [Person 3]
│   │   │   ├── contract.ts         [Person 3]
│   │   │   └── crypto.ts           [Person 3]
│   │   └── types/
│   │       └── contract.ts         [Person 2]
│   ├── store/
│   │   └── useStore.ts             [Person 1]
│   └── types/
│       └── index.ts
├── .env.local
├── package.json
├── README.md
├── TEAM_ROLES.md
├── QUICKSTART_FRONTEND.md
├── QUICKSTART_SMART_CONTRACT.md
├── QUICKSTART_BACKEND.md
└── PROJECT_OVERVIEW.md (this file)
```

---

## 🚀 Development Timeline

### Day 1 (0-24 hours)

**Morning (0-6 hours)**
- ✅ Person 2: Write Compact contract
- ✅ Person 3: Setup Midnight SDK
- ✅ Person 1: Create UI mockups

**Afternoon (6-12 hours)**
- ✅ Person 2: Compile & deploy contract
- ✅ Person 3: Wallet integration
- ✅ Person 1: Privacy toggle component

**Evening (12-18 hours)**
- ✅ Person 2: Share contract address
- ✅ Person 3: Contract interaction layer
- ✅ Person 1: Wallet connect UI

**Night (18-24 hours)**
- ✅ Person 2: Testing
- ✅ Person 3: Storage abstraction
- ✅ Person 1: Dashboard updates

### Day 2 (24-48 hours)

**Morning (24-30 hours)**
- ✅ Person 3: Complete integration
- ✅ Person 1: Wire up UI to backend
- ✅ Person 2: Final contract testing

**Afternoon (30-36 hours)**
- ✅ All: Integration testing
- ✅ All: Bug fixes
- ✅ All: Demo preparation

**Evening (36-42 hours)**
- ✅ All: Record demo video
- ✅ All: Write DevPost submission
- ✅ All: Prepare pitch deck

**Final Push (42-48 hours)**
- ✅ All: Polish & final testing
- ✅ All: Submit to hackathon
- ✅ All: Celebrate! 🎉

---

## 📊 Success Metrics

### Minimum Viable Demo (Must Have)
- [x] User can connect 1AM wallet
- [x] User can store one memory on Midnight
- [x] User can retrieve stored memory
- [x] UI shows comparison: Supabase vs Midnight
- [x] Demo video recorded

### Stretch Goals (Nice to Have)
- [ ] Selective disclosure working
- [ ] Audit trail visible in UI
- [ ] Multiple memory types supported
- [ ] Performance optimizations
- [ ] Comprehensive error handling

### Judging Criteria
- **Technology (25%)** - Midnight blockchain + ZK proofs
- **Innovation (25%)** - Privacy-preserving AI for healthcare
- **Completion (20%)** - Working demo with dual storage
- **Real-Life Application (20%)** - 50M+ dementia patients
- **Developer Experience (10%)** - Clean integration, docs

---

## 🎬 Demo Script

### Opening (30 seconds)
"Meet Sarah, a dementia patient who struggles to remember faces and conversations. Current memory apps expose her sensitive medical data to centralized servers. We built MemoryLens to change that."

### Problem (30 seconds)
"Dementia patients need constant memory assistance, but existing solutions store biometric data, voice recordings, and location history in plaintext. This violates patient privacy and HIPAA compliance."

### Solution (60 seconds)
"MemoryLens uses Midnight blockchain to store encrypted patient memories with zero-knowledge proofs. Watch as Sarah's camera recognizes her daughter, stores the interaction privately on-chain, and later reminds her: 'This is Emma, you talked about her graduation.'"

[Show live demo]

### Privacy Features (45 seconds)
"Sarah's doctor needs medication reminders, but not personal conversations. With selective disclosure, Sarah grants access to medication data only. The doctor sees 'Take pills at 8am' but cannot access family conversations. Every access is logged on-chain for audit."

[Show privacy dashboard]

### Impact (15 seconds)
"50 million dementia patients worldwide deserve privacy. MemoryLens proves AI can help without compromising dignity."

**Total: 3 minutes**

---

## 📝 DevPost Submission Checklist

- [ ] Project title: "MemoryLens"
- [ ] Tagline (160 chars): "AI memory assistant that processes sensitive patient data without seeing it..."
- [ ] Description (full pitch)
- [ ] Demo video (3 min)
- [ ] GitHub repo link
- [ ] Live demo link (if deployed)
- [ ] Technologies used
- [ ] Challenges faced
- [ ] Accomplishments
- [ ] What we learned
- [ ] What's next
- [ ] Team members
- [ ] Screenshots (5-10)

---

## 🔗 Important Links

**Documentation:**
- [Midnight Docs](https://docs.midnight.network)
- [Compact Reference](https://docs.midnight.network/compact/reference/compact-reference)
- [Midnight.js SDK](https://docs.midnight.network/guides/compact-javascript-runtime)

**Resources:**
- Team Roles: `TEAM_ROLES.md`
- Frontend Guide: `QUICKSTART_FRONTEND.md`
- Contract Guide: `QUICKSTART_SMART_CONTRACT.md`
- Backend Guide: `QUICKSTART_BACKEND.md`
- Midnight Skills: `.kiro/skills/Midnight-skills/`

**Hackathon:**
- [Midnight Hackathon](https://midnight.network/hackathon)
- [AI Track Details](https://events.mlh.io/events/14061-midnight-hackathon-may-2026)

---

## 🤝 Team Communication

### Daily Standups
- **9am:** What did you do? What will you do? Any blockers?
- **3pm:** Progress check, integration sync
- **9pm:** End of day review, plan tomorrow

### Communication Channels
- **Urgent:** Team chat with `@all`
- **Blockers:** Post immediately with `@role`
- **Questions:** Check docs first, then ask
- **Code Reviews:** Required before merging

### Shared Resources
- Contract address: Person 2 → Person 3
- Type definitions: Person 2 → Person 3 → Person 1
- API methods: Person 3 → Person 1
- UI mockups: Person 1 → All

---

## 🎯 Key Differentiators

**Why MemoryLens Wins:**
1. **Real Problem** - 50M+ dementia patients need this
2. **Privacy-First** - Only solution using ZK proofs
3. **AI Track Fit** - AI processes data without seeing it
4. **Complete Demo** - Working end-to-end integration
5. **Impact** - HIPAA compliance + patient dignity
6. **Technical Excellence** - Clean code, good docs

---

## 📞 Emergency Contacts

**Stuck on Midnight?**
- Check `.kiro/skills/Midnight-skills/`
- Review example projects
- Ask in team chat

**Technical Issues?**
- Frontend: Person 1
- Contract: Person 2
- Integration: Person 3

**General Questions?**
- Check this document first
- Review TEAM_ROLES.md
- Ask in team chat

---

## 🏆 Final Checklist

### Before Submission
- [ ] All code committed to GitHub
- [ ] Demo video recorded & uploaded
- [ ] DevPost submission complete
- [ ] README updated with demo links
- [ ] Screenshots added
- [ ] Team members credited
- [ ] License added
- [ ] Documentation complete

### After Submission
- [ ] Celebrate! 🎉
- [ ] Share on social media
- [ ] Thank team members
- [ ] Plan next steps
- [ ] Rest & recover

---

**Last Updated:** May 16, 2026  
**Version:** 1.0  
**Status:** Ready to Build! 🚀

---

<div align="center">

**Let's build something amazing! 💜**

*"Privacy is not about hiding. It's about dignity."*

</div>

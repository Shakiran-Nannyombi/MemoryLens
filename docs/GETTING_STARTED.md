# 🚀 Getting Started - MemoryLens Team

## Welcome to the Team! 👋

You're about to build **MemoryLens** - a privacy-first AI memory assistant for dementia patients using Midnight blockchain. This guide will get you started in 5 minutes.

---

## 📚 Essential Documents

**Read these in order:**

1. **[PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)** - Big picture (5 min read)
2. **[TEAM_ROLES.md](TEAM_ROLES.md)** - Detailed task breakdown (10 min read)
3. **Your role's quick start guide:**
   - 🎨 Frontend: [QUICKSTART_FRONTEND.md](QUICKSTART_FRONTEND.md)
   - ⚙️ Smart Contract: [QUICKSTART_SMART_CONTRACT.md](QUICKSTART_SMART_CONTRACT.md)
   - 🔌 Backend: [QUICKSTART_BACKEND.md](QUICKSTART_BACKEND.md)

---

## ⚡ Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Environment File
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```bash
# Existing (already configured)
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
VITE_GEMINI_API_KEY=your_key

# New - Midnight (Person 2 will provide contract address)
VITE_MIDNIGHT_NETWORK=testnet
VITE_MIDNIGHT_CONTRACT_ADDRESS=<wait-for-person-2>
VITE_MIDNIGHT_PROOF_SERVER=https://proof-server.testnet.midnight.network
```

### 3. Create Your Branch
```bash
git checkout -b <your-role>/<your-name>
# Examples:
# git checkout -b frontend/kiran
# git checkout -b contract/alice
# git checkout -b backend/bob
```

### 4. Start Development
```bash
npm run dev
```

Open: http://localhost:3000

---

## 👥 Team Roles

### 🎨 Person 1: Frontend Developer
**You:** Kiran  
**Focus:** React UI for Midnight integration  
**Start with:** `QUICKSTART_FRONTEND.md`

**First Tasks:**
1. Add privacy toggle component
2. Create wallet connect UI
3. Update caregiver dashboard

### ⚙️ Person 2: Smart Contract Developer
**Focus:** Compact smart contract  
**Start with:** `QUICKSTART_SMART_CONTRACT.md`

**First Tasks:**
1. Install Compact CLI
2. Write PatientMemory.compact
3. Deploy to testnet
4. **Share contract address with team!**

### 🔌 Person 3: Backend/Integration Developer
**Focus:** Connect frontend to blockchain  
**Start with:** `QUICKSTART_BACKEND.md`

**First Tasks:**
1. Setup Midnight SDK
2. Wallet integration
3. Contract interaction layer
4. **Share API methods with Person 1!**

---

## 🔄 Workflow

### Daily Routine
```
1. Pull latest changes: git pull origin main
2. Work on your tasks
3. Commit frequently: git commit -m "feat: description"
4. Push to your branch: git push origin <your-branch>
5. Create PR when ready
```

### Communication
- **Standups:** 9am, 3pm, 9pm
- **Blockers:** Post immediately with `@role`
- **Questions:** Check docs first, then ask

### Integration Points
```
Person 2 → Person 3: Contract address (ASAP!)
Person 3 → Person 1: API methods (early!)
Person 1 → All: UI mockups (for alignment)
```

---

## 📋 Today's Goals

### Day 1 Morning (0-6 hours)
- [ ] **Person 2:** Write Compact contract
- [ ] **Person 3:** Setup Midnight SDK
- [ ] **Person 1:** Create UI mockups

### Day 1 Afternoon (6-12 hours)
- [ ] **Person 2:** Deploy contract, share address
- [ ] **Person 3:** Wallet integration working
- [ ] **Person 1:** Privacy toggle component

### Day 1 Evening (12-18 hours)
- [ ] **Person 3:** Contract interaction layer
- [ ] **Person 1:** Wallet connect UI
- [ ] **Person 2:** Testing

---

## 🎯 Success Criteria

**Minimum Viable Demo:**
- ✅ Connect 1AM wallet
- ✅ Store one memory on Midnight
- ✅ Retrieve stored memory
- ✅ Show comparison: Supabase vs Midnight
- ✅ Record demo video

---

## 🆘 Need Help?

### Technical Issues
- **Midnight questions:** Check `.kiro/skills/Midnight-skills/`
- **Frontend:** Ask Person 1
- **Contract:** Ask Person 2
- **Backend:** Ask Person 3

### Documentation
- [Midnight Docs](https://docs.midnight.network)
- [Compact Reference](https://docs.midnight.network/compact/reference/compact-reference)
- [Midnight.js SDK](https://docs.midnight.network/guides/compact-javascript-runtime)

### Common Issues
- **Wallet not connecting:** Install 1AM extension
- **Contract deployment fails:** Check testnet connection
- **Build errors:** Run `npm install` again

---

## 🎬 Demo Video Script

**When ready to record (Day 2):**

1. **Opening (30s):** Introduce problem
2. **Demo (60s):** Show live app
3. **Privacy (45s):** Show selective disclosure
4. **Impact (15s):** Closing statement

**Total: 3 minutes**

---

## ✅ Pre-Submission Checklist

- [ ] All code committed
- [ ] Demo video recorded
- [ ] DevPost submission complete
- [ ] README updated
- [ ] Screenshots added
- [ ] Team members credited

---

## 🚀 Let's Build!

**You have 48 hours to build something amazing.**

**Remember:**
- Focus on MVP first
- Communicate early and often
- Ask for help when stuck
- Have fun! 🎉

---

## 📞 Quick Links

- **Project Overview:** [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md)
- **Team Roles:** [TEAM_ROLES.md](TEAM_ROLES.md)
- **Your Quick Start:** See role-specific guide above
- **Midnight Skills:** `.kiro/skills/Midnight-skills/`

---

<div align="center">

**Good luck, team! Let's win this! 🏆**

*Built with ❤️ for dementia patients and their families*

</div>

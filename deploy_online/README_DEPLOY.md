# 🌐 How to Share Your Project Online (Live Link for Anyone)

You have two easy ways to get a link that anyone in the world can open on their phone, tablet, or laptop:

---

### Option 1: 10-Second 24/7 Free Hosting via Netlify Drop (Recommended)
This gives you a permanent, free URL that works **24 hours a day, 7 days a week, even when your laptop is turned off**!

1. Open your browser and go to:
   👉 **[app.netlify.com/drop](https://app.netlify.com/drop)**
2. Drag this entire **`deploy_online`** folder from your computer and drop it onto the Netlify page.
3. Within 5 seconds, Netlify will generate your live public link:
   `https://sonarx-debrisguard-xxx.netlify.app`
4. *(Optional)* Click **Site configuration > Change site name** to pick a custom link like `https://sonarx-debrisguard.netlify.app`!
5. **Share that link with your evaluators, professors, and team!**

---

### Option 2: Live Public Tunnel from VS Code (`share_live.py`)
If you are running the backend server on your laptop and want an instant live public tunnel:

1. In your VS Code terminal, run:
   ```bash
   python3 share_live.py
   ```
2. It automatically starts your local server and connects a secure reverse tunnel.
3. It prints a public HTTPS link:
   ```
   👉 SHARE THIS LINK WITH ANYONE:
      https://sonarx-debrisguard-xxx.lhr.life
   ```
4. Anyone clicking that link will see your live project immediately.

---

### Option 3: Free GitHub Pages Hosting
1. Create a repository on GitHub (e.g., `sonarx-debrisguard`).
2. Push this folder to your repository.
3. Go to **Settings > Pages > Branch: main / root > Save**.
4. Your website is live at:
   `https://<your-username>.github.io/sonarx-debrisguard`

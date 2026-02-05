Motivation
Make the front and admin UIs more dynamic and responsive using animations and an improved layout for mobile and desktop.
Protect the admin editor so it cannot be viewed unless the signer is the configured Google admin account.
Provide an easy "forgot password" flow that delegates reset emails to Gmail via Firebase, and centralize the portfolio data API.
Description
Integrated Lottie animations into the front hero and admin auth card and updated responsive styles in styles.css to support the new layouts.
Added firebase-auth.js which exposes Google sign-in, listenForAuthChanges, sendResetLink, logout, and an isAuthorizedAdmin check that compares the signed-in email to ADMIN_EMAIL (requires filling FIREBASE_CONFIG and ADMIN_EMAIL).
Reworked admin flow in admin.html/admin.js to hide the editor until isAuthorizedAdmin(user) is true and wired a forgot-password form to sendResetLink.
Centralized local portfolio storage in database.js with getPortfolioData, savePortfolioData, and resetPortfolioData, and migrated the front panel to ES modules with script.js that renders data from the DB.
Testing
Static checks passed with node --check database.js && node --check script.js && node --check admin.js && node --check firebase-auth.js (success).
Served the site with python3 -m http.server 4173 --bind 0.0.0.0 and verified pages responded (HEAD requests returned 200 OK).
Captured Playwright screenshots of the updated front panel and the admin Google-auth gate to validate visual/UX changes (artifacts produced).
Note: Firebase auth will not function until FIREBASE_CONFIG and ADMIN_EMAIL are configured in firebase-auth.js.

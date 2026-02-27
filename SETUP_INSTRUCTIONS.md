# Fix: Features Page Not Showing

If `git pull` didn't work, follow these steps **in order**:

## Step 1: Verify you're in the right place

Open Terminal and run:

```bash
cd /Users/arazmamet/Desktop/Arya_v2
pwd
```

You should see: `/Users/arazmamet/Desktop/Arya_v2`

## Step 2: Check your branch

```bash
git branch
```

You should see `* mainhirearya-core-architecture-06cc` (with the asterisk).

If you see `* main` instead, run:
```bash
git checkout mainhirearya-core-architecture-06cc
```

## Step 3: Fetch and pull again

```bash
git fetch origin
git pull origin mainhirearya-core-architecture-06cc
```

## Step 4: Verify the features folder exists

```bash
ls app/
```

You should see a `features` folder in the list. If you see it, run:

```bash
npm run dev
```

Then open http://localhost:3000/features in your browser.

---

## If the features folder still doesn't exist

The pull may have failed. Create it manually:

1. In VS Code/Cursor, right-click the `app` folder → **New Folder** → name it `features`
2. Right-click the `features` folder → **New File** → name it `page.tsx`
3. Copy the entire contents from `app/features/page.tsx` in this project (or from GitHub)

Then restart: stop the dev server (Ctrl+C), run `npm run dev` again.

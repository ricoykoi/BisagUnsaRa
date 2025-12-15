# Git Configuration Guide

## Fixing LF/CRLF Warnings

The warnings you're seeing are about line endings (LF vs CRLF). These are just warnings and won't prevent deployment, but they can be annoying. Here's how to fix them:

### Option 1: Configure Git to handle line endings automatically (Recommended)

Run these commands in your terminal:

```bash
# Configure Git to automatically convert line endings
git config core.autocrlf true

# For Windows, this will:
# - Convert LF to CRLF when checking out files
# - Convert CRLF to LF when committing files
```

### Option 2: Normalize line endings in your repository

```bash
# Remove all files from Git index
git rm --cached -r .

# Re-add all files (this will normalize line endings)
git add .

# Commit the changes
git commit -m "Normalize line endings"
```

### Option 3: Use .gitattributes file (Best for team projects)

Create a `.gitattributes` file in your project root:

```
# Auto detect text files and perform LF normalization
* text=auto

# Explicitly declare text files you want to always be normalized
*.js text eol=lf
*.jsx text eol=lf
*.json text eol=lf
*.md text eol=lf
*.yml text eol=lf
*.yaml text eol=lf

# Denote all files that are truly binary and should not be modified
*.png binary
*.jpg binary
*.jpeg binary
*.gif binary
*.ico binary
*.pdf binary
```

Then run:
```bash
git add .gitattributes
git commit -m "Add .gitattributes for line ending normalization"
```

## Important: Don't Commit node_modules

Make sure `node_modules` is in your `.gitignore` file. If you've already committed it:

```bash
# Remove node_modules from Git tracking
git rm -r --cached node_modules
git commit -m "Remove node_modules from Git"
```

## For Vercel Deployment

Vercel will automatically:
1. Install dependencies from `package.json` (not from committed node_modules)
2. Build your project
3. Deploy the built files

Make sure your `.gitignore` includes:
- `node_modules/`
- `dist/` or `build/`
- `.env` files
- `.vercel/`


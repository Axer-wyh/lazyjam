#!/bin/bash
# LazyJam DB Setup Script
# Run this after creating Vercel Postgres database

set -e

echo "=== Step 1: Link Vercel project ==="
vercel link

echo ""
echo "=== Step 2: Create Postgres database ==="
vercel db create

echo ""
echo "=== Step 3: Pull env vars ==="
vercel env pull .env.local

echo ""
echo "=== Step 4: Generate Prisma Client ==="
npx prisma generate

echo ""
echo "=== Step 5: Push schema to database ==="
npx prisma db push

echo ""
echo "=== Step 6: Migrate data ==="
npx ts-node --esm scripts/migrate-data.ts

echo ""
echo "=== Done! ==="
echo "Now you can run 'vercel dev' to start the development server."
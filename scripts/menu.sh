#!/usr/bin/env bash

# Choose the execution type
echo "What would you like to do?"
COMMAND_TYPE=$(gum choose "🔥 Development Mode" "🏗️ Build Production Assets" "📝 Versioning & Commits")

# Handle Development Selections
if [ "$COMMAND_TYPE" = "🔥 Development Mode" ]; then
  echo "Choose which package to spin up:"
  TARGET=$(gum choose "All Apps (Parallel)" "Gemini Auto Temp" "PES-Files Fetch")

  case "$TARGET" in
  "All Apps (Parallel)") pnpm dev ;;
  "Gemini Auto Temp") pnpm dev:gemini ;;
  "PES-Files Fetch") pnpm dev:pes ;;
  esac

# Handle Build Selections
elif [ "$COMMAND_TYPE" = "🏗️ Build Production Assets" ]; then
  echo "Choose build target:"
  TARGET=$(gum choose "Build All & Aggregate Staging" "Build Gemini Only" "Build PES-Files Only")

  case "$TARGET" in
  "Build All & Aggregate Staging") pnpm build:all ;;
  "Build Gemini Only") pnpm build:gemini ;;
  "Build PES-Files Only") pnpm build:pes ;;
  esac

# Handle Versioning Selections
elif [ "$COMMAND_TYPE" = "📝 Versioning & Commits" ]; then
  echo "Choose version handler:"
  TARGET=$(gum choose "Interactive Commit (cz)" "Generate Changeset Token")

  case "$TARGET" in
  "Interactive Commit (cz)") pnpm commit ;;
  "Generate Changeset Token") pnpm change ;;
  esac
fi

#!/bin/bash
# Compiles latex_cv/template.tex → erick_cv.pdf
# Usage: ./build_cv.sh
#
# Dependency: texlive-fonts-extra (for ClearSans font)
#   sudo apt-get install texlive-fonts-extra

set -e

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
LATEX_DIR="$REPO_DIR/latex_cv"
OUT_PDF="$REPO_DIR/erick_cv.pdf"
LOG="$LATEX_DIR/template.log"

# ── Dependency check ───────────────────────────────────────
if ! command -v pdflatex >/dev/null 2>&1; then
  echo "ERROR: pdflatex not found. Install TeX Live:" >&2
  echo "  sudo apt-get install texlive-latex-base texlive-fonts-extra" >&2
  exit 1
fi

if ! kpsewhich ClearSans.sty >/dev/null 2>&1; then
  echo "ERROR: ClearSans font not found. Install it with:" >&2
  echo "  sudo apt-get install texlive-fonts-extra" >&2
  exit 1
fi

# ── Compile ────────────────────────────────────────────────
echo "==> Compiling LaTeX CV (pass 1/2)..."
cd "$LATEX_DIR"

# Show output on error, suppress on success
pdflatex -interaction=nonstopmode template.tex > "$LOG" 2>&1 || {
  echo "ERROR: Compilation failed. Last lines of log:" >&2
  grep -E "^!" "$LOG" | head -10 >&2
  echo "(Full log: $LOG)" >&2
  exit 1
}

echo "==> Compiling LaTeX CV (pass 2/2)..."
pdflatex -interaction=nonstopmode template.tex >> "$LOG" 2>&1 || {
  echo "ERROR: Second pass failed. See: $LOG" >&2
  exit 1
}

# ── Copy output ────────────────────────────────────────────
if [ -f "template.pdf" ]; then
  cp template.pdf "$OUT_PDF"
  echo "==> Done: $OUT_PDF"
else
  echo "ERROR: template.pdf not produced. See: $LOG" >&2
  exit 1
fi

# ── Cleanup ────────────────────────────────────────────────
rm -f template.aux template.log template.out template.toc template.pdf

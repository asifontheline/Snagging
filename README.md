# Pre-Handover Snagging Report App

A detailed static web app for apartment handover inspections with minute coverage across quality, safety, utilities, waterproofing, and documentation.

## Features

- Project, unit and handover metadata capture
- Expanded 9-category checklist covering structure, finishes, flooring, doors/windows, kitchen, bathrooms, electrical, plumbing, balcony/safety and compliance
- Per-item status selection plus defect comments for every entry
- Automatic category summaries and defect action list
- Handover punch list / follow-up status field
- Copy report to clipboard and reset form support

## Run locally

Open `index.html` in your browser.

## External checklist review script

A helper script is included for periodic review of global snagging checklist coverage. It fetches public snagging resources and extracts commonly referenced inspection topics.

- Script: `external_snagging_review.py`
- Python modules used: `ssl`, `urllib.request`, `html.parser`

Run the script with:

```bash
python3 external_snagging_review.py
```

## How to use

1. Enter apartment and inspection metadata.
2. Complete every checklist item with Pass / Fail / N/A.
3. Add item-level comments for defects, location details or remediation notes.
4. Enter additional observations and punch-list status.
5. Click **Generate Report** to produce a structured handover inspection document.
6. Use **Copy Report** to copy the report text.

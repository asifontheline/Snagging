const form = document.getElementById('snag-form');
const reportOutput = document.getElementById('reportOutput');
const generateButton = document.getElementById('generate');
const copyButton = document.getElementById('copyReport');
const resetButton = document.getElementById('resetForm');

function addSectionComments() {
  document.querySelectorAll('.checklist-section').forEach((section) => {
    const title = section.querySelector('h3')?.textContent?.trim();
    if (!title) return;
    const wrapper = document.createElement('div');
    wrapper.className = 'section-comment';
    wrapper.innerHTML = `
      <label>
        Additional notes for ${title}
        <textarea data-section-comment-for="${title}" placeholder="Add comments if dropdowns do not cover this section"></textarea>
      </label>
    `;
    section.appendChild(wrapper);
  });
}

document.addEventListener('DOMContentLoaded', addSectionComments);

function gatherChecklistItems() {
  return Array.from(form.querySelectorAll('select[data-key]')).map((select) => {
    const key = select.dataset.key;
    const group = select.dataset.group || 'General';
    const commentInput = form.querySelector(`[data-comment-for="${key}"]`);
    return {
      key,
      group,
      value: select.value,
      comment: commentInput?.value.trim() || '',
    };
  });
}

function buildReport() {
  const address = document.getElementById('address').value.trim() || 'Not specified';
  const unit = document.getElementById('unit').value.trim() || 'Not specified';
  const project = document.getElementById('project').value.trim() || 'Not specified';
  const inspectionType = document.getElementById('inspectionType').value;
  const area = document.getElementById('area').value.trim() || 'Not specified';
  const handoverDate = document.getElementById('handoverDate').value || 'Not specified';
  const inspector = document.getElementById('inspector').value.trim() || 'Not specified';
  const customer = document.getElementById('customer').value.trim() || 'Not specified';
  const customInstructions = document.getElementById('customInstructions').value.trim();
  const notes = document.getElementById('notes').value.trim();
  const handoverChecklist = document.getElementById('handoverChecklist').value.trim();

  const checklistItems = gatherChecklistItems();
  const failItems = checklistItems.filter((item) => item.value === 'Fail');
  const passItems = checklistItems.filter((item) => item.value === 'Pass');
  const naItems = checklistItems.filter((item) => item.value === 'N/A');

  const categories = checklistItems.reduce((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});

  const categorySummary = Object.entries(categories)
    .map(([group, items]) => {
      const pass = items.filter((item) => item.value === 'Pass').length;
      const fail = items.filter((item) => item.value === 'Fail').length;
      const na = items.filter((item) => item.value === 'N/A').length;
      return `- ${group}: ${pass} Pass, ${fail} Fail, ${na} N/A`;
    })
    .join('\n');

  const categoryDetails = Object.entries(categories)
    .map(([group, items]) => {
      const lines = items.map((item) => {
        const commentSegment = item.comment ? ` (${item.comment})` : '';
        const defectTag = item.value === 'Fail' ? ' [DEFECT]' : '';
        return `- ${item.key}: ${item.value}${commentSegment}${defectTag}`;
      });
      return `${group}:\n${lines.join('\n')}`;
    })
    .join('\n\n');

  const sectionComments = Array.from(form.querySelectorAll('textarea[data-section-comment-for]'))
    .map((textarea) => ({
      section: textarea.dataset.sectionCommentFor,
      comment: textarea.value.trim(),
    }))
    .filter((item) => item.comment);

  const sectionNotes = sectionComments.length
    ? `SECTION NOTES:\n${sectionComments.map((item) => `- ${item.section}: ${item.comment}`).join('\n')}\n\n`
    : '';

  const actionRequired = failItems.length
    ? `ACTION REQUIRED:\n${failItems
        .map((item) => `- ${item.key}: requires builder rectification and final verification${item.comment ? ` (${item.comment})` : ''}`)
        .join('\n')}`
    : '- No failed items recorded. Verify final handover acceptance once all sections are signed off.';

  return [
    'HANDOVER INSPECTION REPORT',
    '==============================',
    `Inspection type: ${inspectionType}`,
    `Project / Building: ${project}`,
    `Apartment: ${address}`,
    `Block / Unit: ${unit}`,
    `Area: ${area}`,
    `Handover Date: ${handoverDate}`,
    `Inspector: ${inspector}`,
    `Customer: ${customer}`,
    '',
    'INSPECTION SUMMARY',
    `- Total items: ${checklistItems.length}`,
    `- Pass: ${passItems.length}`,
    `- Fail: ${failItems.length}`,
    `- N/A: ${naItems.length}`,
    '',
    'CATEGORY SUMMARY',
    categorySummary,
    '',
    customInstructions
      ? `CUSTOM INSPECTION FOCUS:\n${customInstructions}\n`
      : 'INSPECTION FOCUS:\n- Verify quality, completeness and workmanship\n- Confirm electrical, plumbing and waterproofing functionality\n- Note all visible defects, alignments and finish gaps\n- Evaluate safety, documentation and handover compliance\n',
    'DETAILED CATEGORY FINDINGS',
    categoryDetails,
    '',
    sectionNotes,
    'ACTION REQUIRED',
    actionRequired,
    '',
    'OVERALL OBSERVATIONS',
    notes || 'No additional observations recorded.',
    '',
    'HANDOVER / PUNCH LIST STATUS',
    handoverChecklist || 'No follow-up status recorded.',
    '',
    'Report generated by the Pre-Handover Snagging App.',
  ].join('\n');
}

generateButton.addEventListener('click', () => {
  reportOutput.value = buildReport();
  reportOutput.scrollTop = 0;
});

copyButton.addEventListener('click', async () => {
  if (!reportOutput.value) {
    reportOutput.value = buildReport();
  }
  try {
    await navigator.clipboard.writeText(reportOutput.value);
    copyButton.textContent = 'Copied!';
    setTimeout(() => {
      copyButton.textContent = 'Copy Report';
    }, 1600);
  } catch (err) {
    alert('Copy failed. Please copy manually from the report box.');
  }
});

resetButton.addEventListener('click', () => {
  form.reset();
  reportOutput.value = '';
});

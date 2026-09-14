const fs = require('fs');
const path = require('path');

// 1. Ensure sample folders exist
const publicSamplesDir = path.join(__dirname, 'public', 'samples');
const rootSamplesDir = path.join(__dirname, '..', 'samples');
fs.mkdirSync(publicSamplesDir, { recursive: true });
fs.mkdirSync(rootSamplesDir, { recursive: true });

// 2. Sample Text DPR
const textDpr = `PROJECTSETU AI — DAILY SITE PROGRESS REPORT (DPR)
Corridor: NHAI Highway Package A (Km 30.000 to Km 72.000)
Date: 11 September 2026
Location: Chainage 34+500 to 35+200
Reported Activity: Earthwork and embankment formation executed
Executed Quantity: 700 meters completed
Machinery Mobilized: 1 Hydraulic Excavator CAT 320D, 4 Tippers, 1 Vibratory Roller (10 Ton)
Manpower: 24 personnel (1 Site Supervisor, 3 Equipment Operators, 20 Civil Laborers)
Weather Stoppage: Heavy localized monsoon rainfall (38mm/hr) recorded at 14:00 hrs
Stoppage Duration: 2.0 hours downtime due to subgrade soil moisture exceeding OMC by +4.2%
Remarks: Subgrade compaction temporarily suspended to prevent yielding. Embankment profile stable.
Submitted By: Rajesh Sharma (Senior Site Field Engineer)
`;

// 3. Sample CSV Site Log
const csvDpr = `Date,Chainage_Start,Chainage_End,Activity,Executed_Qty,Unit,Planned_Qty,Stoppage_Hours,Weather_Condition,Status
2026-09-11,34+500,35+200,Earth filling,700,meters,700,2.0,Heavy Rain (38mm),Completed
2026-09-11,44+100,44+150,Pier cap reinforcement,45,MT,45,0.0,Clear,Completed
2026-09-11,30+000,30+400,Roadway cut excavation,850,cum,900,0.5,Overcast,Completed
2026-09-10,32+000,32+600,Subgrade preparation,600,meters,600,0.0,Sunny,Completed
2026-09-10,30+000,31+000,Granular Sub-Base GSB,400,meters,650,3.0,Aggregate Shortage,Delayed
2026-09-09,35+000,35+800,Compaction & Proof Rolling,800,meters,800,0.0,Clear,Completed
2026-09-09,48+200,48+250,Box Culvert Construction,1,units,1,0.0,Clear,Completed
`;

// Write text and csv
fs.writeFileSync(path.join(publicSamplesDir, 'sample_dpr_report.txt'), textDpr, 'utf8');
fs.writeFileSync(path.join(rootSamplesDir, 'sample_dpr_report.txt'), textDpr, 'utf8');

fs.writeFileSync(path.join(publicSamplesDir, 'sample_site_log.csv'), csvDpr, 'utf8');
fs.writeFileSync(path.join(rootSamplesDir, 'sample_site_log.csv'), csvDpr, 'utf8');

// 4. Generate Valid PDF 1.4 File
function generateValidPdf(outputPath) {
  const content = [
    'BT',
    '/F1 16 Tf',
    '50 740 Td',
    '(PROJECTSETU AI - DAILY PROGRESS & INSPECTION REPORT) Tj',
    '/F1 9 Tf',
    '0 -20 Td',
    '(National Highways Authority of India - PIU Nagpur | Corridor Package A) Tj',
    '0 -16 Td',
    '(Date: 11 September 2026   |   Report Ref: DPR-NHAI-2026-0911   |   Shift: Day Shift A) Tj',
    '0 -20 Td',
    '(---------------------------------------------------------------------------------------------------------------------) Tj',
    '/F1 11 Tf',
    '0 -22 Td',
    '(1. EXECUTED SITE WORK DETAILS) Tj',
    '/F1 9 Tf',
    '0 -18 Td',
    '(- Chainage Stretch: Km 34+500 to Km 35+200 (Total Length: 700 meters)) Tj',
    '0 -15 Td',
    '(- Executed Activity: Earthwork Formation & Embankment Layer Compaction) Tj',
    '0 -15 Td',
    '(- Contractual WBS Code: WBS-1.1.2 [L6 Activity Item]) Tj',
    '0 -15 Td',
    '(- Physical Quantity Executed: 700 meters / 4,200 cum fill volume) Tj',
    '0 -15 Td',
    '(- Cumulative Planned: 65.0%   |   Cumulative Actual: 58.0%   |   Variance: -7.0%) Tj',
    '0 -20 Td',
    '(---------------------------------------------------------------------------------------------------------------------) Tj',
    '/F1 11 Tf',
    '0 -22 Td',
    '(2. INCLEMENT WEATHER & OPERATIONAL STOPPAGE AUDIT) Tj',
    '/F1 9 Tf',
    '0 -18 Td',
    '(- Site Precipitation: 38 mm/hr recorded at Site Camp AWS #2 at 14:00 hrs) Tj',
    '0 -15 Td',
    '(- Compaction Halt: 2.0 hours suspension due to subsoil saturation (OMC +4.2%)) Tj',
    '0 -15 Td',
    '(- Fleet Impact: CAT 320D Excavator and 4 Tippers idled during downpour) Tj',
    '0 -20 Td',
    '(---------------------------------------------------------------------------------------------------------------------) Tj',
    '/F1 11 Tf',
    '0 -22 Td',
    '(3. PROJECT AUTHORITY DIRECTIVE & MITIGATION) Tj',
    '/F1 9 Tf',
    '0 -18 Td',
    '(- Authority Approval: Reallocate 2 Excavators to dry rock-cut front at Ch 42+000) Tj',
    '0 -15 Td',
    '(- Extended Shift: 2.5 hour twilight dry-back rolling shift authorized) Tj',
    '0 -15 Td',
    '(- Expected Delay Recovery: 1.5 critical path days) Tj',
    '0 -35 Td',
    '(Signed: Rajesh Sharma, Sr. Site Engineer        Verified: Priya Nair, Project Authority Director) Tj',
    'ET'
  ].join('\n');

  const streamLen = Buffer.byteLength(content);

  let pdf = '%PDF-1.4\n';
  const offsets = [];

  function appendObj(str) {
    offsets.push(Buffer.byteLength(pdf));
    pdf += str + '\n';
  }

  appendObj('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj');
  appendObj('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj');
  appendObj('3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj');
  appendObj('4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj');
  appendObj('5 0 obj\n<< /Length ' + streamLen + ' >>\nstream\n' + content + '\nendstream\nendobj');

  const startxref = Buffer.byteLength(pdf);
  pdf += 'xref\n0 6\n0000000000 65535 f \n';
  for (let i = 0; i < offsets.length; i++) {
    pdf += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
  }
  pdf += 'trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n' + startxref + '\n%%EOF\n';

  fs.writeFileSync(outputPath, pdf, 'binary');
  console.log('Created valid PDF:', outputPath, 'Size:', fs.statSync(outputPath).size, 'bytes');
}

generateValidPdf(path.join(publicSamplesDir, 'sample_dpr_inspection.pdf'));
generateValidPdf(path.join(rootSamplesDir, 'sample_dpr_inspection.pdf'));

console.log('All sample files (TXT, CSV, PDF) successfully created in public/samples and root samples!');

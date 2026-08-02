/**
 * MIKKY MEGHA HOSPITAL - BILLING APP LOGIC (v2)
 * New format: QTY × Price/Unit = Amount
 * Two sections: (A) Hospital Charges, (B) Outside Charges
 * Per-section add/delete rows
 */

// Section A: Hospital Charges (default items)
const DEFAULT_HOSPITAL_CHARGES = [
  { name: "BED CHARGE" },
  { name: "OT CHARGE" },
  { name: "ICU CHARGE" },
  { name: "LIGATION" },
  { name: "GLUCOMETRE" },
  { name: "MONITORING" },
  { name: "OXYGEN" },
  { name: "GATHENAY CHARGE" },
  { name: "SERVICE CHARGE" },
  { name: "DRESSING" },
  { name: "REGISTRATION CHARGE" },
  { name: "LABOUR ROOM CHARGE" },
  { name: "BLOOD TRANSFUSION DONE" },
  { name: "DOCTOR VISIT" },
  { name: "CBO" },
  { name: "MEDICINE" },
  { name: "R.M.O" }
];

// Section B: Outside Charges (default items)
const DEFAULT_OUTSIDE_CHARGES = [
  { name: "SURGEON" },
  { name: "CHILD DOCTOR" },
  { name: "ANAESTHETIST" },
  { name: "ASSISTANT" }
];

function createItem(name) {
  return { name: name || "New Item", qty: "", priceUnit: "", amount: "" };
}

let hospitalCharges = [];
let outsideCharges = [];

/**
 * Reset all form fields & table
 */
function resetForm() {
  const fields = [
    "billDateTop", "patientName", "patientAge", "underDoctor",
    "noOfDays", "hospitalId", "caseType", "bedNo", "billDate",
    "discountInput", "advanceInput"
  ];
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });

  hospitalCharges = DEFAULT_HOSPITAL_CHARGES.map(p => createItem(p.name));
  outsideCharges = DEFAULT_OUTSIDE_CHARGES.map(p => createItem(p.name));

  renderAll();
}

/**
 * Add new row to Hospital Charges (Section A)
 */
function addHospitalRow() {
  hospitalCharges.push(createItem("New Item"));
  renderAll();
}

/**
 * Add new row to Outside Charges (Section B)
 */
function addOutsideRow() {
  outsideCharges.push(createItem("New Item"));
  renderAll();
}

/**
 * Delete row from Hospital Charges
 */
function deleteHospitalRow(index) {
  if (index >= 0 && index < hospitalCharges.length) {
    hospitalCharges.splice(index, 1);
    renderAll();
  }
}

/**
 * Delete row from Outside Charges
 */
function deleteOutsideRow(index) {
  if (index >= 0 && index < outsideCharges.length) {
    outsideCharges.splice(index, 1);
    renderAll();
  }
}

/**
 * Print invoice
 */
function printInvoice() {
  window.print();
}

/**
 * Toggle whether the hospital header and outer page border print or not.
 * When unchecked (default): header & outer border hidden (for pre-printed letterhead pad)
 * When checked: header & outer border print (for plain paper)
 */
function togglePrintHeader(checked) {
  const billHeader = document.querySelector('.bill-header');
  const billPaper = document.getElementById('billPaper');

  if (checked) {
    if (billHeader) billHeader.classList.remove('hide-header-print');
    if (billPaper) billPaper.classList.remove('hide-border-print');
  } else {
    if (billHeader) billHeader.classList.add('hide-header-print');
    if (billPaper) billPaper.classList.add('hide-border-print');
  }
}

// Expose to window
window.resetForm = resetForm;
window.addHospitalRow = addHospitalRow;
window.addOutsideRow = addOutsideRow;
window.deleteHospitalRow = deleteHospitalRow;
window.deleteOutsideRow = deleteOutsideRow;
window.printInvoice = printInvoice;
window.togglePrintHeader = togglePrintHeader;

/**
 * Render all table rows (both sections)
 */
function renderAll() {
  const tbody = document.getElementById("billTbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  let globalSerial = 1;

  // ---- Section A: Hospital Charges ----
  // Section header row
  const sectionAHeader = document.createElement("tr");
  sectionAHeader.className = "section-header-row";
  sectionAHeader.innerHTML = `
    <td colspan="5" class="section-header-cell">(A) HOSPITAL CHARGES :-</td>
    <td class="col-actions no-print section-header-cell">
      <button class="btn-icon-add" onclick="addHospitalRow()" title="Add row to Hospital Charges">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
    </td>
  `;
  tbody.appendChild(sectionAHeader);

  // Section A data rows
  hospitalCharges.forEach((item, index) => {
    const tr = document.createElement("tr");
    tr.className = (globalSerial % 2 === 0) ? "data-row row-even" : "data-row row-odd";

    tr.innerHTML = `
      <td class="col-sl">${globalSerial}</td>
      <td class="col-description">
        <input type="text" class="table-input input-name" data-section="hospital" data-index="${index}" value="${escapeHtml(item.name)}" placeholder="Item name">
      </td>
      <td class="col-qty">
        <input type="number" class="table-input text-right input-qty" data-section="hospital" data-index="${index}" value="${item.qty}" placeholder="" min="0" step="any">
      </td>
      <td class="col-price">
        <input type="number" class="table-input text-right input-price" data-section="hospital" data-index="${index}" value="${item.priceUnit}" placeholder="" min="0" step="any">
      </td>
      <td class="col-amount">
        <input type="number" class="table-input text-right input-amount bold-amount" data-section="hospital" data-index="${index}" value="${item.amount}" placeholder="" min="0" step="any">
      </td>
      <td class="col-actions no-print">
        <button class="btn-icon-danger btn-delete-row" onclick="deleteHospitalRow(${index})" title="Delete Row">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      </td>
    `;

    tbody.appendChild(tr);
    globalSerial++;
  });

  // ---- Section B: Outside Charges ----
  const sectionBHeader = document.createElement("tr");
  sectionBHeader.className = "section-header-row";
  sectionBHeader.innerHTML = `
    <td colspan="5" class="section-header-cell">(B) OUTSIDE CHARGES :-</td>
    <td class="col-actions no-print section-header-cell">
      <button class="btn-icon-add" onclick="addOutsideRow()" title="Add row to Outside Charges">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </button>
    </td>
  `;
  tbody.appendChild(sectionBHeader);

  // Section B data rows
  outsideCharges.forEach((item, index) => {
    const tr = document.createElement("tr");
    tr.className = (globalSerial % 2 === 0) ? "data-row row-even" : "data-row row-odd";

    tr.innerHTML = `
      <td class="col-sl">${globalSerial}</td>
      <td class="col-description">
        <input type="text" class="table-input input-name" data-section="outside" data-index="${index}" value="${escapeHtml(item.name)}" placeholder="Item name">
      </td>
      <td class="col-qty">
        <input type="number" class="table-input text-right input-qty" data-section="outside" data-index="${index}" value="${item.qty}" placeholder="" min="0" step="any">
      </td>
      <td class="col-price">
        <input type="number" class="table-input text-right input-price" data-section="outside" data-index="${index}" value="${item.priceUnit}" placeholder="" min="0" step="any">
      </td>
      <td class="col-amount">
        <input type="number" class="table-input text-right input-amount bold-amount" data-section="outside" data-index="${index}" value="${item.amount}" placeholder="" min="0" step="any">
      </td>
      <td class="col-actions no-print">
        <button class="btn-icon-danger btn-delete-row" onclick="deleteOutsideRow(${index})" title="Delete Row">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      </td>
    `;

    tbody.appendChild(tr);
    globalSerial++;
  });

  calculateTotals();
}

/**
 * Update row amount when qty or price changes
 */
function updateRowAmount(section, index, fromQtyPrice) {
  const data = section === "hospital" ? hospitalCharges : outsideCharges;
  const row = data[index];
  if (!row) return;

  if (fromQtyPrice) {
    const q = parseFloat(row.qty) || 0;
    const p = parseFloat(row.priceUnit) || 0;
    if (q > 0 && p > 0) {
      row.amount = (q * p).toString();
      // Update the amount input in DOM without re-rendering
      const tbody = document.getElementById("billTbody");
      if (tbody) {
        const amountInput = tbody.querySelector(`.input-amount[data-section="${section}"][data-index="${index}"]`);
        if (amountInput) amountInput.value = row.amount;
      }
    }
  }
  calculateTotals();
}

/**
 * Calculate Sub Total, Discount, Advance Payment, Net Payable
 */
function calculateTotals() {
  let subTotal = 0;

  hospitalCharges.forEach(item => {
    subTotal += parseFloat(item.amount) || 0;
  });

  outsideCharges.forEach(item => {
    subTotal += parseFloat(item.amount) || 0;
  });

  const discountEl = document.getElementById("discountInput");
  const advanceEl = document.getElementById("advanceInput");

  const discount = parseFloat(discountEl ? discountEl.value : 0) || 0;
  const advance = parseFloat(advanceEl ? advanceEl.value : 0) || 0;

  // Net Payable = Sub Total - Discount - Advance Payment
  const netPayable = Math.max(0, subTotal - discount - advance);

  const subTotalDisplay = document.getElementById("subTotalDisplay");
  const netPayableDisplay = document.getElementById("netPayableDisplay");
  const amountInWords = document.getElementById("amountInWords");

  if (subTotalDisplay) subTotalDisplay.textContent = subTotal > 0 ? subTotal : "0";
  if (netPayableDisplay) netPayableDisplay.textContent = netPayable > 0 ? netPayable : "0";
  if (amountInWords) amountInWords.textContent = convertNumberToWords(netPayable);
}

/**
 * Convert number to words in Indian currency format
 */
function convertNumberToWords(amount) {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return "Rupees Zero Only";
  }

  const num = Math.floor(Math.abs(amount));
  const paise = Math.round((Math.abs(amount) - num) * 100);

  if (num === 0 && paise === 0) {
    return "Rupees Zero Only";
  }

  const singleDigits = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const teenDigits = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tensDigits = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function numToWords(n) {
    let str = "";
    if (n > 99) {
      str += singleDigits[Math.floor(n / 100)] + " Hundred ";
      n %= 100;
    }
    if (n >= 10 && n <= 19) {
      str += teenDigits[n - 10] + " ";
    } else {
      if (n >= 20) {
        str += tensDigits[Math.floor(n / 10)] + " ";
        n %= 10;
      }
      if (n > 0) {
        str += singleDigits[n] + " ";
      }
    }
    return str;
  }

  let result = "";
  let n = num;

  const crore = Math.floor(n / 10000000);
  n %= 10000000;
  const lakh = Math.floor(n / 100000);
  n %= 100000;
  const thousand = Math.floor(n / 1000);
  n %= 1000;
  const remaining = n;

  if (crore > 0) result += numToWords(crore) + "Crore ";
  if (lakh > 0) result += numToWords(lakh) + "Lakh ";
  if (thousand > 0) result += numToWords(thousand) + "Thousand ";
  if (remaining > 0) result += numToWords(remaining);

  result = "Rupees " + result.trim();
  if (paise > 0) result += " and " + numToWords(paise).trim() + " Paise";

  return result + " Only";
}

/**
 * Escape HTML utility
 */
function escapeHtml(text) {
  if (!text) return "";
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Initialize application
 */
function initApp() {
  hospitalCharges = DEFAULT_HOSPITAL_CHARGES.map(p => createItem(p.name));
  outsideCharges = DEFAULT_OUTSIDE_CHARGES.map(p => createItem(p.name));
  renderAll();

  // Delegated event listener for all table inputs
  const tbody = document.getElementById("billTbody");
  if (tbody) {
    tbody.addEventListener("input", (e) => {
      const section = e.target.getAttribute("data-section");
      const index = parseInt(e.target.getAttribute("data-index"), 10);
      if (!section || isNaN(index)) return;

      const data = section === "hospital" ? hospitalCharges : outsideCharges;
      const row = data[index];
      if (!row) return;

      if (e.target.classList.contains("input-name")) {
        row.name = e.target.value;
      } else if (e.target.classList.contains("input-qty")) {
        row.qty = e.target.value;
        updateRowAmount(section, index, true);
      } else if (e.target.classList.contains("input-price")) {
        row.priceUnit = e.target.value;
        updateRowAmount(section, index, true);
      } else if (e.target.classList.contains("input-amount")) {
        row.amount = e.target.value;
        updateRowAmount(section, index, false);
      }
    });
  }

  // Discount & Advance input listeners
  const discountInput = document.getElementById("discountInput");
  if (discountInput) discountInput.addEventListener("input", calculateTotals);

  const advanceInput = document.getElementById("advanceInput");
  if (advanceInput) advanceInput.addEventListener("input", calculateTotals);

  // Default: header hidden during print (pre-printed pad mode)
  togglePrintHeader(false);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

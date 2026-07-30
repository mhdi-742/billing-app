/**
 * MIKKY MEGHA HOSPITAL - BILLING APP LOGIC
 * Global functions defined at top-level for 100% reliable execution.
 */

// Initial Default Particulars (Itemized charges)
const DEFAULT_PARTICULARS = [
  { name: "Package", cash: "", upi: "", amount: "", remarks: "" },
  { name: "Medicine Bill", cash: "", upi: "", amount: "", remarks: "" },
  { name: "Bed charge", cash: "", upi: "", amount: "", remarks: "" },
  { name: "Investigation Reports", cash: "", upi: "", amount: "", remarks: "" },
  { name: "Food Charge", cash: "", upi: "", amount: "", remarks: "" },
  { name: "Doctor Charge", cash: "", upi: "", amount: "", remarks: "" },
  { name: "Transport Charge", cash: "", upi: "", amount: "", remarks: "" },
  { name: "OT / Equipment Charge", cash: "", upi: "", amount: "", remarks: "" },
  { name: "Others Charge", cash: "", upi: "", amount: "", remarks: "" }
];

let particularsData = [];

/**
 * Reset all form fields & particulars table
 */
function resetForm() {
  const fields = [
    "patientName", "ageSex", "contactNo", "patientId", 
    "dateAdmission", "dateDischarge", "refDoctor", "stayDuration", 
    "discountInput", "discountRemarks", "advanceInput", "advanceRemarks"
  ];
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });

  particularsData = DEFAULT_PARTICULARS.map(p => ({
    name: p.name,
    cash: "",
    upi: "",
    amount: "",
    remarks: ""
  }));

  renderParticulars();
}

/**
 * Add a new particular row
 */
function addNewRow() {
  particularsData.push({ name: "New Item", cash: "", upi: "", amount: "", remarks: "" });
  renderParticulars();
}

/**
 * Print invoice
 */
function printInvoice() {
  window.print();
}

/**
 * Delete specified row index
 */
function deleteRow(index) {
  if (index >= 0 && index < particularsData.length) {
    particularsData.splice(index, 1);
    renderParticulars();
  }
}

// Bind functions to window scope immediately
window.resetForm = resetForm;
window.addNewRow = addNewRow;
window.printInvoice = printInvoice;
window.deleteRow = deleteRow;

/**
 * Render table rows
 */
function renderParticulars() {
  const particularsTbody = document.getElementById("particularsTbody");
  if (!particularsTbody) return;

  particularsTbody.innerHTML = "";

  particularsData.forEach((item, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td class="col-sl">${index + 1}.</td>
      <td class="col-particulars">
        <input type="text" class="table-input input-name" data-index="${index}" value="${escapeHtml(item.name)}" placeholder="Item name">
      </td>
      <td class="col-cash">
        <input type="number" class="table-input text-right input-cash" data-index="${index}" value="${item.cash !== undefined ? item.cash : ''}" placeholder="0" min="0" step="any">
      </td>
      <td class="col-upi">
        <input type="number" class="table-input text-right input-upi" data-index="${index}" value="${item.upi !== undefined ? item.upi : ''}" placeholder="0" min="0" step="any">
      </td>
      <td class="col-amount">
        <input type="number" class="table-input text-right input-amount bold-amount" data-index="${index}" value="${item.amount !== undefined ? item.amount : ''}" placeholder="0" min="0" step="any">
      </td>
      <td class="col-remarks">
        <input type="text" class="table-input input-remarks" data-index="${index}" value="${escapeHtml(item.remarks)}" placeholder="Remarks">
      </td>
      <td class="col-actions no-print">
        <button class="btn-icon-danger btn-delete-row" onclick="deleteRow(${index})" title="Delete Row">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
        </button>
      </td>
    `;

    particularsTbody.appendChild(tr);
  });

  calculateTotals();
}

/**
 * Calculate totals and update amount in words
 * Formula: Total Payable = Net Amount - Discount - Advance Payment
 */
function calculateTotals() {
  let totalCash = 0;
  let totalUpi = 0;
  let netAmount = 0;

  particularsData.forEach(item => {
    const c = parseFloat(item.cash) || 0;
    const u = parseFloat(item.upi) || 0;
    let amt = parseFloat(item.amount);
    
    if (isNaN(amt)) {
      amt = c + u;
    }

    totalCash += c;
    totalUpi += u;
    netAmount += amt;
  });

  const discountInput = document.getElementById("discountInput");
  const advanceInput = document.getElementById("advanceInput");

  const discount = parseFloat(discountInput ? discountInput.value : 0) || 0;
  const advance = parseFloat(advanceInput ? advanceInput.value : 0) || 0;

  // Final Total = Net Amount - Discount - Advance Payment
  const grandTotal = Math.max(0, netAmount - discount - advance);

  const totalCashDisplay = document.getElementById("totalCashDisplay");
  const totalUpiDisplay = document.getElementById("totalUpiDisplay");
  const netAmountDisplay = document.getElementById("netAmountDisplay");
  const grandTotalDisplay = document.getElementById("grandTotalDisplay");
  const amountInWords = document.getElementById("amountInWords");

  if (totalCashDisplay) totalCashDisplay.textContent = totalCash > 0 ? totalCash.toFixed(2) : "0.00";
  if (totalUpiDisplay) totalUpiDisplay.textContent = totalUpi > 0 ? totalUpi.toFixed(2) : "0.00";
  if (netAmountDisplay) netAmountDisplay.textContent = netAmount.toFixed(2);
  if (grandTotalDisplay) grandTotalDisplay.textContent = grandTotal.toFixed(2);

  if (amountInWords) amountInWords.textContent = convertNumberToWords(grandTotal);
}

/**
 * Update row total when cash/upi changes
 */
function updateRowTotal(index, fromCashUpi = false) {
  const row = particularsData[index];
  if (row) {
    if (fromCashUpi) {
      const c = parseFloat(row.cash) || 0;
      const u = parseFloat(row.upi) || 0;
      const totalVal = c + u;
      row.amount = totalVal > 0 ? totalVal : "";
      
      const particularsTbody = document.getElementById("particularsTbody");
      if (particularsTbody) {
        const amountInput = particularsTbody.querySelector(`.input-amount[data-index="${index}"]`);
        if (amountInput) {
          amountInput.value = row.amount !== "" && row.amount !== undefined ? row.amount : "";
        }
      }
    }
  }
  calculateTotals();
}

/**
 * Calculate hospital stay duration
 */
function calculateHospitalStay() {
  const dateAdmission = document.getElementById("dateAdmission");
  const dateDischarge = document.getElementById("dateDischarge");
  const stayDuration = document.getElementById("stayDuration");

  if (!dateAdmission || !dateDischarge || !stayDuration) return;

  const admStr = dateAdmission.value.trim();
  const disStr = dateDischarge.value.trim();

  if (!admStr || !disStr) return;

  const parseDate = (str) => {
    const parts = str.split(/[\/\.-]/);
    if (parts.length === 3) {
      let day = parseInt(parts[0], 10);
      let month = parseInt(parts[1], 10) - 1;
      let year = parseInt(parts[2], 10);
      if (year < 100) year += 2000;
      return new Date(year, month, day);
    }
    return null;
  };

  const admDate = parseDate(admStr);
  const disDate = parseDate(disStr);

  if (admDate && disDate && !isNaN(admDate.getTime()) && !isNaN(disDate.getTime())) {
    const diffTime = disDate - admDate;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays >= 0) {
      stayDuration.value = `${diffDays + 1}Days`;
    }
  }
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
 * Initialize application logic
 */
function initApp() {
  particularsData = JSON.parse(JSON.stringify(DEFAULT_PARTICULARS));
  renderParticulars();

  const particularsTbody = document.getElementById("particularsTbody");
  if (particularsTbody) {
    particularsTbody.addEventListener("input", (e) => {
      const index = parseInt(e.target.getAttribute("data-index"), 10);
      if (isNaN(index)) return;

      if (e.target.classList.contains("input-name")) {
        particularsData[index].name = e.target.value;
        updateRowTotal(index, false);
      } else if (e.target.classList.contains("input-cash")) {
        particularsData[index].cash = e.target.value;
        updateRowTotal(index, true);
      } else if (e.target.classList.contains("input-upi")) {
        particularsData[index].upi = e.target.value;
        updateRowTotal(index, true);
      } else if (e.target.classList.contains("input-amount")) {
        particularsData[index].amount = e.target.value;
        updateRowTotal(index, false);
      } else if (e.target.classList.contains("input-remarks")) {
        particularsData[index].remarks = e.target.value;
      }
    });
  }

  const discountInput = document.getElementById("discountInput");
  if (discountInput) discountInput.addEventListener("input", calculateTotals);

  const advanceInput = document.getElementById("advanceInput");
  if (advanceInput) advanceInput.addEventListener("input", calculateTotals);

  const dateAdmission = document.getElementById("dateAdmission");
  const dateDischarge = document.getElementById("dateDischarge");
  if (dateAdmission) dateAdmission.addEventListener("input", calculateHospitalStay);
  if (dateDischarge) dateDischarge.addEventListener("input", calculateHospitalStay);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

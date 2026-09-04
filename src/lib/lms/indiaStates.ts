/**
 * States and union territories with their GST state codes.
 *
 * The code is the first two digits of every GSTIN, and it is what decides
 * whether a sale is intra-state (CGST + SGST) or inter-state (IGST). Asked as a
 * field rather than parsed out of the billing address: "Gurgaon", "Gurugram"
 * and "Haryana" all mean Haryana, an address may not name the state at all, and
 * getting it wrong puts the wrong tax lines on a tax invoice.
 */

export type IndiaState = { code: string; name: string };

export const INDIA_STATES: IndiaState[] = [
  { code: "35", name: "Andaman and Nicobar Islands" },
  { code: "37", name: "Andhra Pradesh" },
  { code: "12", name: "Arunachal Pradesh" },
  { code: "18", name: "Assam" },
  { code: "10", name: "Bihar" },
  { code: "04", name: "Chandigarh" },
  { code: "22", name: "Chhattisgarh" },
  { code: "26", name: "Dadra and Nagar Haveli and Daman and Diu" },
  { code: "07", name: "Delhi" },
  { code: "30", name: "Goa" },
  { code: "24", name: "Gujarat" },
  { code: "06", name: "Haryana" },
  { code: "02", name: "Himachal Pradesh" },
  { code: "01", name: "Jammu and Kashmir" },
  { code: "20", name: "Jharkhand" },
  { code: "29", name: "Karnataka" },
  { code: "32", name: "Kerala" },
  { code: "38", name: "Ladakh" },
  { code: "31", name: "Lakshadweep" },
  { code: "23", name: "Madhya Pradesh" },
  { code: "27", name: "Maharashtra" },
  { code: "14", name: "Manipur" },
  { code: "17", name: "Meghalaya" },
  { code: "15", name: "Mizoram" },
  { code: "13", name: "Nagaland" },
  { code: "21", name: "Odisha" },
  { code: "34", name: "Puducherry" },
  { code: "03", name: "Punjab" },
  { code: "08", name: "Rajasthan" },
  { code: "11", name: "Sikkim" },
  { code: "33", name: "Tamil Nadu" },
  { code: "36", name: "Telangana" },
  { code: "16", name: "Tripura" },
  { code: "09", name: "Uttar Pradesh" },
  { code: "05", name: "Uttarakhand" },
  { code: "19", name: "West Bengal" },
  { code: "97", name: "Other Territory" },
];

/** Where Levitate PeopleSoft is registered. A buyer here pays CGST + SGST. */
export const HOME_STATE_CODE = "06";

/** The two leading digits of a GSTIN are its state code. */
export const stateCodeOfGstin = (gstin: string) =>
  /^[0-9]{2}/.test(gstin.trim()) ? gstin.trim().slice(0, 2) : "";

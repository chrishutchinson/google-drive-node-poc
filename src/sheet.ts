import "dotenv/config";

import { getAuthClient } from "./google/auth";
import { findRowIndex, updateSheetRow } from "./google/lib";

const { DESTINATION_SHEET_ID } = process.env;

const APPROVED_COLUMN_LETTER = "C";
const SEARCH_ROW_INDEX = 0;
const SEARCH_TERM = "Renny";

(async () => {
  if (!DESTINATION_SHEET_ID) {
    throw new Error("Please set the DESTINATION_SHEET_ID value in .env");
  }

  const auth = await getAuthClient();

  const rowIndex = await findRowIndex(
    auth,
    DESTINATION_SHEET_ID,
    SEARCH_ROW_INDEX,
    SEARCH_TERM
  );

  const sheet = await updateSheetRow(auth, DESTINATION_SHEET_ID, {
    range: `${APPROVED_COLUMN_LETTER}${rowIndex + 1}`,
    value: true,
  });

  console.log(sheet);
})();

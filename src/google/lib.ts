import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";

export const createDocumentFromTemplate = async (
  auth: OAuth2Client,
  templateDocumentId: string,
  title: string,
  inputData: Record<string, string | number>
) => {
  const drive = google.drive({ version: "v3", auth });
  const docs = google.docs({
    version: "v1",
    auth,
  });

  const { data: duplicatedFile } = await drive.files.copy({
    fileId: templateDocumentId,
    requestBody: {
      name: title,
    },
  });

  if (!duplicatedFile || !duplicatedFile.id) {
    throw new Error("Unable to duplicate template file");
  }

  const { data: newDocument } = await docs.documents.get({
    documentId: duplicatedFile.id,
  });

  if (!newDocument || !newDocument.documentId) {
    throw new Error("Unable to find new document");
  }

  await docs.documents.batchUpdate({
    documentId: newDocument.documentId,
    requestBody: {
      requests: Object.entries(inputData).map(([key, value]) => ({
        replaceAllText: {
          containsText: {
            text: `{{${key}}}`,
            matchCase: true,
          },
          replaceText: value.toString() || `{{${key}}}`,
        },
      })),
    },
  });

  return newDocument;
};

export const findRowIndex = async (
  auth: OAuth2Client,
  spreadsheetId: string,
  columnIndex: number,
  match: string | number
) => {
  const sheets = google.sheets({
    version: "v4",
    auth,
  });

  const { data: sheet } = await sheets.spreadsheets.get({
    spreadsheetId,
    includeGridData: true,
  });

  if (
    !sheet ||
    !sheet.spreadsheetId ||
    !sheet.sheets ||
    sheet.sheets.length === 0
  ) {
    throw new Error("Unable to fetch sheet based on provided ID");
  }

  const firstSheet = sheet.sheets[0];

  const rowIndex = firstSheet.data?.[0].rowData?.findIndex((row) => {
    return (
      row.values?.[columnIndex].effectiveValue?.stringValue === match.toString()
    );
  });

  if (!rowIndex) {
    throw new Error("No row matched your query");
  }

  return rowIndex;
};

export const updateSheetRow = async (
  auth: OAuth2Client,
  spreadsheetId: string,
  update: {
    range: string;
    value: string | number | boolean;
  }
) => {
  const sheets = google.sheets({
    version: "v4",
    auth,
  });

  const { data: sheet } = await sheets.spreadsheets.get({
    spreadsheetId,
  });

  if (!sheet || !sheet.spreadsheetId) {
    throw new Error("Unable to fetch sheet based on provided ID");
  }

  await sheets.spreadsheets.values.update({
    spreadsheetId: sheet.spreadsheetId,
    range: update.range,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      range: update.range,
      values: [[update.value]],
    },
  });

  return sheet;
};

import { getAuthClient } from "./google/auth";
import { createDocumentFromTemplate } from "./google/lib";

const { TEMPLATE_DOCUMENT_ID } = process.env;

(async () => {
  if (!TEMPLATE_DOCUMENT_ID) {
    throw new Error("Please set the TEMPLATE_DOCUMENT_ID value in .env");
  }

  const auth = await getAuthClient();

  const newDocument = await createDocumentFromTemplate(
    auth,
    TEMPLATE_DOCUMENT_ID,
    `Completed template job at ${new Date().toISOString()}`,
    {
      name: "First Last",
      day: new Date().getDate(),
      time: new Date().toTimeString(),
      key: "Some key",
      value: "Some value",
    }
  );

  console.log(newDocument);
})();

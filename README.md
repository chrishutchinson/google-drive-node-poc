# Google Drive integration proof-of-concept

> A couple of small scripts to just demonstration a few integration points with Google Drive

## Getting started

1.  Clone this repo
2.  Install dependencies

        yarn

3.  Create a Google Project and enable the "Google Drive" and "Google Docs" APIs – https://developers.google.com/workspace/guides/create-project
4.  Create "Desktop Application" Google credentials for your project – https://developers.google.com/workspace/guides/create-credentials
5.  Make a copy of `.env.sample` called `.env` and complete

## Google Docs script

This script:

1. takes a copy of a Google Document (based on the `TEMPLATE_DOCUMENT_ID` environment variable)
2. updates the title based on the provided string
3. replaces the content in a template-string style (e.g. `{{first_name}}` is replaced with the value of `first_name` in the data object)
4. saves the changes back to Google Drive

Source code: `./src/document.ts`

To run it locally:

```bash
yarn document
```

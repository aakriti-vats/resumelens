import * as pdfjsLib from 'pdfjs-dist'
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker

/**
 * Extracts readable text from all pages of an uploaded PDF file.
 *
 * @param {File} file - Uploaded PDF File object
 * @returns {Promise<string>} Combined plain text from all pages
 */
export async function extractTextFromPdf(file) {
  if (!file) {
    throw new Error('No PDF file provided.')
  }

  const arrayBuffer = await file.arrayBuffer()
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
  const pdfDocument = await loadingTask.promise
  const pageTexts = []

  for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum += 1) {
    const page = await pdfDocument.getPage(pageNum)
    const textContent = await page.getTextContent()
    const pageString = textContent.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ')
      .trim()

    if (pageString) {
      pageTexts.push(pageString)
    }
  }

  return pageTexts.join('\n\n')
}

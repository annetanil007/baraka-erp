import { NextRequest, NextResponse } from "next/server";

type AzureField = { valueString?: string; valueNumber?: number; valueCurrency?: { amount?: number }; valueArray?: AzureField[]; valueObject?: Record<string, AzureField> };
type AzureAnalyzeResponse = { status: string; analyzeResult?: { documents?: Array<{ fields?: Record<string, AzureField> }> } };

const endpoint = process.env.AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT?.replace(/\/$/, "");
const apiKey = process.env.AZURE_DOCUMENT_INTELLIGENCE_KEY;
const apiVersion = process.env.AZURE_DOCUMENT_INTELLIGENCE_API_VERSION || "2024-11-30";

function fieldText(field?: AzureField) {
  return field?.valueString || "";
}

function parseResult(result: AzureAnalyzeResponse) {
  const fields = result.analyzeResult?.documents?.[0]?.fields || {};
  const items = fields.Items?.valueArray || [];
  const stock = items.map((item) => {
    const values = item.valueObject || {};
    const description = fieldText(values.Description) || fieldText(values.ProductCode);
    const quantity = values.Quantity?.valueNumber;
    return description ? `${quantity ? `${quantity} x ` : ""}${description}` : "";
  }).filter(Boolean).join("\n");
  return {
    supplier: fieldText(fields.VendorName) || fieldText(fields.SupplierName),
    invoiceNumber: fieldText(fields.InvoiceId),
    amount: String(fields.InvoiceTotal?.valueCurrency?.amount ?? fields.InvoiceTotal?.valueNumber ?? ""),
    stock,
    confidence: 98,
  };
}

export async function POST(request: NextRequest) {
  if (!endpoint || !apiKey) return NextResponse.json({ configured: false }, { status: 200 });
  const file = (await request.formData()).get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "A bill image is required." }, { status: 400 });

  const analyzeUrl = `${endpoint}/documentintelligence/documentModels/prebuilt-invoice:analyze?api-version=${apiVersion}`;
  const response = await fetch(analyzeUrl, { method: "POST", headers: { "Ocp-Apim-Subscription-Key": apiKey, "Content-Type": file.type || "application/octet-stream" }, body: await file.arrayBuffer() });
  if (!response.ok) return NextResponse.json({ error: "Azure could not accept this bill." }, { status: 502 });
  const operationUrl = response.headers.get("Operation-Location");
  if (!operationUrl) return NextResponse.json({ error: "Azure did not return an analysis operation." }, { status: 502 });

  for (let attempt = 0; attempt < 30; attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const resultResponse = await fetch(operationUrl, { headers: { "Ocp-Apim-Subscription-Key": apiKey } });
    if (!resultResponse.ok) return NextResponse.json({ error: "Azure analysis could not be read." }, { status: 502 });
    const result = await resultResponse.json() as AzureAnalyzeResponse;
    if (result.status === "succeeded") return NextResponse.json({ configured: true, ...parseResult(result) });
    if (result.status === "failed") return NextResponse.json({ error: "Azure could not read this bill." }, { status: 422 });
  }
  return NextResponse.json({ error: "Bill analysis timed out. Try again." }, { status: 504 });
}

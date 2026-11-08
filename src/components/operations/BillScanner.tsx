"use client";

import { useEffect, useRef, useState } from "react";
import NextImage from "next/image";
import { CheckCircle2, FileScan, LoaderCircle, Upload, WandSparkles } from "lucide-react";
import Tesseract from "tesseract.js";

type DetectedBill = { supplier: string; invoiceNumber: string; amount: string; stock: string };

function enhanceImage(source: HTMLImageElement, canvas: HTMLCanvasElement) {
  const maxWidth = 2200;
  const scale = Math.min(1, maxWidth / source.naturalWidth);
  canvas.width = Math.round(source.naturalWidth * scale);
  canvas.height = Math.round(source.naturalHeight * scale);
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return;
  context.filter = "grayscale(1) contrast(1.12) brightness(1.06)";
  context.drawImage(source, 0, 0, canvas.width, canvas.height);
  const image = context.getImageData(0, 0, canvas.width, canvas.height);
  for (let index = 0; index < image.data.length; index += 4) {
    const value = image.data[index];
    const normalized = Math.max(0, Math.min(255, Math.round((value - 8) * 1.08)));
    image.data[index] = normalized;
    image.data[index + 1] = normalized;
    image.data[index + 2] = normalized;
  }
  context.putImageData(image, 0, 0);
}

function extractBill(text: string): DetectedBill {
  const normalizedText = text.replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit))).replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)));
  const lines = normalizedText.split("\n").map((line) => line.replace(/\s+/g, " ").trim()).filter((line) => line.length > 1);
  const ignored = /invoice|tax|date|total|amount|bill|receipt|phone|tel|email|address|vat|due|subtotal|discount|qty|quantity|description|فاتورة|ضريبة|تاريخ|الإجمالي|المجموع|المبلغ|إيصال|هاتف|عنوان|خصم|الكمية|الوصف/i;
  const amountCandidates = [...normalizedText.matchAll(/(?:AED|د\.?إ|دولار|USD|\$)?\s*([\d]{1,3}(?:[, ]\d{3})*(?:\.\d{1,2})?)/gi)]
    .map((match) => Number(match[1].replace(/[, ]/g, ""))).filter((value) => Number.isFinite(value) && value > 0);
  const totalLine = lines.find((line) => /grand total|amount due|total due|invoice total|net total|total/i.test(line));
  const totalOnLine = totalLine?.match(/([\d]{1,3}(?:[, ]\d{3})*(?:\.\d{1,2})?)(?!.*\d)/)?.[1];
  const invoiceMatch = normalizedText.match(/(?:invoice|inv|bill|فاتورة)[\s#:/.-]*([A-Z0-9][A-Z0-9:/.-]{3,})/i);
  const companyCandidates = lines.slice(0, 8).filter((line) => !ignored.test(line) && !/^\d[\d\s+().-]{5,}$/.test(line) && !/https?:|www\.|@/.test(line));
  const supplier = companyCandidates.sort((a, b) => b.length - a.length)[0] || "Review supplier name";
  const stock = lines.filter((line) => /\d/.test(line) && !ignored.test(line) && line !== supplier).slice(0, 8).join("\n");
  return { supplier, invoiceNumber: invoiceMatch?.[1] || "Review invoice number", amount: (totalOnLine || String(Math.max(...amountCandidates, 0))).replace(/[, ]/g, "") || "0.00", stock: stock || "Review stock lines" };
}

export default function BillScanner({ onSaved }: { onSaved: (bill: DetectedBill) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [enhancedUrl, setEnhancedUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "enhancing" | "scanning" | "ready" | "error">("idle");
  const [progress, setProgress] = useState(0);
  const [rawText, setRawText] = useState("");
  const [confidence, setConfidence] = useState<number | null>(null);
  const [bill, setBill] = useState<DetectedBill>({ supplier: "", invoiceNumber: "", amount: "", stock: "" });

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  const processBill = async (file: File) => {
    setStatus("enhancing");
    const sourceUrl = URL.createObjectURL(file);
    setPreviewUrl(sourceUrl);
    const source = new Image();
    source.src = sourceUrl;
    await new Promise<void>((resolve, reject) => { source.onload = () => resolve(); source.onerror = () => reject(new Error("Image could not be loaded")); });
    try {
      const azurePayload = new FormData();
      azurePayload.append("file", file);
      const azureResponse = await fetch("/api/ocr/invoice", { method: "POST", body: azurePayload });
      if (azureResponse.ok) {
        const azureResult = await azureResponse.json() as { configured?: boolean; supplier?: string; invoiceNumber?: string; amount?: string; stock?: string; confidence?: number };
        if (azureResult.configured) {
          setBill({ supplier: azureResult.supplier || "Review supplier name", invoiceNumber: azureResult.invoiceNumber || "Review invoice number", amount: azureResult.amount || "0.00", stock: azureResult.stock || "Review stock lines" });
          setConfidence(azureResult.confidence || 98);
          setRawText("Azure Invoice Intelligence extracted structured invoice fields. Verify the draft before saving.");
          setStatus("ready");
          return;
        }
      }
    } catch {
      // Fall back to local OCR when the remote analyzer is unavailable.
    }
    if (canvasRef.current) {
      enhanceImage(source, canvasRef.current);
      const enhancedImageUrl = canvasRef.current.toDataURL("image/jpeg", 0.92);
      setEnhancedUrl(enhancedImageUrl);
      setStatus("scanning");
      try {
        const worker = await Tesseract.createWorker("eng+ara", 3, { logger: (message) => { if (message.status === "recognizing text") setProgress(Math.round((message.progress || 0) * 100)); } });
        try {
          await worker.setParameters({ tessedit_pageseg_mode: Tesseract.PSM.SINGLE_BLOCK, user_defined_dpi: "300" });
          const block = await worker.recognize(enhancedImageUrl);
          await worker.setParameters({ tessedit_pageseg_mode: Tesseract.PSM.SPARSE_TEXT, user_defined_dpi: "300" });
          const sparse = await worker.recognize(sourceUrl);
          const combinedText = `${block.data.text}\n${sparse.data.text}`;
          setRawText(combinedText);
          setConfidence(Math.round(((block.data.confidence || 0) + (sparse.data.confidence || 0)) / 2));
          setBill(extractBill(combinedText));
          setStatus("ready");
        } finally {
          await worker.terminate();
        }
      } catch {
        setStatus("error");
      }
      return;
    }
    setStatus("scanning");
    try {
      const result = await Tesseract.recognize(file, "eng", { logger: (message) => { if (message.status === "recognizing text") setProgress(Math.round((message.progress || 0) * 100)); } });
      setRawText(result.data.text);
      setBill(extractBill(result.data.text));
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  };

  const update = (key: keyof DetectedBill, value: string) => setBill((current) => ({ ...current, [key]: value }));
  return <div className="scanner-card">
    <div className="scanner-intro"><div className="scanner-icon"><FileScan size={20} /></div><div><div className="card-title">Scan supplier bill</div><div className="card-subtitle">Upload a photo. We enhance it and read English or Arabic bills, then identify stock lines for review.</div></div></div>
    <label className="upload-zone"><Upload size={20} /><strong>{status === "idle" ? "Choose a bill photo" : status === "scanning" ? `Reading bill... ${progress}%` : status === "enhancing" ? "Enhancing image..." : "Replace bill photo"}</strong><span>JPG, PNG or WEBP · best results with a flat, well-lit bill</span><input type="file" accept="image/*" onChange={(event) => { const file = event.target.files?.[0]; if (file) void processBill(file); }} /></label>
    <canvas ref={canvasRef} className="scanner-canvas" />
    {status === "scanning" && <div className="scanner-progress"><LoaderCircle size={15} className="spin" /> OCR is detecting English and Arabic text, supplier, totals and stock lines. This can take a moment...</div>}
    {status === "error" && <div className="alert-banner danger">The bill could not be read. Try a clearer, front-facing photo.</div>}
    {(status === "ready" || status === "error") && <div className="scanner-results">
      <div className="scanner-preview"><div className="section-heading">Enhanced scan</div>{(enhancedUrl || previewUrl) && <NextImage src={enhancedUrl || previewUrl} alt="Enhanced bill preview" width={900} height={1200} unoptimized />}</div>
      <div className="scanner-fields"><div className="scanner-detected"><WandSparkles size={14} /> OCR draft · verify before saving {confidence !== null && <span className="badge badge-muted">{confidence}% confidence</span>}</div><div className="form-group"><label className="form-label">Supplier</label><input className="form-input" value={bill.supplier} onChange={(event) => update("supplier", event.target.value)} /></div><div className="grid-2"><div className="form-group"><label className="form-label">Invoice number</label><input className="form-input" value={bill.invoiceNumber} onChange={(event) => update("invoiceNumber", event.target.value)} /></div><div className="form-group"><label className="form-label">Total (AED)</label><input className="form-input" type="number" value={bill.amount} onChange={(event) => update("amount", event.target.value)} /></div></div><div className="form-group"><label className="form-label">Detected stock lines</label><textarea className="form-input" rows={5} value={bill.stock} onChange={(event) => update("stock", event.target.value)} /></div><button className="btn btn-primary" onClick={() => onSaved(bill)}><CheckCircle2 size={14} /> Save bill to invoices</button></div>
    </div>}
    {rawText && <details className="scanner-raw"><summary>View OCR text</summary><pre>{rawText}</pre></details>}
  </div>;
}

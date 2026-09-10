import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { PDFDocument, StandardFonts, rgb } from "npm:pdf-lib@1.17.1";
import QRCode from "npm:qrcode@1.5.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { ...corsHeaders, "Cache-Control": "private, no-store" } });

const dataUrlToBytes = (dataUrl: string) => {
  const base64 = dataUrl.split(",")[1] || "";
  const binary = atob(base64);
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
};

const fitSize = (text: string, font: any, maxWidth: number, preferred = 32, min = 18) => {
  let size = preferred;
  while (size > min && font.widthOfTextAtSize(text, size) > maxWidth) size -= 1;
  return size;
};

async function buildCertificatePdf(cert: any) {
  // TEMPORARY PLACEHOLDER TEMPLATE.
  // Replace only this function when AIxBio Africa's final certificate artwork is ready.
  // The certificate database, ownership checks, QR verification, storage and signed-URL
  // access can remain unchanged.
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([842, 595]);
  const { width, height } = page.getSize();
  const sans = await pdf.embedFont(StandardFonts.Helvetica);
  const sansBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const dark = rgb(35 / 255, 35 / 255, 35 / 255);
  const muted = rgb(105 / 255, 105 / 255, 105 / 255);
  const light = rgb(246 / 255, 246 / 255, 246 / 255);

  page.drawRectangle({ x: 0, y: 0, width, height, color: light });
  page.drawRectangle({
    x: 34,
    y: 34,
    width: width - 68,
    height: height - 68,
    borderColor: muted,
    borderWidth: 1,
  });

  const centered = (text: string, font: any, size: number, y: number, color = dark) => {
    const tw = font.widthOfTextAtSize(text, size);
    page.drawText(text, { x: (width - tw) / 2, y, size, font, color });
  };

  centered('AIxBio Africa', sansBold, 16, height - 92);
  centered('CERTIFICATE TEMPLATE PLACEHOLDER', sansBold, 22, height - 142);
  centered('Temporary system-test PDF — replace with final AIxBio Africa certificate artwork.', sans, 11, height - 169, muted);

  centered('Certificate of Completion', sansBold, 24, height - 232);
  const nameSize = fitSize(cert.recipient_name, sansBold, 610, 29, 18);
  centered(cert.recipient_name, sansBold, nameSize, height - 287);

  const programSize = fitSize(cert.program_name, sans, 650, 17, 12);
  centered(cert.program_name, sans, programSize, height - 326);
  if (cert.cohort_name) centered(cert.cohort_name, sans, 11, height - 352, muted);

  const issued = new Date(cert.issued_at).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
  });

  const site = (Deno.env.get('SITE_URL') || 'https://aixbio-africa.vercel.app').replace(/\/$/, '');
  const verifyUrl = `${site}/certificates/verify/${encodeURIComponent(cert.public_code)}`;
  const qrDataUrl = await QRCode.toDataURL(verifyUrl, { margin: 1, width: 200 });
  const qr = await pdf.embedPng(dataUrlToBytes(qrDataUrl));
  const qrSize = 68;
  page.drawImage(qr, { x: width - 128, y: 60, width: qrSize, height: qrSize });

  page.drawText(`Issued: ${issued}`, { x: 68, y: 111, size: 10, font: sans, color: muted });
  page.drawText(`Certificate ID: ${cert.public_code}`, { x: 68, y: 89, size: 10, font: sansBold, color: dark });
  page.drawText('QR verification is functional; visual design is intentionally unfinished.', { x: 68, y: 67, size: 9, font: sans, color: muted });

  return await pdf.save();
}

async function ensureCertificateFile(adminClient: any, cert: any) {
  if (cert.file_status === "ready" && cert.file_path) {
    return cert.file_path as string;
  }

  const filePath = `${cert.program_type}/${cert.id}/${cert.public_code}.pdf`;
  try {
    const pdfBytes = await buildCertificatePdf(cert);
    const { error: uploadError } = await adminClient.storage.from("certificates").upload(filePath, pdfBytes, {
      contentType: "application/pdf",
      upsert: true,
    });
    if (uploadError) throw uploadError;

    const { error: updateError } = await adminClient.from("certificates").update({
      file_path: filePath,
      file_status: "ready",
      file_error: null,
      updated_at: new Date().toISOString(),
    }).eq("id", cert.id);
    if (updateError) throw updateError;
    return filePath;
  } catch (e) {
    await adminClient.from("certificates").update({
      file_status: "error",
      file_error: e?.message || "Certificate generation failed.",
      updated_at: new Date().toISOString(),
    }).eq("id", cert.id);
    throw e;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "POST required." }, 405);

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return json({ error: "Sign in required." }, 401);

  const url = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const userClient = createClient(url, anonKey, { global: { headers: { Authorization: authHeader } } });
  const adminClient = createClient(url, serviceKey, { auth: { persistSession: false } });

  const { data: { user }, error: userError } = await userClient.auth.getUser();
  if (userError || !user) return json({ error: "Invalid session." }, 401);

  const { data: adminRow } = await adminClient.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
  const isAdmin = Boolean(adminRow);
  const body = await req.json().catch(() => ({}));
  const action = body?.action;

  if (action === "open-capstone") {
    if (!isAdmin) return json({ error: "Admin access required." }, 403);
    const versionId = body?.version_id;
    if (!versionId) return json({ error: "Capstone version is required." }, 400);
    const { data: version, error } = await adminClient
      .from("capstone_versions")
      .select("id,project_url,file_path")
      .eq("id", versionId)
      .maybeSingle();
    if (error || !version) return json({ error: "Capstone version not found." }, 404);
    if (version.project_url) return json({ project_url: version.project_url });
    if (!version.file_path) return json({ error: "This submission has no file." }, 404);
    const { data, error: signError } = await adminClient.storage.from("capstones").createSignedUrl(version.file_path, 300);
    if (signError || !data?.signedUrl) return json({ error: signError?.message || "Could not open submission." }, 500);
    return json({ signed_url: data.signedUrl });
  }

  const certificateId = body?.certificate_id;
  if (!certificateId) return json({ error: "Certificate is required." }, 400);

  const { data: cert, error: certError } = await adminClient.from("certificates").select("*").eq("id", certificateId).maybeSingle();
  if (certError || !cert) return json({ error: "Certificate not found." }, 404);

  const ownsCertificate = cert.recipient_user_id === user.id;
  if (!isAdmin && !ownsCertificate) return json({ error: "You do not have access to this certificate." }, 403);

  if (action === "get-url") {
    if (cert.status !== "issued") return json({ error: "This certificate is not currently valid." }, 409);
    try {
      const filePath = await ensureCertificateFile(adminClient, cert);
      const { data, error } = await adminClient.storage.from("certificates").createSignedUrl(filePath, 300);
      if (error || !data?.signedUrl) return json({ error: error?.message || "Could not open certificate." }, 500);
      return json({ signed_url: data.signedUrl });
    } catch (e) {
      return json({ error: e?.message || "Could not prepare certificate." }, 500);
    }
  }

  if (action === "generate") {
    if (!isAdmin) return json({ error: "Admin access required." }, 403);
    if (cert.status !== "issued") return json({ error: "Only an issued certificate can be generated." }, 409);
    try {
      await ensureCertificateFile(adminClient, cert);
      return json({ certificate_id: cert.id, file_status: "ready" });
    } catch (e) {
      return json({ error: e?.message || "Certificate generation failed." }, 500);
    }
  }

  return json({ error: "Unknown action." }, 400);
});

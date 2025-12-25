import { NextResponse } from "next/server";

export const runtime = "nodejs";

type LeadPayload = Record<string, unknown> & {
  nome?: unknown;
  telefone_whatsapp?: unknown;
};

const N8N_FORM_WEBHOOK_URL =
  process.env.N8N_FORM_WEBHOOK_URL ?? "https://webh.procexai.tech/webhook/TizerpaLife-Formulario";

function isString(v: unknown): v is string {
  return typeof v === "string";
}

export async function POST(req: Request) {
  let body: LeadPayload;
  try {
    body = (await req.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const nome = isString(body.nome) ? body.nome.trim() : "";
  const telefone = isString(body.telefone_whatsapp) ? body.telefone_whatsapp.replace(/\D/g, "") : "";

  if (!nome) {
    return NextResponse.json({ error: "Campo 'nome' é obrigatório" }, { status: 400 });
  }
  // telefone_whatsapp esperado: DDD + número (10 ou 11 dígitos), sem 55
  if (!(telefone.length === 10 || telefone.length === 11)) {
    return NextResponse.json(
      { error: "Campo 'telefone_whatsapp' inválido (use DDD + número, somente dígitos)" },
      { status: 400 }
    );
  }

  try {
    const upstream = await fetch(N8N_FORM_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, nome, telefone_whatsapp: telefone }),
      cache: "no-store",
    });

    const text = await upstream.text().catch(() => "");

    if (!upstream.ok) {
      return NextResponse.json(
        { error: "Falha ao enviar para automação", status: upstream.status, details: text },
        { status: 502 }
      );
    }

    // n8n pode responder texto ou JSON; devolvemos o que vier (sem forçar parse)
    return new NextResponse(text || "ok", {
      status: 200,
      headers: { "Content-Type": upstream.headers.get("content-type") ?? "text/plain; charset=utf-8" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro desconhecido";
    return NextResponse.json({ error: "Erro de rede ao contatar automação", details: msg }, { status: 502 });
  }
}











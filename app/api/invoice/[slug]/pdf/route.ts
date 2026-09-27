import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';

import { InvoicePdfDocument } from '@/components/invoices/pdf/InvoicePdfDocument';

import { requireAuthentication } from '@/lib/authentication/requireAuthentication';
import { prisma } from '@/lib/db/prisma';

import { getInvoiceBySlug } from '@/actions/invoices/getInvoiceBySlug';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface InvoicePdfRouteProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(_request: Request, { params }: InvoicePdfRouteProps) {
  const { user } = await requireAuthentication();

  const { slug } = await params;

  const invoiceResult = await getInvoiceBySlug(slug);

  if (!invoiceResult.success) {
    return new Response(invoiceResult.message, {
      status: 404,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  }

  const invoice = invoiceResult.invoice;

  const [businessProfile, currency] = await Promise.all([
    prisma.businessProfile.findUnique({
      where: {
        userId: user.id,
      },
    }),

    prisma.currency.findFirst({
      where: {
        userId: user.id,
        code: invoice.currency,
      },
      select: {
        code: true,
        name: true,
        symbol: true,
      },
    }),
  ]);

  const pdfBuffer = await renderToBuffer(
    React.createElement(InvoicePdfDocument, {
      invoice,
      businessProfile,
      currency,
    }),
  );

  return new Response(new Uint8Array(pdfBuffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="invoice-${invoice.invoiceNumber}.pdf"`,
      'Cache-Control': 'private, no-store',
    },
  });
}

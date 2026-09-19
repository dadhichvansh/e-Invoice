import { Invoices } from '@/components/invoices/Invoices';

import { requireAuthentication } from '@/lib/authentication/requireAuthentication';

import { getInvoices } from '@/actions/invoices/getInvoices';

export default async function InvoicesPage() {
  await requireAuthentication();

  const result = await getInvoices();

  return <Invoices invoices={result.invoices} />;
}

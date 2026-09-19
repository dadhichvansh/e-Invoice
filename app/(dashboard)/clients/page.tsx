import { Clients } from '@/components/clients/Clients';

import { requireAuthentication } from '@/lib/authentication/requireAuthentication';
import { prisma } from '@/lib/db/prisma';

export default async function ClientsPage() {
  const { user } = await requireAuthentication();

  const clients = await prisma.client.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return <Clients clients={clients} />;
}

import { requireAuthentication } from '@/lib/authentication/requireAuthentication';
import { prisma } from '@/lib/db/prisma';

import { BusinessProfileSettings } from '@/components/settings/business-profile/BusinessProfileSettings';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function BusinessProfilePage() {
  const { user } = await requireAuthentication();

  const businessProfile = await prisma.businessProfile.findUnique({
    where: {
      userId: user.id,
    },
  });

  return (
    <main className="p-9">
      <div className="w-full space-y-7">
        <Link
          href="/settings"
          className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3" />
          Back to Settings
        </Link>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Business Profile
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage the business information that appears on your invoices.
          </p>
        </div>

        <BusinessProfileSettings profile={businessProfile} />
      </div>
    </main>
  );
}

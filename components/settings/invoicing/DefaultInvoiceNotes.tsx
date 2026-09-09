import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface DefaultInvoiceNotesProps {
  value: string;
  onChange: (value: string) => void;
}

export function DefaultInvoiceNotes({
  value,
  onChange,
}: DefaultInvoiceNotesProps) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Default invoice notes
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Add notes that will be pre-filled on new invoices.
          </p>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-2">
          <Label htmlFor="default-notes">Notes</Label>

          <Textarea
            id="default-notes"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="e.g., Thank you for your business."
            rows={5}
          />
        </div>
      </CardContent>
    </Card>
  );
}

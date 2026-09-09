import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface InvoiceCategoriesProps {
  categories: {
    id: string;
    name: string;
    code: string;
    description: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }[];
}

export function InvoiceCategories({ categories }: InvoiceCategoriesProps) {
  const [newCategory, setNewCategory] = useState({
    name: '',
    code: '',
    description: '',
  });

  const handleAddCategory = () => {
    // Server action will be connected in the next step.
    console.log(newCategory);
  };

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Invoice categories
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Create categories that can be assigned to your invoices. Category
            codes are used when generating invoice numbers.
          </p>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-hidden rounded-xl border">
          <div className="overflow-x-auto">
            <Table className="min-w-180">
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead>Category name</TableHead>
                  <TableHead className="w-30">Code</TableHead>
                  <TableHead>Description</TableHead>

                  <TableHead className="w-14" />
                </TableRow>
              </TableHeader>

              <TableBody>
                {/* Existing categories */}
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <Input
                        value={category.name}
                        readOnly
                        className="h-9 bg-background"
                      />
                    </TableCell>

                    <TableCell>
                      <Input
                        value={category.code}
                        readOnly
                        className="h-9 bg-background font-mono text-xs uppercase"
                      />
                    </TableCell>

                    <TableCell>
                      <Input
                        value={category.description ?? ''}
                        readOnly
                        className="h-9 bg-background"
                      />
                    </TableCell>

                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-9 text-muted-foreground hover:text-destructive"
                        onClick={() => {
                          console.log('Delete category:', category.id);
                        }}
                      >
                        <Trash2 className="size-4" />

                        <span className="sr-only">Delete {category.name}</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {/* Add category */}
                <TableRow className="bg-muted/20 hover:bg-muted/20">
                  <TableCell>
                    <Input
                      value={newCategory.name}
                      onChange={(event) =>
                        setNewCategory((current) => ({
                          ...current,
                          name: event.target.value,
                        }))
                      }
                      placeholder="e.g., API Development"
                      className="h-9"
                    />
                  </TableCell>

                  <TableCell>
                    <Input
                      value={newCategory.code}
                      onChange={(event) =>
                        setNewCategory((current) => ({
                          ...current,
                          code: event.target.value.toUpperCase(),
                        }))
                      }
                      placeholder="e.g., API"
                      className="h-9 text-xs"
                      maxLength={3}
                    />
                  </TableCell>

                  <TableCell>
                    <Input
                      value={newCategory.description}
                      onChange={(event) =>
                        setNewCategory((current) => ({
                          ...current,
                          description: event.target.value,
                        }))
                      }
                      placeholder="e.g., API development services"
                      className="h-9"
                    />
                  </TableCell>

                  <TableCell>
                    <Button
                      type="button"
                      size="icon"
                      className="size-9 rounded-full"
                      onClick={handleAddCategory}
                    >
                      <Plus className="size-4" />

                      <span className="sr-only">Add category</span>
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

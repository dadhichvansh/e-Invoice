import { Check, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

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
import {
  createInvoiceCategory,
  updateInvoiceCategory,
} from '@/actions/settings/invoicing/invoiceCategory';
import { DeleteInvoiceCategoryDialog } from './DeleteInvoiceCategoryDialog';

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

  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null,
  );

  const [editingCategory, setEditingCategory] = useState({
    name: '',
    code: '',
    description: '',
  });

  const [deleteCategory, setDeleteCategory] = useState<
    (typeof categories)[number] | null
  >(null);

  const handleAddCategory = async () => {
    const result = await createInvoiceCategory(newCategory);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    setNewCategory({
      name: '',
      code: '',
      description: '',
    });

    toast.success(result.message);
  };

  const handleEditCategory = (category: (typeof categories)[number]) => {
    setEditingCategoryId(category.id);

    setEditingCategory({
      name: category.name,
      code: category.code,
      description: category.description ?? '',
    });
  };

  const handleUpdateCategory = async () => {
    if (!editingCategoryId) {
      return;
    }

    const result = await updateInvoiceCategory(
      editingCategoryId,
      editingCategory,
    );

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    setEditingCategoryId(null);

    setEditingCategory({
      name: '',
      code: '',
      description: '',
    });

    toast.success(result.message);
  };

  return (
    <>
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
                          value={
                            editingCategoryId === category.id
                              ? editingCategory.name
                              : category.name
                          }
                          readOnly={editingCategoryId !== category.id}
                          onChange={(event) =>
                            editingCategoryId === category.id &&
                            setEditingCategory((current) => ({
                              ...current,
                              name: event.target.value,
                            }))
                          }
                          className="h-9 bg-background"
                        />
                      </TableCell>

                      <TableCell>
                        <Input
                          value={
                            editingCategoryId === category.id
                              ? editingCategory.code
                              : category.code
                          }
                          readOnly={editingCategoryId !== category.id}
                          onChange={(event) =>
                            editingCategoryId === category.id &&
                            setEditingCategory((current) => ({
                              ...current,
                              code: event.target.value.toUpperCase(),
                            }))
                          }
                          className="h-9 bg-background text-xs uppercase"
                          maxLength={10}
                        />
                      </TableCell>

                      <TableCell>
                        <Input
                          value={
                            editingCategoryId === category.id
                              ? editingCategory.description
                              : (category.description ?? '')
                          }
                          readOnly={editingCategoryId !== category.id}
                          onChange={(event) =>
                            editingCategoryId === category.id &&
                            setEditingCategory((current) => ({
                              ...current,
                              description: event.target.value,
                            }))
                          }
                          className="h-9 bg-background"
                        />
                      </TableCell>

                      <TableCell>
                        {editingCategoryId === category.id ? (
                          <div className="flex items-center gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="size-9 text-muted-foreground hover:text-foreground"
                              onClick={handleUpdateCategory}
                            >
                              <Check className="size-4" />

                              <span className="sr-only">
                                Save {category.name}
                              </span>
                            </Button>

                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="size-9 text-muted-foreground hover:text-destructive"
                              onClick={() => {
                                setEditingCategoryId(null);
                                setEditingCategory({
                                  name: '',
                                  code: '',
                                  description: '',
                                });
                              }}
                            >
                              <X className="size-4" />

                              <span className="sr-only">
                                Cancel editing {category.name}
                              </span>
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="size-9 text-muted-foreground hover:text-foreground"
                              onClick={() => handleEditCategory(category)}
                            >
                              <Pencil className="size-4" />

                              <span className="sr-only">
                                Edit {category.name}
                              </span>
                            </Button>

                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="size-9 text-muted-foreground hover:text-destructive"
                              onClick={() => setDeleteCategory(category)}
                            >
                              <Trash2 className="size-4" />

                              <span className="sr-only">
                                Delete {category.name}
                              </span>
                            </Button>
                          </div>
                        )}
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

      <DeleteInvoiceCategoryDialog
        open={deleteCategory !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteCategory(null);
          }
        }}
        categoryId={deleteCategory?.id ?? ''}
        categoryName={deleteCategory?.name ?? ''}
      />
    </>
  );
}

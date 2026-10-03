'use client';

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

import { DeleteInvoiceCategoryDialog } from './DeleteInvoiceCategoryDialog';

import {
  createInvoiceCategory,
  updateInvoiceCategory,
} from '@/actions/settings/invoicing/invoiceCategory';

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

interface CategoryFormData {
  name: string;
  code: string;
  description: string;
}

type CategoryField = keyof CategoryFormData;

type CategoryErrors = Partial<Record<CategoryField, string | undefined>>;

const emptyCategory: CategoryFormData = {
  name: '',
  code: '',
  description: '',
};

export function InvoiceCategories({ categories }: InvoiceCategoriesProps) {
  const [newCategory, setNewCategory] =
    useState<CategoryFormData>(emptyCategory);

  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null,
  );

  const [editingCategory, setEditingCategory] =
    useState<CategoryFormData>(emptyCategory);

  const [newCategoryErrors, setNewCategoryErrors] = useState<CategoryErrors>(
    {},
  );

  const [editingCategoryErrors, setEditingCategoryErrors] =
    useState<CategoryErrors>({});

  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [deleteCategory, setDeleteCategory] = useState<
    (typeof categories)[number] | null
  >(null);

  const handleNewCategoryChange = (field: CategoryField, value: string) => {
    setNewCategory((current) => ({
      ...current,
      [field]: value,
    }));

    if (newCategoryErrors[field]) {
      setNewCategoryErrors((current) => ({
        ...current,
        [field]: undefined,
      }));
    }
  };

  const handleEditingCategoryChange = (field: CategoryField, value: string) => {
    setEditingCategory((current) => ({
      ...current,
      [field]: value,
    }));

    if (editingCategoryErrors[field]) {
      setEditingCategoryErrors((current) => ({
        ...current,
        [field]: undefined,
      }));
    }
  };

  const handleAddCategory = async () => {
    if (isAdding || isUpdating) {
      return;
    }

    setIsAdding(true);

    try {
      const result = await createInvoiceCategory(newCategory);

      if (!result.success) {
        setNewCategoryErrors(result.fieldErrors);
        toast.error(result.message);
        return;
      }

      setNewCategory(emptyCategory);
      setNewCategoryErrors({});

      toast.success(result.message);
    } finally {
      setIsAdding(false);
    }
  };

  const handleEditCategory = (category: (typeof categories)[number]) => {
    if (isAdding || isUpdating) {
      return;
    }

    setEditingCategoryId(category.id);

    setEditingCategory({
      name: category.name,
      code: category.code,
      description: category.description ?? '',
    });

    setEditingCategoryErrors({});
  };

  const handleUpdateCategory = async () => {
    if (!editingCategoryId || isUpdating || isAdding) {
      return;
    }

    setIsUpdating(true);

    try {
      const result = await updateInvoiceCategory(
        editingCategoryId,
        editingCategory,
      );

      if (!result.success) {
        setEditingCategoryErrors(result.fieldErrors);
        toast.error(result.message);
        return;
      }

      setEditingCategoryId(null);
      setEditingCategory(emptyCategory);
      setEditingCategoryErrors({});

      toast.success(result.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEditing = () => {
    if (isUpdating) {
      return;
    }

    setEditingCategoryId(null);
    setEditingCategory(emptyCategory);
    setEditingCategoryErrors({});
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
                  {categories.map((category) => {
                    const isEditing = editingCategoryId === category.id;

                    return (
                      <TableRow key={category.id}>
                        <TableCell>
                          <Input
                            value={
                              isEditing ? editingCategory.name : category.name
                            }
                            readOnly={!isEditing}
                            disabled={isUpdating || isAdding}
                            onChange={(event) =>
                              handleEditingCategoryChange(
                                'name',
                                event.target.value,
                              )
                            }
                            className="h-9 bg-background"
                            aria-invalid={
                              isEditing && !!editingCategoryErrors.name
                            }
                            aria-describedby={
                              isEditing && editingCategoryErrors.name
                                ? `category-${category.id}-name-error`
                                : undefined
                            }
                          />

                          {isEditing && editingCategoryErrors.name && (
                            <p
                              id={`category-${category.id}-name-error`}
                              className="mt-1 text-xs text-destructive"
                            >
                              {editingCategoryErrors.name}
                            </p>
                          )}
                        </TableCell>

                        <TableCell>
                          <Input
                            value={
                              isEditing ? editingCategory.code : category.code
                            }
                            readOnly={!isEditing}
                            disabled={isUpdating || isAdding}
                            onChange={(event) =>
                              handleEditingCategoryChange(
                                'code',
                                event.target.value.toUpperCase(),
                              )
                            }
                            className="h-9 bg-background text-xs uppercase"
                            maxLength={3}
                            aria-invalid={
                              isEditing && !!editingCategoryErrors.code
                            }
                            aria-describedby={
                              isEditing && editingCategoryErrors.code
                                ? `category-${category.id}-code-error`
                                : undefined
                            }
                          />

                          {isEditing && editingCategoryErrors.code && (
                            <p
                              id={`category-${category.id}-code-error`}
                              className="mt-1 text-xs text-destructive"
                            >
                              {editingCategoryErrors.code}
                            </p>
                          )}
                        </TableCell>

                        <TableCell>
                          <Input
                            value={
                              isEditing
                                ? editingCategory.description
                                : (category.description ?? '')
                            }
                            readOnly={!isEditing}
                            disabled={isUpdating || isAdding}
                            onChange={(event) =>
                              handleEditingCategoryChange(
                                'description',
                                event.target.value,
                              )
                            }
                            className="h-9 bg-background"
                            aria-invalid={
                              isEditing && !!editingCategoryErrors.description
                            }
                            aria-describedby={
                              isEditing && editingCategoryErrors.description
                                ? `category-${category.id}-description-error`
                                : undefined
                            }
                          />

                          {isEditing && editingCategoryErrors.description && (
                            <p
                              id={`category-${category.id}-description-error`}
                              className="mt-1 text-xs text-destructive"
                            >
                              {editingCategoryErrors.description}
                            </p>
                          )}
                        </TableCell>

                        <TableCell>
                          {isEditing ? (
                            <div className="flex items-center gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-9 text-muted-foreground hover:text-foreground"
                                onClick={handleUpdateCategory}
                                disabled={isUpdating || isAdding}
                              >
                                <Check className="size-4" />

                                <span className="sr-only">
                                  {isUpdating
                                    ? `Saving ${category.name}`
                                    : `Save ${category.name}`}
                                </span>
                              </Button>

                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-9 text-muted-foreground hover:text-destructive"
                                onClick={handleCancelEditing}
                                disabled={isUpdating}
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
                                disabled={isAdding || isUpdating}
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
                                disabled={isAdding || isUpdating}
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
                    );
                  })}

                  {/* Add category */}
                  <TableRow className="bg-muted/20 hover:bg-muted/20">
                    <TableCell>
                      <Input
                        value={newCategory.name}
                        onChange={(event) =>
                          handleNewCategoryChange('name', event.target.value)
                        }
                        placeholder="e.g. API Development"
                        className="h-9"
                        disabled={isAdding || isUpdating}
                        aria-invalid={!!newCategoryErrors.name}
                        aria-describedby={
                          newCategoryErrors.name
                            ? 'new-category-name-error'
                            : undefined
                        }
                      />

                      {newCategoryErrors.name && (
                        <p
                          id="new-category-name-error"
                          className="mt-1 text-xs text-destructive"
                        >
                          {newCategoryErrors.name}
                        </p>
                      )}
                    </TableCell>

                    <TableCell>
                      <Input
                        value={newCategory.code}
                        onChange={(event) =>
                          handleNewCategoryChange(
                            'code',
                            event.target.value.toUpperCase(),
                          )
                        }
                        placeholder="e.g. API"
                        className="h-9 text-xs"
                        maxLength={3}
                        disabled={isAdding || isUpdating}
                        aria-invalid={!!newCategoryErrors.code}
                        aria-describedby={
                          newCategoryErrors.code
                            ? 'new-category-code-error'
                            : undefined
                        }
                      />

                      {newCategoryErrors.code && (
                        <p
                          id="new-category-code-error"
                          className="mt-1 text-xs text-destructive"
                        >
                          {newCategoryErrors.code}
                        </p>
                      )}
                    </TableCell>

                    <TableCell>
                      <Input
                        value={newCategory.description}
                        onChange={(event) =>
                          handleNewCategoryChange(
                            'description',
                            event.target.value,
                          )
                        }
                        placeholder="e.g. API development services"
                        className="h-9"
                        disabled={isAdding || isUpdating}
                        aria-invalid={!!newCategoryErrors.description}
                        aria-describedby={
                          newCategoryErrors.description
                            ? 'new-category-description-error'
                            : undefined
                        }
                      />

                      {newCategoryErrors.description && (
                        <p
                          id="new-category-description-error"
                          className="mt-1 text-xs text-destructive"
                        >
                          {newCategoryErrors.description}
                        </p>
                      )}
                    </TableCell>

                    <TableCell className="p-5 flex items-center">
                      <Button
                        type="button"
                        size="icon"
                        className="size-9 rounded-full"
                        onClick={handleAddCategory}
                        disabled={isAdding || isUpdating}
                      >
                        <Plus className="size-4" />

                        <span className="sr-only">
                          {isAdding ? 'Adding category' : 'Add category'}
                        </span>
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

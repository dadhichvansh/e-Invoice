'use client';

import { Check, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import {
  createCurrency,
  updateCurrency,
} from '@/actions/settings/invoicing/currency';

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

import { DeleteCurrencyDialog } from './DeleteCurrencyDialog';

interface CurrencySettingsProps {
  currencies: {
    id: string;
    code: string;
    name: string;
    symbol: string;
  }[];
}

interface CurrencyFormData {
  name: string;
  code: string;
  symbol: string;
}

type CurrencyField = keyof CurrencyFormData;

type CurrencyErrors = Partial<Record<CurrencyField, string | undefined>>;

const emptyCurrency: CurrencyFormData = {
  name: '',
  code: '',
  symbol: '',
};

export function CurrencySettings({
  currencies: initialCurrencies,
}: CurrencySettingsProps) {
  const [currencies, setCurrencies] = useState(initialCurrencies);

  const [newCurrency, setNewCurrency] =
    useState<CurrencyFormData>(emptyCurrency);

  const [editingCurrencyId, setEditingCurrencyId] = useState<string | null>(
    null,
  );

  const [editingCurrency, setEditingCurrency] =
    useState<CurrencyFormData>(emptyCurrency);

  const [newCurrencyErrors, setNewCurrencyErrors] = useState<CurrencyErrors>(
    {},
  );

  const [editingCurrencyErrors, setEditingCurrencyErrors] =
    useState<CurrencyErrors>({});

  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [deleteCurrency, setDeleteCurrency] = useState<
    (typeof currencies)[number] | null
  >(null);

  const handleNewCurrencyChange = (field: CurrencyField, value: string) => {
    setNewCurrency((current) => ({
      ...current,
      [field]: value,
    }));

    if (newCurrencyErrors[field]) {
      setNewCurrencyErrors((current) => ({
        ...current,
        [field]: undefined,
      }));
    }
  };

  const handleEditingCurrencyChange = (field: CurrencyField, value: string) => {
    setEditingCurrency((current) => ({
      ...current,
      [field]: value,
    }));

    if (editingCurrencyErrors[field]) {
      setEditingCurrencyErrors((current) => ({
        ...current,
        [field]: undefined,
      }));
    }
  };

  const handleAddCurrency = async () => {
    if (isAdding || isUpdating) {
      return;
    }

    setIsAdding(true);

    try {
      const result = await createCurrency(newCurrency);

      if (!result.success) {
        setNewCurrencyErrors(result.fieldErrors);
        toast.error(result.message);
        return;
      }

      if (!result.currency) {
        toast.error('Currency details could not be retrieved.');
        return;
      }

      setNewCurrency(emptyCurrency);
      setNewCurrencyErrors({});

      setCurrencies((currentCurrencies) => [
        ...currentCurrencies,
        result.currency!,
      ]);

      toast.success(result.message);
    } finally {
      setIsAdding(false);
    }
  };

  const handleEditCurrency = (currency: (typeof currencies)[number]) => {
    if (isAdding || isUpdating) {
      return;
    }

    setEditingCurrencyId(currency.id);

    setEditingCurrency({
      name: currency.name,
      code: currency.code,
      symbol: currency.symbol,
    });

    setEditingCurrencyErrors({});
  };

  const handleUpdateCurrency = async () => {
    if (!editingCurrencyId || isUpdating || isAdding) {
      return;
    }

    setIsUpdating(true);

    try {
      const result = await updateCurrency(editingCurrencyId, editingCurrency);

      if (!result.success) {
        setEditingCurrencyErrors(result.fieldErrors);
        toast.error(result.message);
        return;
      }

      if (!result.currency) {
        toast.error('Currency details could not be retrieved.');
        return;
      }

      setCurrencies((currentCurrencies) =>
        currentCurrencies.map((currency) =>
          currency.id === editingCurrencyId ? result.currency! : currency,
        ),
      );

      setEditingCurrencyId(null);
      setEditingCurrency(emptyCurrency);
      setEditingCurrencyErrors({});

      toast.success(result.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEditing = () => {
    if (isUpdating) {
      return;
    }

    setEditingCurrencyId(null);
    setEditingCurrency(emptyCurrency);
    setEditingCurrencyErrors({});
  };

  return (
    <>
      <Card className="rounded-2xl">
        <CardHeader>
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Currencies
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Add currencies that can be used when creating invoices.
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-hidden rounded-xl border">
            <div className="overflow-x-auto">
              <Table className="min-w-180">
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead>Symbol</TableHead>
                    <TableHead className="w-30">Code</TableHead>
                    <TableHead>Currency name</TableHead>
                    <TableHead className="w-14" />
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {currencies.map((currency) => {
                    const isEditing = editingCurrencyId === currency.id;

                    return (
                      <TableRow key={currency.id}>
                        <TableCell>
                          <Input
                            value={
                              isEditing
                                ? editingCurrency.symbol
                                : currency.symbol
                            }
                            readOnly={!isEditing}
                            disabled={isAdding || isUpdating}
                            onChange={(event) =>
                              handleEditingCurrencyChange(
                                'symbol',
                                event.target.value,
                              )
                            }
                            className="h-9 bg-background"
                            maxLength={10}
                            aria-invalid={
                              isEditing && !!editingCurrencyErrors.symbol
                            }
                            aria-describedby={
                              isEditing && editingCurrencyErrors.symbol
                                ? `currency-${currency.id}-symbol-error`
                                : undefined
                            }
                          />

                          {isEditing && editingCurrencyErrors.symbol && (
                            <p
                              id={`currency-${currency.id}-symbol-error`}
                              className="mt-1 text-xs text-destructive"
                            >
                              {editingCurrencyErrors.symbol}
                            </p>
                          )}
                        </TableCell>

                        <TableCell>
                          <Input
                            value={
                              isEditing ? editingCurrency.code : currency.code
                            }
                            readOnly={!isEditing}
                            disabled={isAdding || isUpdating}
                            onChange={(event) =>
                              handleEditingCurrencyChange(
                                'code',
                                event.target.value.toUpperCase(),
                              )
                            }
                            className="h-9 bg-background text-xs uppercase"
                            maxLength={3}
                            aria-invalid={
                              isEditing && !!editingCurrencyErrors.code
                            }
                            aria-describedby={
                              isEditing && editingCurrencyErrors.code
                                ? `currency-${currency.id}-code-error`
                                : undefined
                            }
                          />

                          {isEditing && editingCurrencyErrors.code && (
                            <p
                              id={`currency-${currency.id}-code-error`}
                              className="mt-1 text-xs text-destructive"
                            >
                              {editingCurrencyErrors.code}
                            </p>
                          )}
                        </TableCell>

                        <TableCell>
                          <Input
                            value={
                              isEditing ? editingCurrency.name : currency.name
                            }
                            readOnly={!isEditing}
                            disabled={isAdding || isUpdating}
                            onChange={(event) =>
                              handleEditingCurrencyChange(
                                'name',
                                event.target.value,
                              )
                            }
                            className="h-9 bg-background"
                            aria-invalid={
                              isEditing && !!editingCurrencyErrors.name
                            }
                            aria-describedby={
                              isEditing && editingCurrencyErrors.name
                                ? `currency-${currency.id}-name-error`
                                : undefined
                            }
                          />

                          {isEditing && editingCurrencyErrors.name && (
                            <p
                              id={`currency-${currency.id}-name-error`}
                              className="mt-1 text-xs text-destructive"
                            >
                              {editingCurrencyErrors.name}
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
                                onClick={handleUpdateCurrency}
                                disabled={isUpdating || isAdding}
                              >
                                <Check className="size-4" />

                                <span className="sr-only">
                                  {isUpdating
                                    ? `Saving ${currency.name}`
                                    : `Save ${currency.name}`}
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
                                  Cancel editing {currency.name}
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
                                onClick={() => handleEditCurrency(currency)}
                                disabled={isAdding || isUpdating}
                              >
                                <Pencil className="size-4" />

                                <span className="sr-only">
                                  Edit {currency.name}
                                </span>
                              </Button>

                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-9 text-muted-foreground hover:text-destructive"
                                onClick={() => setDeleteCurrency(currency)}
                                disabled={isAdding || isUpdating}
                              >
                                <Trash2 className="size-4" />

                                <span className="sr-only">
                                  Delete {currency.name}
                                </span>
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}

                  <TableRow className="bg-muted/20 hover:bg-muted/20">
                    <TableCell>
                      <Input
                        value={newCurrency.symbol}
                        onChange={(event) =>
                          handleNewCurrencyChange('symbol', event.target.value)
                        }
                        placeholder="e.g. ₹"
                        className="h-9"
                        maxLength={10}
                        disabled={isAdding || isUpdating}
                        aria-invalid={!!newCurrencyErrors.symbol}
                        aria-describedby={
                          newCurrencyErrors.symbol
                            ? 'new-currency-symbol-error'
                            : undefined
                        }
                      />

                      {newCurrencyErrors.symbol && (
                        <p
                          id="new-currency-symbol-error"
                          className="mt-1 text-xs text-destructive"
                        >
                          {newCurrencyErrors.symbol}
                        </p>
                      )}
                    </TableCell>

                    <TableCell>
                      <Input
                        value={newCurrency.code}
                        onChange={(event) =>
                          handleNewCurrencyChange(
                            'code',
                            event.target.value.toUpperCase(),
                          )
                        }
                        placeholder="e.g. INR"
                        className="h-9 text-xs"
                        maxLength={3}
                        disabled={isAdding || isUpdating}
                        aria-invalid={!!newCurrencyErrors.code}
                        aria-describedby={
                          newCurrencyErrors.code
                            ? 'new-currency-code-error'
                            : undefined
                        }
                      />

                      {newCurrencyErrors.code && (
                        <p
                          id="new-currency-code-error"
                          className="mt-1 text-xs text-destructive"
                        >
                          {newCurrencyErrors.code}
                        </p>
                      )}
                    </TableCell>

                    <TableCell>
                      <Input
                        value={newCurrency.name}
                        onChange={(event) =>
                          handleNewCurrencyChange('name', event.target.value)
                        }
                        placeholder="e.g. Indian Rupee"
                        className="h-9"
                        disabled={isAdding || isUpdating}
                        aria-invalid={!!newCurrencyErrors.name}
                        aria-describedby={
                          newCurrencyErrors.name
                            ? 'new-currency-name-error'
                            : undefined
                        }
                      />

                      {newCurrencyErrors.name && (
                        <p
                          id="new-currency-name-error"
                          className="mt-1 text-xs text-destructive"
                        >
                          {newCurrencyErrors.name}
                        </p>
                      )}
                    </TableCell>

                    <TableCell className="p-5 flex items-center">
                      <Button
                        type="button"
                        size="icon"
                        className="size-9 rounded-full"
                        onClick={handleAddCurrency}
                        disabled={isAdding || isUpdating}
                      >
                        <Plus className="size-4" />

                        <span className="sr-only">
                          {isAdding ? 'Adding currency' : 'Add currency'}
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

      <DeleteCurrencyDialog
        open={deleteCurrency !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteCurrency(null);
          }
        }}
        currencyId={deleteCurrency?.id ?? ''}
        currencyName={deleteCurrency?.name ?? ''}
        onDeleted={(currencyId) => {
          setCurrencies((currentCurrencies) =>
            currentCurrencies.filter((currency) => currency.id !== currencyId),
          );

          if (editingCurrencyId === currencyId) {
            setEditingCurrencyId(null);
            setEditingCurrency(emptyCurrency);
            setEditingCurrencyErrors({});
          }
        }}
      />
    </>
  );
}

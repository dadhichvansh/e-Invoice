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

export function CurrencySettings({
  currencies: initialCurrencies,
}: CurrencySettingsProps) {
  const [currencies, setCurrencies] = useState(initialCurrencies);

  const [newCurrency, setNewCurrency] = useState({
    name: '',
    code: '',
    symbol: '',
  });

  const [editingCurrencyId, setEditingCurrencyId] = useState<string | null>(
    null,
  );

  const [editingCurrency, setEditingCurrency] = useState({
    name: '',
    code: '',
    symbol: '',
  });

  const [deleteCurrency, setDeleteCurrency] = useState<
    (typeof currencies)[number] | null
  >(null);

  const handleAddCurrency = async () => {
    const result = await createCurrency(newCurrency);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    if (!result.currency) {
      toast.error('Currency details could not be retrieved.');
      return;
    }

    setNewCurrency({
      name: '',
      code: '',
      symbol: '',
    });

    setCurrencies((currentCurrencies) => [
      ...currentCurrencies,
      result.currency,
    ]);

    toast.success(result.message);
  };

  const handleEditCurrency = (currency: (typeof currencies)[number]) => {
    setEditingCurrencyId(currency.id);

    setEditingCurrency({
      name: currency.name,
      code: currency.code,
      symbol: currency.symbol,
    });
  };

  const handleUpdateCurrency = async () => {
    if (!editingCurrencyId) {
      return;
    }

    const result = await updateCurrency(editingCurrencyId, editingCurrency);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    if (!result.currency) {
      toast.error('Currency details could not be retrieved.');
      return;
    }

    setCurrencies((currentCurrencies) =>
      currentCurrencies.map((currency) =>
        currency.id === editingCurrencyId ? result.currency : currency,
      ),
    );

    setEditingCurrencyId(null);

    setEditingCurrency({
      name: '',
      code: '',
      symbol: '',
    });

    toast.success(result.message);
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
                  {currencies.map((currency) => (
                    <TableRow key={currency.id}>
                      <TableCell>
                        <Input
                          value={
                            editingCurrencyId === currency.id
                              ? editingCurrency.symbol
                              : currency.symbol
                          }
                          readOnly={editingCurrencyId !== currency.id}
                          onChange={(event) =>
                            editingCurrencyId === currency.id &&
                            setEditingCurrency((current) => ({
                              ...current,
                              symbol: event.target.value,
                            }))
                          }
                          className="h-9 bg-background"
                          maxLength={10}
                        />
                      </TableCell>

                      <TableCell>
                        <Input
                          value={
                            editingCurrencyId === currency.id
                              ? editingCurrency.code
                              : currency.code
                          }
                          readOnly={editingCurrencyId !== currency.id}
                          onChange={(event) =>
                            editingCurrencyId === currency.id &&
                            setEditingCurrency((current) => ({
                              ...current,
                              code: event.target.value.toUpperCase(),
                            }))
                          }
                          className="h-9 bg-background text-xs uppercase"
                          maxLength={3}
                        />
                      </TableCell>

                      <TableCell>
                        <Input
                          value={
                            editingCurrencyId === currency.id
                              ? editingCurrency.name
                              : currency.name
                          }
                          readOnly={editingCurrencyId !== currency.id}
                          onChange={(event) =>
                            editingCurrencyId === currency.id &&
                            setEditingCurrency((current) => ({
                              ...current,
                              name: event.target.value,
                            }))
                          }
                          className="h-9 bg-background"
                        />
                      </TableCell>

                      <TableCell>
                        {editingCurrencyId === currency.id ? (
                          <div className="flex items-center gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="size-9 text-muted-foreground hover:text-foreground"
                              onClick={handleUpdateCurrency}
                            >
                              <Check className="size-4" />

                              <span className="sr-only">
                                Save {currency.name}
                              </span>
                            </Button>

                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="size-9 text-muted-foreground hover:text-destructive"
                              onClick={() => {
                                setEditingCurrencyId(null);

                                setEditingCurrency({
                                  name: '',
                                  code: '',
                                  symbol: '',
                                });
                              }}
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
                  ))}

                  <TableRow className="bg-muted/20 hover:bg-muted/20">
                    <TableCell>
                      <Input
                        value={newCurrency.symbol}
                        onChange={(event) =>
                          setNewCurrency((current) => ({
                            ...current,
                            symbol: event.target.value,
                          }))
                        }
                        placeholder="e.g., ₹"
                        className="h-9"
                        maxLength={10}
                      />
                    </TableCell>

                    <TableCell>
                      <Input
                        value={newCurrency.code}
                        onChange={(event) =>
                          setNewCurrency((current) => ({
                            ...current,
                            code: event.target.value.toUpperCase(),
                          }))
                        }
                        placeholder="e.g., INR"
                        className="h-9 text-xs"
                        maxLength={3}
                      />
                    </TableCell>

                    <TableCell>
                      <Input
                        value={newCurrency.name}
                        onChange={(event) =>
                          setNewCurrency((current) => ({
                            ...current,
                            name: event.target.value,
                          }))
                        }
                        placeholder="e.g., Indian Rupee"
                        className="h-9"
                      />
                    </TableCell>

                    <TableCell>
                      <Button
                        type="button"
                        size="icon"
                        className="size-9 rounded-full"
                        onClick={handleAddCurrency}
                      >
                        <Plus className="size-4" />

                        <span className="sr-only">Add currency</span>
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

            setEditingCurrency({
              name: '',
              code: '',
              symbol: '',
            });
          }
        }}
      />
    </>
  );
}

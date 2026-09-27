import {
  Document,
  Page,
  Text,
  View,
  type DocumentProps,
} from '@react-pdf/renderer';

import { styles } from './styles';

type InvoicePdfDocumentProps = DocumentProps & {
  invoice: {
    invoiceNumber: string;
    status: string;
    invoiceDate: Date;
    dueDate: Date;
    currency: string;
    projectName: string | null;
    projectDescription: string | null;
    discountPercentage: number;
    paymentReference: string | null;
    notes: string | null;
    terms: string | null;
    subtotal: number;
    discountAmount: number;
    grandTotal: number;
    clientName: string;
    clientEmail: string | null;
    clientCompany: string | null;
    clientPhone: string | null;
    clientAddress: string | null;
    clientCity: string | null;
    clientState: string | null;
    clientPostalCode: string | null;
    clientCountry: string | null;
    paymentMethodName: string | null;
    paymentMethodType:
      | 'BANK_TRANSFER'
      | 'UPI'
      | 'PAYPAL'
      | 'WISE'
      | 'OTHER'
      | null;
    paymentMethodDetails: unknown;
    invoiceCategoryName: string | null;
    invoiceCategoryCode: string | null;
    items: {
      id: string;
      description: string;
      quantity: number;
      rate: number;
      amount: number;
      sortOrder: number;
    }[];
  };

  businessProfile: {
    businessName: string | null;
    email: string | null;
    phone: string | null;
    website: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    postalCode: string | null;
  } | null;

  currency: {
    code: string;
    name: string;
    symbol: string;
  } | null;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

function formatMoney(
  amount: number,
  currencyCode: string,
  currencySymbol?: string,
) {
  if (currencySymbol) {
    return `${currencySymbol}${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatPaymentDetailLabel(key: string) {
  if (key.toLowerCase() === 'ifsc') {
    return 'IFSC';
  }

  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatPaymentMethodType(
  type: InvoicePdfDocumentProps['invoice']['paymentMethodType'],
) {
  if (!type) {
    return 'Not specified';
  }

  return type
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getPaymentDetails(details: unknown) {
  if (!details || typeof details !== 'object' || Array.isArray(details)) {
    return [];
  }

  return Object.entries(details).filter(
    ([, value]) =>
      value !== null && value !== undefined && String(value).trim() !== '',
  );
}

export function InvoicePdfDocument({
  invoice,
  businessProfile,
  currency,
  ...documentProps
}: InvoicePdfDocumentProps) {
  const paymentDetails = getPaymentDetails(invoice.paymentMethodDetails);

  return (
    <Document {...documentProps}>
      <Page size="A4" orientation="portrait" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View style={styles.businessSection}>
              <Text style={styles.eyebrow}>INVOICE</Text>

              <Text style={styles.businessName}>
                {businessProfile?.businessName || 'Your Business'}
              </Text>

              {businessProfile?.address && (
                <Text style={styles.contactText}>
                  {businessProfile.address}
                </Text>
              )}

              {(businessProfile?.city ||
                businessProfile?.state ||
                businessProfile?.postalCode ||
                businessProfile?.country) && (
                <Text style={styles.contactText}>
                  {[
                    businessProfile.city,
                    businessProfile.state,
                    businessProfile.postalCode,
                    businessProfile.country,
                  ]
                    .filter(Boolean)
                    .join(', ')}
                </Text>
              )}

              {businessProfile?.email && (
                <Text style={styles.contactText}>{businessProfile.email}</Text>
              )}

              {businessProfile?.phone && (
                <Text style={styles.contactText}>{businessProfile.phone}</Text>
              )}

              {businessProfile?.website && (
                <Text style={styles.contactText}>
                  {businessProfile.website}
                </Text>
              )}
            </View>

            <View style={styles.invoiceMetaSection}>
              <Text style={styles.metaLabel}>INVOICE #</Text>
              <Text style={styles.metaValue}>{invoice.invoiceNumber}</Text>

              <Text style={styles.metaLabel}>ISSUE DATE</Text>
              <Text style={styles.metaValue}>
                {formatDate(invoice.invoiceDate)}
              </Text>

              <Text style={styles.metaLabel}>DUE DATE</Text>
              <Text style={styles.metaValue}>
                {formatDate(invoice.dueDate)}
              </Text>

              {invoice.invoiceCategoryName && (
                <>
                  <Text style={styles.metaLabel}>CATEGORY</Text>
                  <Text style={styles.categoryText}>
                    {invoice.invoiceCategoryName}
                  </Text>
                </>
              )}
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <View style={styles.sectionColumn}>
              <Text style={styles.sectionTitle}>BILLED TO</Text>

              <Text style={styles.sectionPrimaryText}>
                {invoice.clientName}
              </Text>

              {invoice.clientCompany && (
                <Text style={styles.sectionText}>{invoice.clientCompany}</Text>
              )}

              {invoice.clientEmail && (
                <Text style={styles.sectionText}>{invoice.clientEmail}</Text>
              )}

              {invoice.clientPhone && (
                <Text style={styles.sectionText}>{invoice.clientPhone}</Text>
              )}

              {(invoice.clientAddress ||
                invoice.clientCity ||
                invoice.clientState ||
                invoice.clientPostalCode ||
                invoice.clientCountry) && (
                <Text style={styles.sectionText}>
                  {[
                    invoice.clientAddress,
                    invoice.clientCity,
                    invoice.clientState,
                    invoice.clientPostalCode,
                    invoice.clientCountry,
                  ]
                    .filter(Boolean)
                    .join(', ')}
                </Text>
              )}
            </View>

            <View style={styles.sectionDivider} />

            <View style={styles.sectionColumn}>
              <Text style={styles.sectionTitle}>PROJECT</Text>

              {invoice.projectName ? (
                <Text style={styles.sectionPrimaryText}>
                  {invoice.projectName}
                </Text>
              ) : (
                <Text style={styles.sectionText}>No project specified</Text>
              )}

              {invoice.projectDescription && (
                <Text style={styles.sectionText}>
                  {invoice.projectDescription}
                </Text>
              )}
            </View>
          </View>
        </View>

        <View style={styles.itemsSection}>
          <Text style={styles.sectionTitle}>ITEMS</Text>

          <View style={styles.itemsTable}>
            <View style={styles.tableHeader} fixed>
              <View style={styles.descriptionColumn}>
                <Text style={styles.tableHeaderText}>DESCRIPTION</Text>
              </View>

              <View style={styles.quantityColumn}>
                <Text style={styles.tableHeaderText}>QTY</Text>
              </View>

              <View style={styles.rateColumn}>
                <Text style={styles.tableHeaderText}>RATE</Text>
              </View>

              <View style={styles.amountColumn}>
                <Text style={styles.tableHeaderText}>AMOUNT</Text>
              </View>
            </View>

            {invoice.items.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.tableRow,
                  index === invoice.items.length - 1
                    ? styles.tableRowLast
                    : undefined,
                ]}
              >
                <View style={styles.descriptionColumn}>
                  <Text style={styles.tableCellText}>{item.description}</Text>
                </View>

                <View style={styles.quantityColumn}>
                  <Text style={styles.tableCellMuted}>{item.quantity}</Text>
                </View>

                <View style={styles.rateColumn}>
                  <Text style={styles.tableCellMuted}>
                    {formatMoney(item.rate, invoice.currency, currency?.symbol)}
                  </Text>
                </View>

                <View style={styles.amountColumn}>
                  <Text style={styles.tableAmountText}>
                    {formatMoney(
                      item.amount,
                      invoice.currency,
                      currency?.symbol,
                    )}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.totalsSection}>
          <View style={styles.totalsContainer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>

              <Text style={styles.totalValue}>
                {formatMoney(
                  invoice.subtotal,
                  invoice.currency,
                  currency?.symbol,
                )}
              </Text>
            </View>

            {invoice.discountAmount > 0 && (
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>
                  Discount
                  {invoice.discountPercentage > 0
                    ? ` (${invoice.discountPercentage}%)`
                    : ''}
                </Text>

                <Text style={styles.totalValue}>
                  -
                  {formatMoney(
                    invoice.discountAmount,
                    invoice.currency,
                    currency?.symbol,
                  )}
                </Text>
              </View>
            )}

            <View style={styles.grandTotalRow}>
              <Text style={styles.grandTotalLabel}>GRAND TOTAL</Text>

              <Text style={styles.grandTotalValue}>
                {formatMoney(
                  invoice.grandTotal,
                  invoice.currency,
                  currency?.symbol,
                )}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.paymentSection}>
          <View style={styles.paymentRow}>
            <View style={styles.paymentColumn}>
              <Text style={styles.paymentTitle}>PAYMENT INFORMATION</Text>

              <View style={styles.paymentInfoRow}>
                <Text style={styles.paymentInfoLabel}>Type</Text>
                <Text style={styles.paymentInfoValue}>
                  {formatPaymentMethodType(invoice.paymentMethodType)}
                </Text>
              </View>

              {invoice.paymentReference && (
                <View style={styles.paymentInfoRow}>
                  <Text style={styles.paymentInfoLabel}>Reference</Text>

                  <Text style={styles.paymentInfoValue}>
                    {invoice.paymentReference}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.sectionDivider} />

            <View style={styles.paymentColumn}>
              <Text style={styles.paymentTitle}>PAYMENT DETAILS</Text>

              {paymentDetails.length > 0 ? (
                paymentDetails.map(([key, value]) => (
                  <View key={key} style={styles.paymentDetailRow}>
                    <Text style={styles.paymentDetailLabel}>
                      {formatPaymentDetailLabel(key)}
                    </Text>

                    <Text style={styles.paymentDetailValue}>
                      {String(value)}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.paymentDetailValue}>
                  No payment details available
                </Text>
              )}
            </View>
          </View>
        </View>

        {(invoice.notes || invoice.terms) && (
          <View style={styles.notesSection}>
            <View style={styles.notesRow}>
              {invoice.notes && (
                <View style={styles.notesColumn}>
                  <Text style={styles.notesTitle}>NOTES</Text>

                  <Text style={styles.notesText}>{invoice.notes}</Text>
                </View>
              )}

              {invoice.notes && invoice.terms && (
                <View style={styles.sectionDivider} />
              )}

              {invoice.terms && (
                <View style={styles.notesColumn}>
                  <Text style={styles.notesTitle}>TERMS &amp; CONDITIONS</Text>

                  <Text style={styles.notesText}>{invoice.terms}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Thank you for your business.</Text>

          <Text
            style={styles.footerPageText}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}

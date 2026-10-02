import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
  page: {
    paddingTop: 24,
    paddingRight: 24,
    paddingBottom: 48,
    paddingLeft: 24,
    fontFamily: 'Helvetica',
  },

  header: {
    padding: 10,
    backgroundColor: '#F5F5F5',
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 24,
  },

  businessSection: {
    flex: 1,
  },

  invoiceMetaSection: {
    width: 170,
    alignItems: 'flex-end',
  },

  eyebrow: {
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 1.2,
    color: '#18181B',
    marginBottom: 5,
  },

  businessName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#18181B',
    marginBottom: 7,
  },

  contactText: {
    fontSize: 8.5,
    color: '#71717A',
    marginBottom: 3,
  },

  headerContactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },

  headerContactIcon: {
    width: 16,
    paddingTop: 1,
  },

  headerContactText: {
    flex: 1,
    fontSize: 8.5,
    lineHeight: 1.35,
    color: '#71717A',
  },

  metaLabel: {
    fontSize: 7,
    color: '#71717A',
    marginBottom: 2,
  },

  metaValue: {
    fontSize: 9,
    fontWeight: 600,
    color: '#18181B',
    marginBottom: 7,
  },

  categoryText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#71717A',
  },

  section: {
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 20,
  },

  sectionRow: {
    flexDirection: 'row',
    gap: 24,
  },

  sectionColumn: {
    flex: 1,
  },

  sectionTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 0.8,
    color: '#66667D',
    marginBottom: 7,
  },

  sectionPrimaryText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#18181B',
    marginBottom: 4,
  },

  sectionText: {
    fontSize: 8.5,
    lineHeight: 1.35,
    color: '#71717A',
    marginBottom: 3,
  },

  clientInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },

  clientInfoIcon: {
    width: 16,
    paddingTop: 1,
  },

  clientInfoText: {
    flex: 1,
    fontSize: 8.5,
    lineHeight: 1.35,
    color: '#52525B',
  },

  sectionDivider: {
    width: 1,
  },

  itemsSection: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },

  itemsTable: {
    borderWidth: 1,
    borderColor: '#E4E4E7',
    borderRadius: 8,
    overflow: 'hidden',
  },

  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E7',
  },

  tableRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E7',
  },

  tableRowLast: {
    borderBottomWidth: 0,
  },

  descriptionColumn: {
    flex: 1,
    paddingRight: 12,
  },

  quantityColumn: {
    width: 55,
    alignItems: 'flex-end',
  },

  rateColumn: {
    width: 85,
    alignItems: 'flex-end',
  },

  amountColumn: {
    width: 95,
    alignItems: 'flex-end',
  },

  tableHeaderText: {
    fontSize: 7.5,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    color: '#71717A',
  },

  tableCellText: {
    fontSize: 8.5,
    lineHeight: 1.35,
    color: '#18181B',
  },

  tableCellMuted: {
    fontSize: 8.5,
    lineHeight: 1.35,
    color: '#52525B',
  },

  tableAmountText: {
    fontSize: 8.5,
    fontWeight: 'bold',
    color: '#18181B',
  },

  totalsSection: {
    paddingHorizontal: 10,
    paddingBottom: 20,
    alignItems: 'flex-end',
    borderBottomWidth: 0.12,
    borderBottomColor: '#66667D',
  },

  totalsContainer: {
    width: 250,
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },

  totalLabel: {
    fontSize: 8.5,
    color: '#71717A',
  },

  totalValue: {
    fontSize: 8.5,
    fontWeight: 'bold',
    color: '#18181B',
  },

  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: '#E4E4E7',
  },

  grandTotalLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#18181B',
  },

  grandTotalValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#18181B',
  },

  paymentSection: {
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 20,
  },

  paymentRow: {
    flexDirection: 'row',
    gap: 24,
  },

  paymentColumn: {
    flex: 1,
  },

  paymentTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 0.8,
    color: '#66667D',
    marginBottom: 8,
  },

  paymentInfoRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },

  paymentInfoLabel: {
    width: 90,
    fontSize: 8,
    color: '#71717A',
  },

  paymentInfoValue: {
    flex: 1,
    fontSize: 8,
    color: '#18181B',
  },

  paymentDetailRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },

  paymentDetailLabel: {
    width: 90,
    fontSize: 8,
    color: '#71717A',
  },

  paymentDetailValue: {
    flex: 1,
    fontSize: 8,
    color: '#18181B',
  },

  notesSection: {
    paddingHorizontal: 10,
    paddingTop: 30,
    paddingBottom: 20,
  },

  notesRow: {
    flexDirection: 'row',
    gap: 24,
  },

  notesColumn: {
    flex: 1,
  },

  notesTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 0.8,
    color: '#66667D',
    marginBottom: 7,
  },

  notesText: {
    fontSize: 8.5,
    lineHeight: 1.4,
    color: '#71717A',
  },

  footer: {
    position: 'absolute',
    bottom: 20,
    left: 24,
    right: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
  },

  footerText: {
    fontSize: 7.5,
    color: '#A1A1AA',
  },

  footerPageText: {
    fontSize: 7.5,
    color: '#A1A1AA',
  },
});

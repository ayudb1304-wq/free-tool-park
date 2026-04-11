"use client"

import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  type ChangeEvent,
} from "react"
import QRCode from "qrcode"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  PrinterIcon,
  Mail01Icon,
  Delete02Icon,
  Add01Icon,
  UserAdd01Icon,
  Copy01Icon,
  File01Icon,
} from "@hugeicons/core-free-icons"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useLocalStorage } from "@/hooks/use-local-storage"

// --- Currency catalog (40+ common currencies, covers ~95% of real-world use) ---
const CURRENCIES: { code: string; name: string; symbol: string }[] = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr" },
  { code: "DKK", name: "Danish Krone", symbol: "kr" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$" },
  { code: "MXN", name: "Mexican Peso", symbol: "$" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
  { code: "KRW", name: "South Korean Won", symbol: "₩" },
  { code: "TRY", name: "Turkish Lira", symbol: "₺" },
  { code: "RUB", name: "Russian Ruble", symbol: "₽" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼" },
  { code: "THB", name: "Thai Baht", symbol: "฿" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM" },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp" },
  { code: "PHP", name: "Philippine Peso", symbol: "₱" },
  { code: "VND", name: "Vietnamese Dong", symbol: "₫" },
  { code: "PLN", name: "Polish Zloty", symbol: "zł" },
  { code: "CZK", name: "Czech Koruna", symbol: "Kč" },
  { code: "HUF", name: "Hungarian Forint", symbol: "Ft" },
  { code: "ILS", name: "Israeli Shekel", symbol: "₪" },
  { code: "EGP", name: "Egyptian Pound", symbol: "E£" },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦" },
  { code: "PKR", name: "Pakistani Rupee", symbol: "₨" },
  { code: "BDT", name: "Bangladeshi Taka", symbol: "৳" },
  { code: "LKR", name: "Sri Lankan Rupee", symbol: "Rs" },
  { code: "ARS", name: "Argentine Peso", symbol: "$" },
  { code: "CLP", name: "Chilean Peso", symbol: "$" },
  { code: "COP", name: "Colombian Peso", symbol: "$" },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh" },
  { code: "TWD", name: "Taiwan Dollar", symbol: "NT$" },
]

// --- Types ---
interface LineItem {
  id: string
  description: string
  quantity: number
  rate: number
  taxRate: number
}

interface SavedClient {
  name: string
  address: string
  email: string
}

interface InvoiceData {
  // business
  businessName: string
  businessAddress: string
  businessEmail: string
  businessPhone: string
  businessTaxId: string
  logoDataUrl: string
  // client
  clientName: string
  clientAddress: string
  clientEmail: string
  // invoice meta
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  currency: string
  notes: string
  terms: string
  paymentDetails: string
  paymentLink: string
  // line items
  items: LineItem[]
  // discount
  discountType: "percent" | "fixed"
  discountValue: number
}

// --- Helpers ---
const newLineItem = (): LineItem => ({
  id:
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2, 10),
  description: "",
  quantity: 1,
  rate: 0,
  taxRate: 0,
})

const today = () => new Date().toISOString().slice(0, 10)

const daysFromNow = (n: number) => {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

const defaultData = (): InvoiceData => ({
  businessName: "",
  businessAddress: "",
  businessEmail: "",
  businessPhone: "",
  businessTaxId: "",
  logoDataUrl: "",
  clientName: "",
  clientAddress: "",
  clientEmail: "",
  invoiceNumber: "INV-0001",
  invoiceDate: today(),
  dueDate: daysFromNow(30),
  currency: "USD",
  notes: "",
  terms: "Payment due within 30 days.",
  paymentDetails: "",
  paymentLink: "",
  items: [newLineItem()],
  discountType: "percent",
  discountValue: 0,
})

function incrementInvoiceNumber(n: string): string {
  const match = n.match(/(\d+)(?!.*\d)/)
  if (!match || match.index === undefined) return `${n}-1`
  const numStr = match[0]
  const next = String(Number(numStr) + 1).padStart(numStr.length, "0")
  return n.slice(0, match.index) + next + n.slice(match.index + numStr.length)
}

interface Totals {
  subtotal: number
  itemTax: number
  discount: number
  total: number
}

// ---------------- MAIN COMPONENT ----------------
export default function InvoiceGenerator() {
  const [data, setData] = useLocalStorage<InvoiceData>(
    "invoice-generator-draft",
    defaultData()
  )
  const [clients, setClients] = useLocalStorage<SavedClient[]>(
    "invoice-generator-clients",
    []
  )
  const [qrDataUrl, setQrDataUrl] = useState("")
  const [message, setMessage] = useState("")

  const showMessage = useCallback((msg: string) => {
    setMessage(msg)
    window.setTimeout(() => setMessage(""), 3000)
  }, [])

  const currency = useMemo(
    () =>
      CURRENCIES.find((c) => c.code === data.currency) ?? CURRENCIES[0],
    [data.currency]
  )

  const fmtMoney = useCallback(
    (n: number) => {
      try {
        return new Intl.NumberFormat(undefined, {
          style: "currency",
          currency: currency.code,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(n)
      } catch {
        return `${currency.symbol}${n.toFixed(2)}`
      }
    },
    [currency]
  )

  const totals: Totals = useMemo(() => {
    const subtotal = data.items.reduce(
      (sum, it) => sum + it.quantity * it.rate,
      0
    )
    const itemTax = data.items.reduce(
      (sum, it) => sum + (it.quantity * it.rate * it.taxRate) / 100,
      0
    )
    const discount =
      data.discountType === "percent"
        ? (subtotal * data.discountValue) / 100
        : data.discountValue
    const total = Math.max(0, subtotal - discount + itemTax)
    return { subtotal, itemTax, discount, total }
  }, [data.items, data.discountType, data.discountValue])

  // Generate payment QR when paymentLink changes.
  // We intentionally do not reset qrDataUrl synchronously here; the preview
  // only renders the QR when data.paymentLink is truthy, so a stale value
  // stays hidden until the next non-empty link generates a fresh one.
  useEffect(() => {
    const link = data.paymentLink.trim()
    if (!link) return
    let cancelled = false
    QRCode.toDataURL(link, { width: 192, margin: 1 })
      .then((url) => {
        if (!cancelled) setQrDataUrl(url)
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl("")
      })
    return () => {
      cancelled = true
    }
  }, [data.paymentLink])

  // --- Update helpers ---
  const update = useCallback(
    <K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) => {
      setData((prev) => ({ ...prev, [key]: value }))
    },
    [setData]
  )

  const updateItem = useCallback(
    (id: string, patch: Partial<LineItem>) => {
      setData((prev) => ({
        ...prev,
        items: prev.items.map((it) =>
          it.id === id ? { ...it, ...patch } : it
        ),
      }))
    },
    [setData]
  )

  const addItem = useCallback(() => {
    setData((prev) => ({ ...prev, items: [...prev.items, newLineItem()] }))
  }, [setData])

  const removeItem = useCallback(
    (id: string) => {
      setData((prev) => ({
        ...prev,
        items:
          prev.items.length > 1
            ? prev.items.filter((it) => it.id !== id)
            : prev.items,
      }))
    },
    [setData]
  )

  // Logo upload. Stays in the browser as a data URL.
  const onLogoChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      if (file.size > 1024 * 1024) {
        showMessage("Logo too large. Please use an image under 1 MB.")
        e.target.value = ""
        return
      }
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setData((prev) => ({
            ...prev,
            logoDataUrl: reader.result as string,
          }))
        }
      }
      reader.readAsDataURL(file)
    },
    [setData, showMessage]
  )

  const saveClient = useCallback(() => {
    if (!data.clientName.trim()) {
      showMessage("Enter a client name before saving.")
      return
    }
    const exists = clients.find((c) => c.name === data.clientName.trim())
    if (exists) {
      showMessage(`Client "${data.clientName}" is already saved.`)
      return
    }
    setClients([
      ...clients,
      {
        name: data.clientName.trim(),
        address: data.clientAddress,
        email: data.clientEmail,
      },
    ])
    showMessage(`Saved client "${data.clientName}".`)
  }, [
    clients,
    setClients,
    showMessage,
    data.clientName,
    data.clientAddress,
    data.clientEmail,
  ])

  const loadClient = useCallback(
    (name: string) => {
      const c = clients.find((x) => x.name === name)
      if (!c) return
      setData((prev) => ({
        ...prev,
        clientName: c.name,
        clientAddress: c.address,
        clientEmail: c.email,
      }))
    },
    [clients, setData]
  )

  const newInvoice = useCallback(() => {
    setData((prev) => ({
      ...prev,
      invoiceNumber: incrementInvoiceNumber(prev.invoiceNumber),
      invoiceDate: today(),
      dueDate: daysFromNow(30),
      items: [newLineItem()],
      notes: "",
      clientName: "",
      clientAddress: "",
      clientEmail: "",
      discountValue: 0,
    }))
  }, [setData])

  const duplicateInvoice = useCallback(() => {
    setData((prev) => ({
      ...prev,
      invoiceNumber: incrementInvoiceNumber(prev.invoiceNumber),
      invoiceDate: today(),
      dueDate: daysFromNow(30),
    }))
    showMessage("Duplicated. Edit the new invoice then print or email.")
  }, [setData, showMessage])

  const handlePrint = () => {
    window.print()
  }

  const handleEmail = () => {
    if (!data.clientEmail) {
      showMessage("Add a client email to send the invoice.")
      return
    }
    const subject = encodeURIComponent(
      `Invoice ${data.invoiceNumber} from ${data.businessName || "me"}`
    )
    const body = encodeURIComponent(
      `Hi ${data.clientName || ""},\n\n` +
        `Please find invoice ${data.invoiceNumber} for ${fmtMoney(
          totals.total
        )} due by ${data.dueDate}.\n\n` +
        `Thank you,\n${data.businessName}`
    )
    window.location.href = `mailto:${data.clientEmail}?subject=${subject}&body=${body}`
  }

  return (
    <div className="space-y-6">
      {/*
        Print CSS: isolate the invoice document from the surrounding page.
        Uses the classic `visibility: hidden` trick: hide every element on the
        page, then re-enable visibility only on #invoice-doc and its
        descendants. This works regardless of what the outer tool page renders
        (H1, intro, FAQs, footer, etc.) without having to tag every ancestor
        with a .no-print class. Absolute positioning removes any sticky/grid
        offset the preview had on screen so it lands at the top of the page.
      */}
      <style>{`
        @media print {
          @page { margin: 14mm; }
          html, body { background: white !important; }
          body * { visibility: hidden !important; }
          #invoice-doc, #invoice-doc * { visibility: visible !important; }
          #invoice-doc {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            background: white !important;
            color: black !important;
          }
          #invoice-doc * { color: black !important; }
          #invoice-doc .invoice-muted { color: #555 !important; }
          /* On print, give the table real width so nothing is clipped */
          #invoice-doc .invoice-table-wrap { overflow: visible !important; }
          #invoice-doc .invoice-table { min-width: 0 !important; }
        }
      `}</style>

      {/* Action bar */}
      <div className="no-print flex flex-wrap items-center gap-2">
        <Button onClick={handlePrint}>
          <HugeiconsIcon icon={PrinterIcon} size={16} />
          Print / Save as PDF
        </Button>
        <Button variant="outline" onClick={handleEmail}>
          <HugeiconsIcon icon={Mail01Icon} size={16} />
          Email Invoice
        </Button>
        <Button variant="outline" onClick={duplicateInvoice}>
          <HugeiconsIcon icon={Copy01Icon} size={16} />
          Duplicate
        </Button>
        <Button variant="outline" onClick={newInvoice}>
          <HugeiconsIcon icon={File01Icon} size={16} />
          New Invoice
        </Button>
        <div className="ml-auto text-xs text-muted-foreground">
          Auto-saved to your browser · no signup, no uploads
        </div>
      </div>

      {message && (
        <div className="no-print rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-sm">
          {message}
        </div>
      )}

      <div className="invoice-print-root grid gap-6 lg:grid-cols-5">
        {/* FORM COLUMN */}
        <div className="no-print space-y-6 lg:col-span-3">
          {/* Business */}
          <Card>
            <CardHeader>
              <CardTitle>Your Business</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label>Business Name</Label>
                <Input
                  value={data.businessName}
                  onChange={(e) => update("businessName", e.target.value)}
                  placeholder="Acme Inc."
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={data.businessEmail}
                    onChange={(e) => update("businessEmail", e.target.value)}
                    placeholder="billing@acme.com"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Phone</Label>
                  <Input
                    value={data.businessPhone}
                    onChange={(e) => update("businessPhone", e.target.value)}
                    placeholder="+1 555 123 4567"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Address</Label>
                <Textarea
                  rows={2}
                  value={data.businessAddress}
                  onChange={(e) => update("businessAddress", e.target.value)}
                  placeholder="123 Market St, San Francisco, CA 94103"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Tax ID / VAT</Label>
                  <Input
                    value={data.businessTaxId}
                    onChange={(e) => update("businessTaxId", e.target.value)}
                    placeholder="Optional"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Logo</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={onLogoChange}
                    />
                    {data.logoDataUrl && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => update("logoDataUrl", "")}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Your logo stays on this device. It&apos;s never uploaded
                anywhere.
              </p>
            </CardContent>
          </Card>

          {/* Client */}
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle>Bill To</CardTitle>
                <div className="flex items-center gap-2">
                  {clients.length > 0 && (
                    <Select onValueChange={loadClient}>
                      <SelectTrigger className="h-9 w-40">
                        <SelectValue placeholder="Load client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map((c) => (
                          <SelectItem key={c.name} value={c.name}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={saveClient}
                  >
                    <HugeiconsIcon icon={UserAdd01Icon} size={14} />
                    Save Client
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label>Client Name</Label>
                <Input
                  value={data.clientName}
                  onChange={(e) => update("clientName", e.target.value)}
                  placeholder="Client or company name"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Client Email</Label>
                <Input
                  type="email"
                  value={data.clientEmail}
                  onChange={(e) => update("clientEmail", e.target.value)}
                  placeholder="client@example.com"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Client Address</Label>
                <Textarea
                  rows={2}
                  value={data.clientAddress}
                  onChange={(e) => update("clientAddress", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Invoice details */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Invoice #</Label>
                  <Input
                    value={data.invoiceNumber}
                    onChange={(e) => update("invoiceNumber", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Currency</Label>
                  <Select
                    value={data.currency}
                    onValueChange={(v) => update("currency", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-80">
                      {CURRENCIES.map((c) => (
                        <SelectItem key={c.code} value={c.code}>
                          {c.code} · {c.name} ({c.symbol})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Invoice Date</Label>
                  <Input
                    type="date"
                    value={data.invoiceDate}
                    onChange={(e) => update("invoiceDate", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={data.dueDate}
                    onChange={(e) => update("dueDate", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Line items */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Line Items</CardTitle>
                <Button variant="outline" size="sm" onClick={addItem}>
                  <HugeiconsIcon icon={Add01Icon} size={14} />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {data.items.map((item, idx) => (
                <div
                  key={item.id}
                  className="space-y-2 rounded-2xl border bg-muted/30 p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                      Item {idx + 1}
                    </span>
                    {data.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="rounded p-1 text-muted-foreground transition hover:text-destructive"
                        aria-label={`Remove item ${idx + 1}`}
                      >
                        <HugeiconsIcon icon={Delete02Icon} size={16} />
                      </button>
                    )}
                  </div>
                  <Input
                    value={item.description}
                    onChange={(e) =>
                      updateItem(item.id, { description: e.target.value })
                    }
                    placeholder="Description of service or product"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Qty</Label>
                      <Input
                        type="number"
                        min={0}
                        step="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(item.id, {
                            quantity: Number(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Rate</Label>
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        value={item.rate}
                        onChange={(e) =>
                          updateItem(item.id, {
                            rate: Number(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Tax %</Label>
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        value={item.taxRate}
                        onChange={(e) =>
                          updateItem(item.id, {
                            taxRate: Number(e.target.value) || 0,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="text-right text-sm font-medium tabular-nums">
                    {fmtMoney(item.quantity * item.rate)}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Discount, notes, terms, payment */}
          <Card>
            <CardHeader>
              <CardTitle>Discount, Notes &amp; Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Discount Type</Label>
                  <Select
                    value={data.discountType}
                    onValueChange={(v) =>
                      update("discountType", v as "percent" | "fixed")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percent">Percent (%)</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Discount Value</Label>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={data.discountValue}
                    onChange={(e) =>
                      update("discountValue", Number(e.target.value) || 0)
                    }
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Notes</Label>
                <Textarea
                  rows={2}
                  value={data.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  placeholder="Thank you for your business."
                />
              </div>
              <div className="space-y-1.5">
                <Label>Terms</Label>
                <Textarea
                  rows={2}
                  value={data.terms}
                  onChange={(e) => update("terms", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Payment Details</Label>
                <Textarea
                  rows={2}
                  value={data.paymentDetails}
                  onChange={(e) => update("paymentDetails", e.target.value)}
                  placeholder="e.g. Bank: Chase · Account: 1234567890 · Routing: 111000025"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Payment Link (auto-generates QR code)</Label>
                <Input
                  value={data.paymentLink}
                  onChange={(e) => update("paymentLink", e.target.value)}
                  placeholder="https://paypal.me/yourname"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* PREVIEW COLUMN */}
        <div className="lg:col-span-2">
          <div className="lg:sticky lg:top-24">
            <InvoicePreview
              data={data}
              totals={totals}
              qrDataUrl={data.paymentLink.trim() ? qrDataUrl : ""}
              fmtMoney={fmtMoney}
              currencyCode={currency.code}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------- PREVIEW ----------------
function InvoicePreview({
  data,
  totals,
  qrDataUrl,
  fmtMoney,
  currencyCode,
}: {
  data: InvoiceData
  totals: Totals
  qrDataUrl: string
  fmtMoney: (n: number) => string
  currencyCode: string
}) {
  return (
    <div
      id="invoice-doc"
      className="rounded-2xl border bg-card p-6 text-sm shadow-sm"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b pb-4">
        <div className="min-w-0 flex-1">
          {data.logoDataUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.logoDataUrl}
              alt="Business logo"
              className="mb-2 max-h-16 max-w-[180px] object-contain"
            />
          )}
          <div className="truncate font-heading text-lg font-semibold">
            {data.businessName || "Your Business Name"}
          </div>
          {data.businessAddress && (
            <div className="invoice-muted whitespace-pre-line text-xs text-muted-foreground">
              {data.businessAddress}
            </div>
          )}
          {(data.businessEmail || data.businessPhone) && (
            <div className="invoice-muted text-xs text-muted-foreground">
              {data.businessEmail}
              {data.businessEmail && data.businessPhone ? " · " : ""}
              {data.businessPhone}
            </div>
          )}
          {data.businessTaxId && (
            <div className="invoice-muted text-xs text-muted-foreground">
              Tax ID: {data.businessTaxId}
            </div>
          )}
        </div>
        <div className="shrink-0 text-right">
          <div className="font-heading text-2xl font-bold uppercase tracking-wide">
            Invoice
          </div>
          <div className="invoice-muted text-xs text-muted-foreground">
            #{data.invoiceNumber}
          </div>
          <div className="mt-2 space-y-0.5 text-xs">
            <div>
              <span className="invoice-muted text-muted-foreground">
                Issued:
              </span>{" "}
              {data.invoiceDate}
            </div>
            <div>
              <span className="invoice-muted text-muted-foreground">
                Due:
              </span>{" "}
              {data.dueDate}
            </div>
            <div>
              <span className="invoice-muted text-muted-foreground">
                Currency:
              </span>{" "}
              {currencyCode}
            </div>
          </div>
        </div>
      </div>

      {/* Bill To */}
      <div className="mt-4">
        <div className="invoice-muted text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Bill To
        </div>
        <div className="mt-1 font-medium">
          {data.clientName || "Client Name"}
        </div>
        {data.clientAddress && (
          <div className="invoice-muted whitespace-pre-line text-xs text-muted-foreground">
            {data.clientAddress}
          </div>
        )}
        {data.clientEmail && (
          <div className="invoice-muted text-xs text-muted-foreground">
            {data.clientEmail}
          </div>
        )}
      </div>

      {/* Items: overflow-x-auto so narrow previews can scroll horizontally
          when a line item amount is very large; in print the wrapper override
          lets the table render at natural width inside the full A4 page. */}
      <div className="invoice-table-wrap mt-6 overflow-x-auto rounded-xl border">
        <table className="invoice-table w-full min-w-[460px] text-left text-xs">
          <thead className="invoice-muted bg-muted/60 text-muted-foreground">
            <tr>
              <th className="px-2 py-2 font-medium">Description</th>
              <th className="px-2 py-2 text-right font-medium">Qty</th>
              <th className="px-2 py-2 text-right font-medium">Rate</th>
              <th className="px-2 py-2 text-right font-medium">Tax</th>
              <th className="px-2 py-2 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item) => (
              <tr key={item.id} className="border-t align-top">
                <td className="break-words px-2 py-2">
                  {item.description || "-"}
                </td>
                <td className="whitespace-nowrap px-2 py-2 text-right tabular-nums">
                  {item.quantity}
                </td>
                <td className="whitespace-nowrap px-2 py-2 text-right tabular-nums">
                  {fmtMoney(item.rate)}
                </td>
                <td className="invoice-muted whitespace-nowrap px-2 py-2 text-right tabular-nums text-muted-foreground">
                  {item.taxRate > 0 ? `${item.taxRate}%` : "-"}
                </td>
                <td className="whitespace-nowrap px-2 py-2 text-right font-medium tabular-nums">
                  {fmtMoney(item.quantity * item.rate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals: use a min-width so big numbers (e.g. $342,342,324.00) don't
          wrap across lines, and let the block grow past the minimum if needed */}
      <div className="mt-4 flex justify-end">
        <div className="min-w-56 space-y-1 text-xs">
          <div className="flex items-center justify-between gap-4 tabular-nums">
            <span className="invoice-muted text-muted-foreground">
              Subtotal
            </span>
            <span className="whitespace-nowrap">
              {fmtMoney(totals.subtotal)}
            </span>
          </div>
          {totals.discount > 0 && (
            <div className="flex items-center justify-between gap-4 tabular-nums">
              <span className="invoice-muted text-muted-foreground">
                Discount
              </span>
              <span className="whitespace-nowrap">
                -{fmtMoney(totals.discount)}
              </span>
            </div>
          )}
          {totals.itemTax > 0 && (
            <div className="flex items-center justify-between gap-4 tabular-nums">
              <span className="invoice-muted text-muted-foreground">Tax</span>
              <span className="whitespace-nowrap">
                {fmtMoney(totals.itemTax)}
              </span>
            </div>
          )}
          <div className="mt-1 flex items-center justify-between gap-4 border-t pt-1.5 text-sm font-semibold tabular-nums">
            <span>Total</span>
            <span className="whitespace-nowrap">
              {fmtMoney(totals.total)}
            </span>
          </div>
        </div>
      </div>

      {/* Notes / Terms / Payment */}
      {(data.notes ||
        data.terms ||
        data.paymentDetails ||
        qrDataUrl) && (
        <div className="mt-6 grid gap-4 border-t pt-4 sm:grid-cols-2">
          {(data.notes || data.terms) && (
            <div className="space-y-2 text-xs">
              {data.notes && (
                <div>
                  <div className="font-medium">Notes</div>
                  <div className="invoice-muted whitespace-pre-line text-muted-foreground">
                    {data.notes}
                  </div>
                </div>
              )}
              {data.terms && (
                <div>
                  <div className="font-medium">Terms</div>
                  <div className="invoice-muted whitespace-pre-line text-muted-foreground">
                    {data.terms}
                  </div>
                </div>
              )}
            </div>
          )}
          {(data.paymentDetails || qrDataUrl) && (
            <div className="space-y-2 text-xs">
              <div className="font-medium">Payment</div>
              {data.paymentDetails && (
                <div className="invoice-muted whitespace-pre-line text-muted-foreground">
                  {data.paymentDetails}
                </div>
              )}
              {qrDataUrl && (
                <div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrDataUrl}
                    alt="Payment QR code"
                    className="mt-1 h-32 w-32"
                  />
                  <div className="invoice-muted text-muted-foreground">
                    Scan to pay
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Minimalist PDF / HTML invoice generator
 */
export function generateInvoiceHtml(order) {
  const itemsHtml = (order.items || [])
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #f5f5f4;">
        <td style="padding: 12px 0;">
          <strong style="color: #1c1917;">${item.name}</strong>
          ${item.selectedColor ? `<div style="font-size: 12px; color: #78716c;">Color: ${item.selectedColor}</div>` : ''}
          ${item.selectedSize ? `<div style="font-size: 12px; color: #78716c;">Size: ${item.selectedSize}</div>` : ''}
        </td>
        <td style="padding: 12px 0; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px 0; text-align: right;">$${Number(item.price || item.unitPrice).toFixed(2)}</td>
        <td style="padding: 12px 0; text-align: right; font-weight: 600;">$${Number(item.lineTotal || item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Invoice - ${order.orderId}</title>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background: #fafaf9; color: #1c1917; margin: 0; padding: 40px 20px; }
        .invoice-box { max-width: 750px; margin: auto; padding: 40px; background: #ffffff; border-radius: 12px; border: 1px solid #e7e5e4; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; border-bottom: 2px solid #1c1917; padding-bottom: 20px; }
        .brand { font-size: 24px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; }
        .subtitle { font-size: 12px; color: #78716c; letter-spacing: 1px; }
        .invoice-title { font-size: 20px; font-weight: 600; text-align: right; color: #44403c; }
        .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 30px; }
        .meta-col h4 { margin: 0 0 8px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #a8a29e; }
        .meta-col p { margin: 0; font-size: 14px; line-height: 1.5; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th { text-align: left; padding: 10px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #78716c; border-bottom: 1px solid #d6d3d1; }
        .totals { margin-left: auto; width: 300px; }
        .totals-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
        .totals-row.grand { font-size: 18px; font-weight: bold; border-top: 2px solid #1c1917; margin-top: 8px; padding-top: 12px; color: #047857; }
        .footer { margin-top: 40px; border-top: 1px solid #e7e5e4; padding-top: 20px; text-align: center; font-size: 12px; color: #a8a29e; }
        @media print { body { background: #fff; padding: 0; } .invoice-box { border: none; box-shadow: none; padding: 0; } }
      </style>
    </head>
    <body>
      <div class="invoice-box">
        <div class="header">
          <div>
            <div class="brand">Aura & Co.</div>
            <div class="subtitle">Artisanal Atelier & Modern Living</div>
          </div>
          <div class="invoice-title">
            INVOICE
            <div style="font-size: 13px; font-weight: normal; color: #78716c; margin-top: 4px;">#${order.orderId}</div>
            <div style="font-size: 12px; font-weight: normal; color: #a8a29e;">${order.createdAt || new Date().toLocaleDateString()}</div>
          </div>
        </div>

        <div class="meta-grid">
          <div class="meta-col">
            <h4>Billed & Shipped To</h4>
            <p><strong>${order.shippingAddress?.fullName || order.customerName || 'Customer'}</strong></p>
            <p>${order.shippingAddress?.address || ''}</p>
            <p>${order.shippingAddress?.city || ''} ${order.shippingAddress?.postalCode || ''}</p>
            <p>${order.shippingAddress?.country || ''}</p>
            <p style="color: #78716c;">${order.shippingAddress?.email || order.userEmail || ''}</p>
          </div>
          <div class="meta-col" style="text-align: right;">
            <h4>Payment & Delivery</h4>
            <p><strong>Payment Status:</strong> <span style="color: #047857;">${order.payment?.status || 'Paid'}</span></p>
            <p><strong>Method:</strong> ${order.payment?.method || 'Card'}</p>
            ${order.payment?.transactionRef ? `<p style="font-size: 12px; color: #78716c;">Ref: ${order.payment.transactionRef}</p>` : ''}
            <p><strong>Delivery:</strong> ${order.deliveryOption?.name || 'Standard Delivery'}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 50%;">Item & Specifications</th>
              <th style="width: 15%; text-align: center;">Qty</th>
              <th style="width: 15%; text-align: right;">Unit Price</th>
              <th style="width: 20%; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div class="totals">
          <div class="totals-row">
            <span>Subtotal</span>
            <span>$${Number(order.subtotal || 0).toFixed(2)}</span>
          </div>
          ${order.discount > 0 ? `
          <div class="totals-row" style="color: #b91c1c;">
            <span>Discount ${order.promoCode ? `(${order.promoCode})` : ''}</span>
            <span>-$${Number(order.discount).toFixed(2)}</span>
          </div>` : ''}
          <div class="totals-row">
            <span>Shipping</span>
            <span>${(order.shippingFee || 0) === 0 ? 'Free' : `$${Number(order.shippingFee).toFixed(2)}`}</span>
          </div>
          <div class="totals-row grand">
            <span>Grand Total</span>
            <span>$${Number(order.total || 0).toFixed(2)}</span>
          </div>
        </div>

        <div class="footer">
          <p>Thank you for choosing Aura & Co. Atelier. Handcrafted with passion and sustainability.</p>
          <p style="font-size: 11px;">If you have any questions regarding this invoice, contact atelier@auraboutique.com</p>
        </div>
      </div>
      <script>
        window.addEventListener('load', () => {
          if (window.location.search.includes('print=true')) {
            window.print();
          }
        });
      </script>
    </body>
    </html>
  `;
}

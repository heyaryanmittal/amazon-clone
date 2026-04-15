import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrder } from '../services/api';
import { Printer } from 'lucide-react';

const InvoicePage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrder(orderId).then(({ data }) => {
      setOrder(data.order);
      setItems(data.items || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="p-10 text-center animate-pulse">Loading Invoice...</div>;
  if (!order) return <div className="p-10 text-center">Invoice not found.</div>;

  const f = (val) => parseFloat(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });

  return (
    <div className="bg-white min-h-screen p-4 md:p-10 text-[#0f1111] font-sans printable-invoice">
      <div className="max-w-[800px] mx-auto border border-[#ddd] p-8 shadow-sm print:shadow-none print:border-none">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-8 border-b border-[#eee] pb-6">
          <div className="flex flex-col gap-1">
             <h1 className="text-[24px] font-bold">Tax Invoice/Bill of Supply/Cash Memo</h1>
             <p className="text-[12px] text-[#565959]">(Original for Recipient)</p>
          </div>
          <div className="text-right">
             <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" className="h-[30px] mb-2 ml-auto" />
             <p className="text-[13px] font-bold">www.amazon.in</p>
          </div>
        </div>

        {/* Address Row */}
        <div className="grid grid-cols-2 gap-10 mb-8 text-[13px]">
           <div>
              <h3 className="font-bold mb-2 uppercase border-b border-[#eee] pb-1">Sold By:</h3>
              <p className="font-bold">Amazon Retail India Private Limited</p>
              <p>Plot No. 1, Amazon Road</p>
              <p>Karnataka, Bangalore - 560001</p>
              <p>India</p>
              <div className="mt-2 pt-2 border-t border-dashed border-[#ddd]">
                 <p><span className="font-medium">PAN No:</span> ABCDE1234F</p>
                 <p><span className="font-medium">GST Registration No:</span> 29ABCDE1234F1Z1</p>
              </div>
           </div>
           <div>
              <h3 className="font-bold mb-2 uppercase border-b border-[#eee] pb-1 font-sans">Billing Address:</h3>
              <p className="font-bold">{order.shippingName}</p>
              <p>{order.shippingAddressLine1}</p>
              {order.shippingAddressLine2 && <p>{order.shippingAddressLine2}</p>}
              <p>{order.shippingCity}, {order.shippingState} {order.shippingPincode}</p>
              <p>{order.shippingCountry}</p>
              <p><span className="font-medium">State/UT Code:</span> 07</p>
           </div>
        </div>

        {/* Details Row */}
        <div className="grid grid-cols-2 gap-10 mb-8 text-[13px]">
           <div>
              <p><span className="font-bold">Order Number:</span> {order.orderId}</p>
              <p><span className="font-bold">Order Date:</span> {new Date(order.placedAt || order.createdAt).toLocaleDateString('en-IN')}</p>
           </div>
           <div className="text-right">
              <p><span className="font-bold">Invoice Number:</span> IN-{(order.id || '2404').toString().padStart(6, '0')}</p>
              <p><span className="font-bold">Invoice Date:</span> {new Date().toLocaleDateString('en-IN')}</p>
           </div>
        </div>

        {/* Items Table */}
        <table className="w-full text-left text-[13px] mb-8 border-collapse">
           <thead>
              <tr className="bg-[#f3f3f3] border-t border-b border-[#ddd]">
                 <th className="py-2 px-3 font-bold w-[40px]">Sl. No</th>
                 <th className="py-2 px-3 font-bold">Description</th>
                 <th className="py-2 px-3 font-bold text-center">Unit Price</th>
                 <th className="py-2 px-3 font-bold text-center">Qty</th>
                 <th className="py-2 px-3 font-bold text-right">Net Amount</th>
                 <th className="py-2 px-3 font-bold text-right">Tax Rate</th>
                 <th className="py-2 px-3 font-bold text-right">Tax Type</th>
                 <th className="py-2 px-3 font-bold text-right">Tax Amount</th>
                 <th className="py-2 px-3 font-bold text-right">Total Amount</th>
              </tr>
           </thead>
           <tbody>
              {items.map((item, i) => {
                const netAmount = parseFloat(item.price) * item.quantity / 1.18;
                const taxAmount = (parseFloat(item.price) * item.quantity) - netAmount;
                return (
                  <tr key={i} className="border-b border-[#eee]">
                    <td className="py-3 px-3 align-top">{i + 1}</td>
                    <td className="py-3 px-3 align-top font-medium">{item.productName}</td>
                    <td className="py-3 px-3 align-top text-center">₹{f(parseFloat(item.price)/1.18)}</td>
                    <td className="py-3 px-3 align-top text-center">{item.quantity}</td>
                    <td className="py-3 px-3 align-top text-right">₹{f(netAmount)}</td>
                    <td className="py-3 px-3 align-top text-right">18%</td>
                    <td className="py-3 px-3 align-top text-right">IGST</td>
                    <td className="py-3 px-3 align-top text-right">₹{f(taxAmount)}</td>
                    <td className="py-3 px-3 align-top text-right font-bold">₹{f(parseFloat(item.price) * item.quantity)}</td>
                  </tr>
                );
              })}
           </tbody>
        </table>

        {/* Summary Row */}
        <div className="flex justify-end mb-10">
           <div className="w-[300px] flex flex-col gap-1 text-[13px]">
              <div className="flex justify-between"><span>TOTAL:</span> <span>₹{f(order.totalAmount)}</span></div>
              <div className="flex justify-between font-bold text-[15px] pt-3 border-t border-[#ddd] mt-2">
                 <span>Grand Total:</span> <span>₹{f(order.totalAmount)}</span>
              </div>
              <p className="text-[11px] text-[#565959] mt-1 italic text-right">Amount in words: Rupees Placeholder only</p>
           </div>
        </div>

        {/* Footer */}
        <div className="border-t border-black pt-4 text-[12px] flex flex-col items-end gap-1">
           <p className="font-bold">Authorized Signatory</p>
           <div className="h-10"></div>
           <p>Amazon Retail India Private Limited</p>
        </div>

        <div className="mt-10 pt-10 border-t border-[#eee] text-[11px] text-[#565959] leading-relaxed">
           <p>Whether tax is payable under reverse charge - No</p>
           <p className="mt-2 italic">Please note that this is a simulated invoice for demonstration purposes.</p>
        </div>
      </div>

      {/* Print Button Wrapper - Hidden during print */}
      <div className="max-w-[800px] mx-auto mt-6 flex justify-between items-center print:hidden">
         <Link to="/orders" className="text-[#007185] hover:underline flex items-center gap-1 text-[14px]">
            <span>‹</span> Back to orders
         </Link>
         <button 
           onClick={handlePrint}
           className="bg-[#FFD814] hover:bg-[#F7CA00] border border-[#FCD200] rounded-[8px] px-6 py-2 font-medium flex items-center gap-2 text-[14px] shadow-sm transform active:scale-95 transition-all"
         >
            <Printer size={18} /> Print Invoice
         </button>
      </div>
    </div>
  );
};

export default InvoicePage;

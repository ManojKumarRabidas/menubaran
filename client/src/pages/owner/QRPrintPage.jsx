import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import { getRestaurantById, getTableById } from '../../services/api.js';

/**
 * Standalone printable QR code page for a table.
 * URL: /qr/:restaurantId/:tableId
 * Renders the QR code + table link, optimised for printing.
 */
export default function QRPrintPage() {
  const { restaurantId, tableId } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const [restaurant, setRestaurant] = useState(null);
  const [table, setTable] = useState(null);
  const [menuUrl, setMenuUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      console.log(restaurantId, tableId)
      const [restRes, tableRes] = await Promise.all([
        getRestaurantById(restaurantId),
        getTableById(restaurantId, tableId),
      ]);
      setRestaurant(restRes.data);
      setTable(tableRes.data);

      // Build the full URL customers will land on
      const base = window.location.origin;
      const url = `${base}/menu/${restaurantId}/table/${tableId}`;
      setMenuUrl(url);

      setLoading(false);
    };
    load();
  }, [restaurantId, tableId]);

  // Draw QR onto canvas once we have the URL
  useEffect(() => {
    if (!menuUrl || !canvasRef.current) return;
    QRCode.toCanvas(canvasRef.current, menuUrl, {
      width: 280,
      margin: 2,
      color: { dark: '#1a1a1a', light: '#ffffff' },
      errorCorrectionLevel: 'H',
    });
  }, [menuUrl]);

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-sm">Generating QR code…</p>
      </div>
    );
  }

  if (!restaurant || !table) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500 text-sm">Table or restaurant not found.</p>
      </div>
    );
  }

  return (
    <>
      {/* ── Print-specific styles ── */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; }
          .print-card {
            border: none !important;
            box-shadow: none !important;
          }
        }
        @page { size: A6 portrait; margin: 10mm; }
      `}</style>

      {/* ── Screen controls (hidden when printing) ── */}
      <div className="no-print min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-6 p-6">
        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition text-sm shadow-sm"
          >
            ← Back
          </button>
          <button
            onClick={handlePrint}
            className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md transition text-sm active:scale-95"
          >
            🖨️ Print QR Code
          </button>
        </div>
        <p className="text-xs text-gray-400">A6 print size · Scan to confirm correct URL before printing</p>

        {/* Preview card */}
        <PrintCard
          canvasRef={canvasRef}
          restaurant={restaurant}
          table={table}
          menuUrl={menuUrl}
        />
      </div>

      {/* ── Print-only card (always rendered but only visible on print) ── */}
      <div className="hidden print:block">
        <PrintCard
          canvasRef={null}
          restaurant={restaurant}
          table={table}
          menuUrl={menuUrl}
          isPrint
        />
      </div>
    </>
  );
}

/** The actual card layout shared between screen preview and print */
function PrintCard({ canvasRef, restaurant, table, menuUrl, isPrint = false }) {
  const printCanvasRef = useRef(null);

  useEffect(() => {
    if (!isPrint || !menuUrl || !printCanvasRef.current) return;
    QRCode.toCanvas(printCanvasRef.current, menuUrl, {
      width: 280,
      margin: 2,
      color: { dark: '#1a1a1a', light: '#ffffff' },
      errorCorrectionLevel: 'H',
    });
  }, [isPrint, menuUrl]);

  const ref = isPrint ? printCanvasRef : canvasRef;

  return (
    <div
      className="print-card bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center p-8"
      style={{ width: 340 }}
    >
      {/* Restaurant brand */}
      <div className="flex items-center gap-2 mb-1">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
          <span className="text-white text-sm">🍽️</span>
        </div>
        <span className="text-base font-extrabold text-gray-900 tracking-tight">
          {restaurant.name}
        </span>
      </div>
      <p className="text-xs text-gray-400 mb-6">{restaurant.tagline}</p>

      {/* Divider */}
      <div className="w-full border-t border-dashed border-gray-200 mb-6" />

      {/* QR Code */}
      <div className="rounded-2xl overflow-hidden border-4 border-amber-100 shadow-inner mb-5 bg-white p-2">
        <canvas ref={ref} />
      </div>

      {/* Table label */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-8 py-3 text-center mb-4">
        <p className="text-xs text-amber-700 font-semibold uppercase tracking-widest mb-0.5">Table</p>
        <p className="text-5xl font-extrabold text-amber-700 leading-none">{table.number}</p>
      </div>

      {/* Instruction */}
      <p className="text-xs text-gray-500 text-center mb-4 leading-relaxed">
        📱 Scan to browse the menu &amp; order from your seat
      </p>

      {/* Divider */}
      <div className="w-full border-t border-dashed border-gray-200 mb-4" />

      {/* URL */}
      <p className="text-[10px] text-gray-400 text-center break-all font-mono">
        {menuUrl}
      </p>
    </div>
  );
}

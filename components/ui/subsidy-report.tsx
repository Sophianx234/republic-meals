"use client";

import { useState, useEffect } from "react";
import { 
  Printer, 
  Calculator, 
  CalendarDays, 
  Building2, 
  User, 
  AlertCircle,
  FileSpreadsheet,
  Download,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getSubsidyReport } from "@/app/actions/admin";

export function SubsidyReport() {
  const [month, setMonth] = useState(format(new Date(), "yyyy-MM"));
  const [workingDays, setWorkingDays] = useState<number>(20); // Default placeholder
  const [report, setReport] = useState<any[]>([]);
  const [totals, setTotals] = useState({ bank: 0, staff: 0, qty: 0 });
  const [loading, setLoading] = useState(false);

  // Initial Fetch & Update
  const calculate = async () => {
    setLoading(true);
    // Pass user input working days if needed, or let server calc default
    const result = await getSubsidyReport(month, workingDays);
    
    if (result.success) {
      setReport(result.data || []);
      setTotals(result.totals || { bank: 0, staff: 0, qty: 0 });
      // Update UI with the actual days used by server logic
      if (result.workingDays) setWorkingDays(result.workingDays);
    } else {
      toast.error("Calculation failed");
    }
    setLoading(false);
  };

  // Auto-calculate on month change
  useEffect(() => {
    // We pass undefined first to let server auto-calc the days for the new month
    const initFetch = async () => {
        setLoading(true);
        const result = await getSubsidyReport(month);
        if (result.success) {
            setReport(result.data || []);
            setTotals(result.totals || { bank: 0, staff: 0, qty: 0 });
            setWorkingDays(result.workingDays!);
        }
        setLoading(false);
    };
    initFetch();
  }, [month]);

  // Handle Manual Override of Days
  const handleRecalculate = () => {
      calculate();
      toast.success("Recalculated with " + workingDays + " working days");
  };

  // --- PRINT LOGIC ---
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const monthLabel = format(parseISO(month + "-01"), "MMMM yyyy");

    const html = `
      <html>
        <head>
          <title>Subsidy Report - ${monthLabel}</title>
          <style>
            body { font-family: 'Segoe UI', sans-serif; padding: 40px; color: #1a1a1a; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #000; padding-bottom: 15px; margin-bottom: 20px; }
            .logo { font-size: 24px; font-weight: bold; text-transform: uppercase; color: #007DC5; }
            .meta { text-align: right; font-size: 12px; }
            
            .summary { display: flex; gap: 20px; margin-bottom: 30px; }
            .box { flex: 1; background: #f8f9fa; padding: 15px; border: 1px solid #ddd; }
            .box h3 { margin: 0 0 5px 0; font-size: 12px; text-transform: uppercase; color: #666; }
            .box p { margin: 0; font-size: 20px; font-weight: bold; }

            table { width: 100%; border-collapse: collapse; font-size: 11px; }
            th { background: #007DC5; color: white; text-align: left; padding: 10px 8px; text-transform: uppercase; }
            td { padding: 8px; border-bottom: 1px solid #ddd; }
            tr:nth-child(even) { background: #f9f9f9; }
            
            .money { font-family: 'Courier New', monospace; text-align: right; }
            .center { text-align: center; }
            
            @media print { 
                @page { size: A4; margin: 1cm; }
                body { padding: 0; }
                th { -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div style="display:flex; align-items:center; gap:10px;">
            <img src="/images/rb.png" alt="RepublicLunch" style="height:40px; object-fit:contain; vertical-align:middle;"/>
                <div class="logo">Republic Lunch</div>
                <div style="font-size: 14px; font-weight: bold;">Monthly Subsidy Report</div>
            </div>
            <div class="meta">
                Period: <strong>${monthLabel}</strong><br/>
                Working Days: <strong>${workingDays}</strong><br/>
                Generated: ${format(new Date(), "PPP")}
            </div>
          </div>

          <div class="summary">
             <div class="box">
                <h3>Total Orders</h3>
                <p>${totals.qty}</p>
             </div>
             <div class="box">
                <h3>Bank Liability (60%)</h3>
                <p>GH₵ ${totals.bank.toFixed(2)}</p>
             </div>
             <div class="box">
                <h3>Staff Deduction (40% + Excess)</h3>
                <p>GH₵ ${totals.staff.toFixed(2)}</p>
             </div>
          </div>

          <table>
            <thead>
              <tr>
                <th width="30%">Staff Name</th>
                <th width="15%">Account No.</th>
                <th width="10%" class="center">Qty</th>
                <th width="20%" class="money">Bank (60%)</th>
                <th width="25%" class="money">Staff (40%)</th>
              </tr>
            </thead>
            <tbody>
              ${report.map(row => `
                <tr>
                  <td>
                    <strong>${row.name}</strong><br/>
                    <span style="color:#666; font-size:9px;">${row.department}</span>
                  </td>
                  <td>${row.accountNumber || "N/A"}</td>
                  <td class="center">
                    ${row.qty}
                    ${row.excessQty > 0 ? `<div style="font-size:8px; color:red;">(${row.excessQty} excess)</div>` : ''}
                  </td>
                  <td class="money">GH₵ ${row.bankCost.toFixed(2)}</td>
                  <td class="money">GH₵ ${row.staffCost.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
               <tr style="background:#eee; font-weight:bold;">
                  <td colspan="2">TOTALS</td>
                  <td class="center">${totals.qty}</td>
                  <td class="money">GH₵ ${totals.bank.toFixed(2)}</td>
                  <td class="money">GH₵ ${totals.staff.toFixed(2)}</td>
               </tr>
            </tfoot>
          </table>
          <script>window.onload = () => window.print();</script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6">
      
      {/* 1. CONFIGURATION CARD */}
      <Card className="border-t-4 border-t-slate-900 shadow-md">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
          <div className="flex justify-between items-center">
             <div>
               <CardTitle>Subsidy Calculation</CardTitle>
               <CardDescription>Generate payroll deductions based on working days.</CardDescription>
             </div>
             <Button onClick={handlePrint} disabled={report.length === 0} variant="outline" className="gap-2">
                <Printer className="w-4 h-4" /> Print Report
             </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
           <div className="flex flex-col md:flex-row items-end gap-4">
              
              <div className="w-full md:w-64 space-y-2">
                 <Label>Select Month</Label>
                 <div className="relative">
                    <CalendarDays className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                    <Input 
                        type="month" 
                        className="pl-9"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)} 
                    />
                 </div>
              </div>

              <div className="w-full md:w-48 space-y-2">
                 <Label className="flex items-center gap-1">
                    Working Days
                    <span className="text-[10px] text-slate-400 font-normal">(Excl. Holidays)</span>
                 </Label>
                 <Input 
                    type="number" 
                    value={workingDays}
                    onChange={(e) => setWorkingDays(parseInt(e.target.value) || 0)}
                    min={1} max={31}
                 />
              </div>

              <Button 
                onClick={handleRecalculate} 
                disabled={loading} 
                className="w-full md:w-auto bg-slate-900 text-white hover:bg-slate-800"
              >
                 {loading ? <span className="animate-spin mr-2"><Loader2/></span> : <Calculator className="w-4 h-4 mr-2" />}
                 Recalculate
              </Button>

           </div>
        </CardContent>
      </Card>

      {/* 2. SUMMARY STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <Card className="bg-slate-50 border-blue-100">
            <CardContent className="p-6">
               <div className="text-sm font-medium  uppercase tracking-wider mb-1">Total Bank Cost (60%)</div>
               <div className="text-3xl font-bold text-slate-900">₵ {totals.bank.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
            </CardContent>
         </Card>
         <Card className=" bg-slate-50 border-orange-100">
            <CardContent className="p-6">
               <div className="text-sm font-medium  uppercase tracking-wider mb-1">Total Staff Deduction</div>
               <div className="text-3xl font-bold text-slate-900">₵ {totals.staff.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
            </CardContent>
         </Card>
         <Card className="bg-slate-50 border-slate-200">
            <CardContent className="p-6">
               <div className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Total Volume</div>
               <div className="text-3xl font-bold text-slate-900">{totals.qty} <span className="text-sm font-normal text-slate-500">meals</span></div>
            </CardContent>
         </Card>
      </div>

      {/* 3. DETAILED TABLE */}
      <Card>
         <CardContent className="p-0">
            <div className="rounded-md border overflow-hidden">
               <Table>
                  <TableHeader className="bg-slate-100">
                     <TableRow>
                        <TableHead className="w-[250px]">Staff Name</TableHead>
                        <TableHead>Account Number</TableHead>
                        <TableHead className="text-center">Total Qty</TableHead>
                        <TableHead className="text-center">Excess</TableHead>
                        <TableHead className="text-right">Bank (60%)</TableHead>
                        <TableHead className="text-right">Staff (40%)</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {report.map((row) => (
                        <TableRow key={row.userId} className={row.excessQty > 0 ? "bg-red-50/30" : ""}>
                           <TableCell>
                              <div className="flex items-center gap-3">
                                 <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                    {row.name.slice(0,2).toUpperCase()}
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="font-semibold text-sm text-slate-800">{row.name}</span>
                                    <span className="text-[11px] text-slate-500">{row.department}</span>
                                 </div>
                              </div>
                           </TableCell>
                           <TableCell className="font-mono text-sm">{row.accountNumber}</TableCell>
                           <TableCell className="text-center font-medium">{row.qty}</TableCell>
                           <TableCell className="text-center">
                              {row.excessQty > 0 ? (
                                 <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200 text-[10px]">
                                    +{row.excessQty}
                                 </Badge>
                              ) : (
                                 <span className="text-slate-300">-</span>
                              )}
                           </TableCell>
                           <TableCell className="text-right font-mono text-slate-700">
                              {row.bankCost.toFixed(2)}
                           </TableCell>
                           <TableCell className="text-right font-mono font-bold text-slate-900">
                              {row.staffCost.toFixed(2)}
                           </TableCell>
                        </TableRow>
                     ))}
                     {report.length === 0 && (
                        <TableRow>
                           <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                              No data found for this period.
                           </TableCell>
                        </TableRow>
                     )}
                  </TableBody>
               </Table>
            </div>
         </CardContent>
      </Card>

    </div>
  );
}
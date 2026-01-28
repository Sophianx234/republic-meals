"use client";

import { useState } from "react";
import { 
  Save, 
  Power, 
  Clock, 
  CreditCard, 
  AlertTriangle, 
  Server,
  RotateCcw,
  Activity,
  Lock,
  Percent,
  Coins,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { updateSystemSettings } from "@/app/actions/settings";
import { toast, Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface SettingsData {
  isOrderingOpen: boolean;
  orderCutoffTime: string;
  maintenanceMode: boolean;
  mealPrice: number;
  bankSubsidyPercent: number;
  staffSubsidyPercent: number;
  adminEmails: string;
}

export function SystemSettings({ initialSettings }: { initialSettings: SettingsData }) {
  const [formData, setFormData] = useState<SettingsData>(initialSettings);
  const [loading, setLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (key: keyof SettingsData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setLoading(true);
    if (formData.bankSubsidyPercent + formData.staffSubsidyPercent !== 100) {
        toast.error("Subsidy percentages must sum to 100%");
        setLoading(false);
        return;
    }

    const result = await updateSystemSettings(formData);
    if (result.success) {
      toast.success("Configuration updated successfully");
      setHasChanges(false);
    } else {
      toast.error("Failed to save changes");
    }
    setLoading(false);
  };

  const handleReset = () => {
    setFormData(initialSettings);
    setHasChanges(false);
    toast.info("Changes discarded");
  };

  const bankCost = (formData.mealPrice * (formData.bankSubsidyPercent / 100)).toFixed(2);
  const staffCost = (formData.mealPrice * (formData.staffSubsidyPercent / 100)).toFixed(2);

  return (
    <div className="max-w-5xl mx-auto pb-24">
      
      {/* STATUS HEADER */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-full", formData.isOrderingOpen ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600")}>
                    <Power className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-sm font-medium text-slate-500">System Status</p>
                    <p className="text-lg font-bold text-slate-900">{formData.isOrderingOpen ? "Online" : "Offline"}</p>
                </div>
            </div>
            <Switch checked={formData.isOrderingOpen} onCheckedChange={(val) => handleChange("isOrderingOpen", val)} />
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                <Clock className="w-5 h-5" />
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500">Cutoff Time</p>
                <div className="flex items-center gap-2">
                    <p className="text-lg font-bold text-slate-900 font-mono">{formData.orderCutoffTime}</p>
                    <Input 
                        type="time" 
                        className="h-6 w-24 text-xs" 
                        value={formData.orderCutoffTime}
                        onChange={(e) => handleChange("orderCutoffTime", e.target.value)}
                    />
                </div>
                <Toaster position="top-right" />
            </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
             <div className="p-2 rounded-full bg-violet-100 text-violet-600">
                <Coins className="w-5 h-5" />
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500">Base Price</p>
                <div className="flex items-center gap-1">
                    <span className="text-slate-400 font-bold">GH₵</span>
                    <Input 
                        type="number" 
                        className="h-7 w-20 font-bold text-slate-900 border-none bg-transparent p-0 text-lg focus-visible:ring-0" 
                        value={formData.mealPrice}
                        onChange={(e) => handleChange("mealPrice", parseFloat(e.target.value))}
                    />
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* MAIN COLUMN */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* SUBSIDY LOGIC */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-slate-500" /> Subsidy Logic
                    </h3>
                    <Badge variant="outline" className="bg-white">Total: {formData.bankSubsidyPercent + formData.staffSubsidyPercent}%</Badge>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="w-full space-y-2">
                            <Label className="text-xs font-bold uppercase text-slate-500">Bank Contribution</Label>
                            <div className="relative">
                                <Input 
                                    type="number" 
                                    className="pl-3 pr-12 font-mono text-lg" 
                                    value={formData.bankSubsidyPercent}
                                    onChange={(e) => handleChange("bankSubsidyPercent", parseFloat(e.target.value))}
                                />
                                <div className="absolute right-3 top-3 text-slate-400 font-bold text-xs">%</div>
                            </div>
                            <p className="text-xs text-emerald-600 font-medium">Bank pays: GH₵ {bankCost}</p>
                        </div>
                        <div className="text-slate-300 font-light text-3xl">/</div>
                        <div className="w-full space-y-2">
                            <Label className="text-xs font-bold uppercase text-slate-500">Staff Contribution</Label>
                            <div className="relative">
                                <Input 
                                    type="number" 
                                    className="pl-3 pr-12 font-mono text-lg" 
                                    value={formData.staffSubsidyPercent}
                                    onChange={(e) => handleChange("staffSubsidyPercent", parseFloat(e.target.value))}
                                />
                                <div className="absolute right-3 top-3 text-slate-400 font-bold text-xs">%</div>
                            </div>
                            <p className="text-xs text-orange-600 font-medium">Staff pays: GH₵ {staffCost}</p>
                        </div>
                    </div>

                    <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex border border-slate-200">
                        <div 
                            className="h-full bg-emerald-500 flex items-center justify-center text-[9px] text-white font-bold transition-all duration-500" 
                            style={{ width: `${formData.bankSubsidyPercent}%` }}
                        >
                            BANK
                        </div>
                        <div 
                            className="h-full bg-orange-500 flex items-center justify-center text-[9px] text-white font-bold transition-all duration-500" 
                            style={{ width: `${formData.staffSubsidyPercent}%` }}
                        >
                            STAFF
                        </div>
                    </div>
                </div>
            </div>

            {/* DANGER ZONE */}
            <div className="bg-white rounded-xl border border-red-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-red-100 bg-red-50/30">
                    <h3 className="font-semibold text-red-900 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500" /> Danger Zone
                    </h3>
                </div>
                <div className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="font-medium text-slate-900">Maintenance Mode</p>
                            <p className="text-sm text-slate-500">Disables the application for all non-admin users.</p>
                        </div>
                        <Switch 
                            checked={formData.maintenanceMode} 
                            onCheckedChange={(val) => handleChange("maintenanceMode", val)}
                            className="data-[state=checked]:bg-red-600"
                        />
                    </div>
                </div>
            </div>

        </div>

        {/* SIDEBAR INFO */}
        <div className="space-y-6">
            <Card className="bg-slate-50 border-slate-200 shadow-none">
                <CardHeader>
                    <CardTitle className="text-sm uppercase text-slate-500 font-bold">Configuration Policy</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-slate-600 space-y-4">
                    <p>
                        Settings applied here take effect immediately for the user interface, but financial calculations are versioned.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>Historical reports are immutable.</li>
                        <li>Price changes apply to new orders only.</li>
                        <li>Cutoff times adhere to UTC.</li>
                    </ul>
                </CardContent>
            </Card>
        </div>

      </div>

      {/* FLOATING ACTION BAR */}
      <div className={cn(
          "fixed bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2 p-1.5 pl-4 bg-slate-900/95 backdrop-blur-md text-white rounded-full shadow-2xl transition-all duration-300 z-50 border border-slate-700/50",
          hasChanges ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0 pointer-events-none"
      )}>
         <span className="text-sm font-medium mr-2">Unsaved changes</span>
         <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleReset} 
            className="hover:bg-slate-800 text-slate-400 hover:text-white rounded-full h-8 px-3"
         >
            Discard
         </Button>
         <Button 
            size="sm" 
            onClick={handleSave} 
            disabled={loading} 
            className="bg-white text-slate-950 hover:bg-slate-200 rounded-full h-8 px-4 font-semibold"
         >
            {loading ? <RotateCcw className="animate-spin w-3.5 h-3.5" /> : "Save Changes"}
         </Button>
      </div>

    </div>
  );
}
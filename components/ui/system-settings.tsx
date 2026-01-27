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
  Coins
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { updateSystemSettings } from "@/app/actions/settings";
import { toast } from "sonner";
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
    // Validate percentages
    if (formData.bankSubsidyPercent + formData.staffSubsidyPercent !== 100) {
        toast.error("Subsidy percentages must sum to 100%");
        return;
    }

    const result = await updateSystemSettings(formData);
    
    if (result.success) {
      toast.success("System configuration applied successfully");
      setHasChanges(false);
    } else {
      toast.error("Failed to propagate settings");
    }
    setLoading(false);
  };

  const handleReset = () => {
    setFormData(initialSettings);
    setHasChanges(false);
    toast.info("Local changes discarded");
  };

  // Calculated values for preview
  const bankCost = (formData.mealPrice * (formData.bankSubsidyPercent / 100)).toFixed(2);
  const staffCost = (formData.mealPrice * (formData.staffSubsidyPercent / 100)).toFixed(2);

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500 pb-24">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT COLUMN: OPERATIONS */}
        <div className="space-y-6">
            <Card className=" shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Activity className="w-5 h-5 text-blue-600" />
                                Operational State
                            </CardTitle>
                            <CardDescription>Controls for daily kitchen availability.</CardDescription>
                        </div>
                        <Badge variant={formData.isOrderingOpen ? "default" : "destructive"} className="uppercase tracking-wider font-mono text-[10px]">
                            {formData.isOrderingOpen ? "System Online" : "Orders Paused"}
                        </Badge>
                    </div>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6 grid gap-6">
                    
                    <div className="flex items-center justify-between bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <div className="space-y-1">
                            <Label className="text-base font-semibold text-slate-900">Accepting Orders</Label>
                            <p className="text-xs text-slate-500 max-w-[250px]">
                                Master switch. When off, the menu is visible but ordering is disabled globally.
                            </p>
                        </div>
                        <Switch 
                            checked={formData.isOrderingOpen}
                            onCheckedChange={(val) => handleChange("isOrderingOpen", val)}
                            className="data-[state=checked]:bg-blue-600"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold text-slate-500 uppercase">Daily Cutoff</Label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                                <Input 
                                    type="time" 
                                    className="pl-9 font-mono bg-white"
                                    value={formData.orderCutoffTime}
                                    onChange={(e) => handleChange("orderCutoffTime", e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-semibold text-slate-500 uppercase">Current Time</Label>
                            <div className="flex items-center h-10 px-3 border rounded-md bg-slate-50 text-slate-500 font-mono text-sm">
                                {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} UTC
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* DANGER ZONE */}
            <Card className="border-red-200 bg-red-50/30 shadow-none border-dashed">
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-red-700 text-base">
                        <Lock className="w-4 h-4" />
                        Maintenance Protocol
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <Label className="text-red-900 font-medium">Maintenance Mode</Label>
                            <p className="text-xs text-red-600/80 mt-1">
                                Force disconnects all non-admin users.
                            </p>
                        </div>
                        <Switch 
                            checked={formData.maintenanceMode}
                            onCheckedChange={(val) => handleChange("maintenanceMode", val)}
                            className="data-[state=checked]:bg-red-600"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* RIGHT COLUMN: FINANCE */}
        <div className="space-y-6">
            <Card className=" shadow-sm h-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <CreditCard className="w-5 h-5 text-emerald-600" />
                        Fiscal Configuration
                    </CardTitle>
                    <CardDescription>Meal pricing and subsidy distribution ratios.</CardDescription>
                </CardHeader>
                <Separator />
                <CardContent className="pt-6 space-y-8">
                    
                    {/* BASE PRICE */}
                    <div className="space-y-3">
                        <Label className="text-sm font-bold text-slate-700">Base Meal Price</Label>
                        <div className="relative">
                            <Coins className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                            <Input 
                                type="number" 
                                className="pl-9 font-mono text-lg font-bold text-slate-900 bg-slate-50 border-slate-200"
                                value={formData.mealPrice}
                                onChange={(e) => handleChange("mealPrice", parseFloat(e.target.value))}
                            />
                            <div className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">GHS</div>
                        </div>
                    </div>

                    {/* SUBSIDY SPLIT */}
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-5">
                        <div className="flex justify-between items-center">
                            <Label className="text-xs font-bold uppercase text-slate-500">Subsidy Split Logic</Label>
                            <div className={cn(
                                "text-[10px] font-bold px-2 py-0.5 rounded",
                                formData.bankSubsidyPercent + formData.staffSubsidyPercent === 100 
                                    ? "bg-emerald-100 text-emerald-700" 
                                    : "bg-red-100 text-red-700"
                            )}>
                                TOTAL: {formData.bankSubsidyPercent + formData.staffSubsidyPercent}%
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            
                            {/* BANK */}
                            <div className="space-y-2">
                                <Label className="text-sm text-slate-600">Bank Share (%)</Label>
                                <div className="relative">
                                    <Percent className="absolute left-3 top-2.5 w-3 h-3 text-slate-400" />
                                    <Input 
                                        type="number"
                                        className="pl-8 font-mono"
                                        value={formData.bankSubsidyPercent}
                                        onChange={(e) => handleChange("bankSubsidyPercent", parseFloat(e.target.value))}
                                    />
                                </div>
                                <div className="text-right text-xs font-mono font-medium text-emerald-600">
                                    = GH₵ {bankCost}
                                </div>
                            </div>

                            {/* STAFF */}
                            <div className="space-y-2">
                                <Label className="text-sm text-slate-600">Staff Share (%)</Label>
                                <div className="relative">
                                    <Percent className="absolute left-3 top-2.5 w-3 h-3 text-slate-400" />
                                    <Input 
                                        type="number"
                                        className="pl-8 font-mono"
                                        value={formData.staffSubsidyPercent}
                                        onChange={(e) => handleChange("staffSubsidyPercent", parseFloat(e.target.value))}
                                    />
                                </div>
                                <div className="text-right text-xs font-mono font-medium text-orange-600">
                                    = GH₵ {staffCost}
                                </div>
                            </div>

                        </div>

                        {/* Visual Bar */}
                        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden flex">
                            <div 
                                className="h-full bg-emerald-500 transition-all duration-500" 
                                style={{ width: `${formData.bankSubsidyPercent}%` }} 
                            />
                            <div 
                                className="h-full bg-orange-500 transition-all duration-500" 
                                style={{ width: `${formData.staffSubsidyPercent}%` }} 
                            />
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-yellow-50 text-yellow-800 rounded-md border border-yellow-100 text-xs">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <p>Updating pricing metrics will strictly apply to <strong>new orders</strong> generated after the timestamp of this save. Historical financial reports will remain immutable.</p>
                    </div>

                </CardContent>
            </Card>
        </div>

      </div>

      {/* FLOATING ACTION BAR */}
      <div className={cn(
          "fixed bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2 p-2 bg-slate-900/90 backdrop-blur-md text-white rounded-full shadow-2xl transition-all duration-300 z-50",
          hasChanges ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0 pointer-events-none"
      )}>
         <span className="pl-4 pr-2 text-sm font-medium">Unsaved configuration changes</span>
         <div className="h-4 w-px bg-slate-700 mx-1"></div>
         <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleReset} 
            className="hover:bg-slate-800 text-slate-300 hover:text-white rounded-full px-4"
         >
            <RotateCcw className="w-3.5 h-3.5 mr-2" /> Discard
         </Button>
         <Button 
            size="sm" 
            onClick={handleSave} 
            disabled={loading} 
            className="bg-emerald-500 text-white hover:bg-emerald-600 rounded-full px-6 font-semibold"
         >
            {loading ? (
                <span className="flex items-center"><RotateCcw className="animate-spin w-3.5 h-3.5 mr-2" /> Applying...</span>
            ) : (
                <span className="flex items-center"><Save className="w-3.5 h-3.5 mr-2" /> Commit Changes</span>
            )}
         </Button>
      </div>

    </div>
  );
}
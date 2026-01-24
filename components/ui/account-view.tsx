"use client";

import { useState, useRef } from "react";
import { 
  User as UserIcon, 
  Mail, 
  Camera,
  ShieldCheck,
  Eye,
  EyeOff,
  Save,
  Loader2,
  Lock
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"; // Ensure these are imported
import { toast, Toaster } from "sonner";
import { authClient } from "@/lib/auth-client";
import { updateAccountSettings } from "@/app/actions/staff";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  department?: string;
  branch?: string; // Added branch
  floor?: string;
  phone?: string;
  defaultNote?: string;
}

export const republicBankBranches = [
  "Abossey Okai Branch", "Accra Central Branch", "Accra New Town Branch", "Achimota Branch", "Adabraka Branch", 
  "Adjiriganor Branch", "Asamankese Branch", "Asankragua Branch", "Ashaiman Branch", "Asokwa Branch (The Ark)", 
  "Baatsona Branch", "Bolgatanga Branch", "Cape Coast Branch", "Dansoman Branch", "Ebankese (Head Office)", 
  "Essam Branch", "Goaso Branch", "Ho Branch", "Juaboso Branch", "Kasoa Branch", "KNUST Branch (Kumasi)", 
  "Koforidua Branch", "Kumasi Branch", "Legon Branch", "Madina Branch", "Post Office Square Branch", 
  "Private Bank Branch (Labone)", "Republic Court Branch", "Sefwi Bekwai Branch", "Sefwi Wiawso Branch", 
  "Suame Magazine Branch", "Swedru Branch", "Takoradi Branch", "Tarkwa Branch", "Tamale Branch", 
  "Techiman Branch", "Tema Branch", "Tema Community 25 Branch", "Tudu Branch", "Winneba Branch"
];

const republicBankDepartments = [
  "Retail Banking", "Corporate Banking", "Commercial Banking", "SME Banking", "Private Banking", "Treasury", 
  "Trade Finance", "Operations", "Customer Service", "Branch Operations", "Digital Banking", "Electronic Banking (E-Banking)", 
  "Cards & Payments", "Cash Management", "Credit", "Credit Administration", "Risk Management", "Compliance", 
  "Anti-Money Laundering (AML)", "Internal Audit", "Finance", "Accounts", "Financial Control", "Human Resources", 
  "Learning & Development", "Administration", "Procurement", "Legal", "Company Secretariat", "Information Technology (IT)", 
  "Information Security", "Data & Analytics", "Product Development", "Marketing", "Corporate Communications", 
  "Public Relations", "Sales", "Business Development", "Strategy", "Project Management Office (PMO)", "Quality Assurance", 
  "Facilities Management", "Security", "Recovery & Collections", "Customer Experience (CX)", "Agency Banking", 
  "Mobile Banking", "International Banking"
];

export function AccountView({ user }: { user: UserProfile }) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  
  // State for Dropdowns
  const [selectedBranch, setSelectedBranch] = useState(user.branch || "");
  const [selectedDept, setSelectedDept] = useState(user.department || "");

  // Image State
  const [previewImage, setPreviewImage] = useState(user.image);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password State
  const [passLoading, setPassLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // --- HANDLERS ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append("userId", user.id); 
    
    // Explicitly append dropdown values if they aren't caught by name attribute
    // (Shadcn Select handles name prop, but explicit append ensures safety)
    formData.set("branch", selectedBranch);
    formData.set("department", selectedDept);

    try {
      const result = await updateAccountSettings(formData);
      
      if (result.success) {
        toast.success("Profile Updated", { description: "Your information has been saved." });
      } else {
        toast.error("Update Failed", { description: result.error });
      }
    } catch (err) {
      toast.error("Network Error");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setPassLoading(true);
    try {
      const { data, error } = await authClient.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
        revokeOtherSessions: true,
      });
      if (error) {
        toast.error("Error", { description: error.message });
      } else {
        toast.success("Password Changed");
        setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (err) {
      toast.error("Failed to change password");
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="grid gap-8 animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="relative group" onClick={() => fileInputRef.current?.click()}>
          <Avatar className="h-24 w-24 border-4 border-white shadow-md cursor-pointer">
            <AvatarImage src={previewImage} className="object-cover" />
            <AvatarFallback className="bg-blue-100 text-blue-700 text-2xl font-bold">
              {user.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <button 
            type="button"
            
            className="absolute bottom-0 right-0 bg-gray-900 text-white p-1.5 rounded-full shadow-sm hover:bg-black transition-colors"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
          <div className="flex items-center gap-2 text-gray-500 mt-1">
            <Mail className="w-4 h-4" />
            <span>{user.email}</span>
          </div>
          <div className="flex items-center gap-2 mt-3">
             <span className="bg-emerald-50 text-emerald-700 text-xs px-2 py-1 rounded border border-emerald-100 font-medium capitalize">
               {selectedDept || "Staff Member"}
             </span>
          </div>
        </div>
      </div>

      {/* TABS SECTION */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="general" className="gap-2">
            <UserIcon className="w-4 h-4" /> General
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <ShieldCheck className="w-4 h-4" /> Security
          </TabsTrigger>
        </TabsList>

        {/* --- TAB 1: GENERAL INFO --- */}
        <TabsContent value="general" className="mt-6">
          <form onSubmit={handleProfileSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Manage your details and delivery preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                <input 
                  type="file" 
                  name="image" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageChange}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input name="name" defaultValue={user.name} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={user.email} disabled className="bg-gray-50 text-gray-500" />
                  </div>
                  
                  {/* DEPARTMENT SELECT */}
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Select name="department" value={selectedDept} onValueChange={setSelectedDept}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Department" />
                      </SelectTrigger>
                      <SelectContent>
                        {republicBankDepartments.map((dept) => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* BRANCH SELECT */}
                  <div className="space-y-2">
                    <Label>Branch</Label>
                    <Select name="branch" value={selectedBranch} onValueChange={setSelectedBranch}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {republicBankBranches.map((branch) => (
                          <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Office Location / Floor (Optional)</Label>
                    <Input name="floor" defaultValue={user.floor} placeholder="e.g. 2nd Floor, Room 4" />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input name="phone" defaultValue={user.phone} placeholder="05X XXX XXXX" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Default Delivery Note</Label>
                  <Textarea 
                    name="defaultNote" 
                    defaultValue={user.defaultNote} 
                    placeholder="Instructions for the runner (e.g. Leave at reception)" 
                    className="resize-none"
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={loading} className="bg-gray-900 hover:bg-gray-800">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </TabsContent>

        {/* --- TAB 2: SECURITY --- */}
        <TabsContent value="security" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Password & Security</CardTitle>
              <CardDescription>Manage your password to keep your account safe.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <div className="relative">
                    <Input 
                      type={showPass ? "text" : "password"} 
                      value={passwords.currentPassword}
                      onChange={e => setPasswords({...passwords, currentPassword: e.target.value})}
                      required 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>New Password</Label>
                  <div className="relative">
                    <Input 
                      type={showPass ? "text" : "password"} 
                      value={passwords.newPassword}
                      onChange={e => setPasswords({...passwords, newPassword: e.target.value})}
                      required 
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPass ? <EyeOff className="w-4 h-4"/> : <Eye className="w-4 h-4"/>}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Confirm New Password</Label>
                  <Input 
                    type={showPass ? "text" : "password"} 
                    value={passwords.confirmPassword}
                    onChange={e => setPasswords({...passwords, confirmPassword: e.target.value})}
                    required 
                  />
                </div>

                <div className="pt-2">
                  <Button type="submit" variant="destructive" disabled={passLoading} className="w-full sm:w-auto">
                    {passLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : <Lock className="w-4 h-4 mr-2"/>}
                    Update Password
                  </Button>
                </div>

              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <Toaster position="top-right" />
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  Shield, 
  MoreHorizontal, 
  Building2, 
  MapPin, 
  UserCog, 
  Loader2,
  Ban,
  CheckCircle2
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { getStaffList, updateStaffMember, toggleUserStatus } from "@/app/actions/admin";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// --- CONSTANTS ---
export const republicBankBranches = [
  "Abossey Okai Branch", "Accra Central Branch", "Accra New Town Branch", "Achimota Branch", "Adabraka Branch", 
  "Adjiriganor Branch", "Asamankese Branch", "Asankragua Branch", "Ashaiman Branch", "Asokwa Branch (The Ark)", 
  "Baatsona Branch", "Bolgatanga Branch", "Cape Coast Branch", "Dansoman Branch", "Ebankese (Head Office)", 
  "Essam Branch", "Goaso Branch", "Ho Branch", "Juaboso Branch", "Kasoa Branch", "KNUST Branch (Kumasi)", 
  "Koforidua Branch", "Kumasi Branch", "Legon Branch", "Madina Branch", "Post Office Square Branch", 
  "Private Bank Branch (Labone)", "Republic Court Branch", "Sefwi Bekwai Branch", "Sefwi Wiawso Branch", 
  "Suame Magazine Branch", "Swedru Branch", "Takoradi Branch", "Tarkwa Branch", "Tamale Branch", 
  "Techiman Branch", "Tema Branch", "Tema Community 25 Branch", "Tudu Branch", "Winneba Branch"
].sort();

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
].sort();

// Types
interface StaffUser {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: "user" | "admin" | "kitchen";
  department?: string;
  branch?: string;
  banned?: boolean;
}

export function StaffManagement() {
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Edit State
  const [selectedUser, setSelectedUser] = useState<StaffUser | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Initial Fetch
  const fetchUsers = async () => {
    setLoading(true);
    const result = await getStaffList(search);
    if (result.success) setUsers(result.users);
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
        fetchUsers();
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Handlers
  const handleEditSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedUser) return;
    setIsSaving(true);

    const formData = new FormData(e.currentTarget);
    const updates = {
        role: formData.get("role") as string,
        department: formData.get("department") as string,
        branch: formData.get("branch") as string,
    };

    const result = await updateStaffMember(selectedUser._id, updates);
    
    if (result.success) {
        toast.success("Profile Updated");
        setIsEditOpen(false);
        fetchUsers(); 
    } else {
        toast.error("Failed to update profile");
    }
    setIsSaving(false);
  };

  const handleToggleStatus = async (userId: string, currentBanStatus: boolean) => {
      const result = await toggleUserStatus(userId, !currentBanStatus);
      if (result.success) {
          toast.success(currentBanStatus ? "User Activated" : "User Suspended");
          setUsers(prev => prev.map(u => u._id === userId ? { ...u, banned: !currentBanStatus } : u));
      }
  };

  return (
    <div className="space-y-6 ">
      
      {/* HEADER & FILTERS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h2 className="text-xl font-bold tracking-tight">Staff Directory</h2>
            <p className="text-sm text-muted-foreground">Manage roles, departments, and access levels.</p>
        </div>
        <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email or dept..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
        </div>
      </div>

      {/* STAFF TABLE */}
      <Card>
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-[300px]">Employee</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                 <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" /> Loading staff...
                        </div>
                    </TableCell>
                 </TableRow>
              ) : users.length === 0 ? (
                 <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        No staff found matching "{search}"
                    </TableCell>
                 </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user._id} className={user.banned ? "bg-red-50/50" : ""}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-slate-200">
                          <AvatarImage src={user.image} />
                          <AvatarFallback>{user.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm text-slate-900">{user.name}</span>
                          <span className="text-xs text-slate-500">{user.email}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                        <RoleBadge role={user.role} />
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            {user.department || "Unassigned"}
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {user.branch || "HQ"}
                        </div>
                    </TableCell>
                    <TableCell>
                        {user.banned ? (
                            <Badge variant="destructive" className="text-[10px]">Suspended</Badge>
                        ) : (
                            <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">Active</Badge>
                        )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => { setSelectedUser(user); setIsEditOpen(true); }}>
                            <UserCog className="mr-2 h-4 w-4" /> Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className={user.banned ? "text-emerald-600" : "text-red-600"}
                            onClick={() => handleToggleStatus(user._id, !!user.banned)}
                          >
                            {user.banned ? <CheckCircle2 className="mr-2 h-4 w-4" /> : <Ban className="mr-2 h-4 w-4" />}
                            {user.banned ? "Activate User" : "Suspend Access"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* EDIT MODAL */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update role and location for {selectedUser?.name}.
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
              <form onSubmit={handleEditSave} className="grid gap-4 py-4">
                
                {/* ROLE */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right text-slate-500">Role</Label>
                  <div className="col-span-3">
                      <Select name="role" defaultValue={selectedUser.role}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="user">User (Standard)</SelectItem>
                            <SelectItem value="kitchen">Kitchen Staff</SelectItem>
                            <SelectItem value="admin">Administrator</SelectItem>
                        </SelectContent>
                      </Select>
                  </div>
                </div>

                {/* DEPARTMENT (Using Constants) */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="department" className="text-right text-slate-500">Dept</Label>
                  <div className="col-span-3">
                      <Select name="department" defaultValue={selectedUser.department}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Department" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px]">
                            {republicBankDepartments.map((dept) => (
                                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                  </div>
                </div>

                {/* BRANCH (Using Constants) */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="branch" className="text-right text-slate-500">Branch</Label>
                  <div className="col-span-3">
                      <Select name="branch" defaultValue={selectedUser.branch}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Branch" />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px]">
                            {republicBankBranches.map((branch) => (
                                <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                  </div>
                </div>

                <DialogFooter className="pt-4">
                    <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </DialogFooter>
              </form>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
    const styles: Record<string, string> = {
        admin: "bg-purple-100 text-purple-700 hover:bg-purple-100 border-purple-200",
        kitchen: "bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200",
        user: "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200"
    };

    return (
        <Badge variant="secondary" className={cn("capitalize font-medium border", styles[role] || styles.user)}>
            {role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
            {role}
        </Badge>
    );
}
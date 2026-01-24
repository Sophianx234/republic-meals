"use client";

import { useState } from "react";
import { 
  AlertCircle, 
  Send, 
  Loader2, 
  CheckCircle2 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast, Toaster } from "sonner";
import { submitIssue } from "@/app/actions/issue";

export function ReportIssueForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await submitIssue(formData);

    if (result.success) {
      setSuccess(true);
      toast.success("Report Submitted", { description: "We've received your feedback." });
    } else {
      toast.error("Error", { description: result.error });
    }
    setLoading(false);
  }

  if (success) {
    return (
      <Card className="max-w-lg mx-auto mt-10 border-emerald-100 bg-emerald-50/50">
        <CardContent className="pt-6 text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-emerald-900">Thank You!</h2>
          <p className="text-emerald-700">
            Your report has been submitted successfully. Our team will review it shortly.
          </p>
          <Button 
            variant="outline" 
            className="mt-4 border-emerald-200 text-emerald-800 hover:bg-emerald-100"
            onClick={() => setSuccess(false)} // Reset form
          >
            Submit Another Issue
          </Button>
        </CardContent>
        <Toaster position="top-right" />
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 animate-in fade-in duration-500">
      
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Report an Issue</h1>
        <p className="text-gray-500 mt-2">
          Having trouble with the app or your meal? Let us know so we can fix it.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-gray-500" />
            Issue Details
          </CardTitle>
          <CardDescription>
            Please provide as much detail as possible.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Issue Type */}
              <div className="space-y-2">
                <Label>Issue Type</Label>
                <Select name="type" required defaultValue="Other">
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technical">Technical Bug</SelectItem>
                    <SelectItem value="Food Quality">Food Quality</SelectItem>
                    <SelectItem value="Delivery">Delivery Issue</SelectItem>
                    <SelectItem value="Other">Other Feedback</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <Label>Priority Level</Label>
                <Select name="priority" required defaultValue="Low">
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low (Suggestion)</SelectItem>
                    <SelectItem value="Medium">Medium (Minor Issue)</SelectItem>
                    <SelectItem value="High">High (Critical/Blocker)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input 
                name="subject" 
                placeholder="e.g. App crashed when ordering..." 
                required 
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea 
                name="description" 
                placeholder="Describe what happened, what you expected, or specific details about the meal..." 
                className="min-h-[150px] resize-none"
                required 
              />
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={loading} className="bg-gray-900 hover:bg-gray-800 w-full md:w-auto">
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                Submit Report
              </Button>
            </div>

          </form>

        </CardContent>
        <Toaster position="top-right" />
      </Card>
    </div>
  );
}
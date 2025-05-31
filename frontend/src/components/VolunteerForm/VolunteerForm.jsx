import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const eventFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  phoneNumber: z.string().optional(),
  location: z.string().min(2, "Location is required"),
  committees: z.array(z.string()).optional(), // Array of committee IDs
});

const VolunteerForm = ({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const apiURL = import.meta.env.VITE_APP_API_URL || "http://localhost:8080";
  const [committees, setCommittees] = useState([]);
  const [loadingCommittees, setLoadingCommittees] = useState(true);

  const form = useForm({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
      phoneNumber: initialData?.phoneNumber || "",
      committees: initialData?.committees || [],
    },
  });

  useEffect(() => {
    const fetchCommittees = async () => {
      try {
        setLoadingCommittees(true);
        const response = await axios.get(`${apiURL}/committees`);
        setCommittees(response.data);
      } catch (error) {
        console.error("Error fetching committees:", error);
        // Fallback to empty array or show error message
        setCommittees([]);
      } finally {
        setLoadingCommittees(false);
      }
    };

    fetchCommittees();
  }, [apiURL]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {initialData?.id ? "Edit Volunteer" : "Create New Volunteer"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Volunteer Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Name of volunteer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Volunteer Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Volunteer's Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Volunteer Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Phone Number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Event"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default VolunteerForm;

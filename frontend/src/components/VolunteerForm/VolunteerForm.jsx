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
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";

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
        const response = await axios.get(`${apiURL}/categories`);
        console.log(response.data);
        setCommittees(response.data);
      } catch (error) {
        console.error("Error fetching committees:", error);
        setCommittees([]);
      } finally {
        setLoadingCommittees(false);
      }
    };

    fetchCommittees();
  }, [apiURL]);

  let saveVolunteer = () => {};

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

            {/* Committee Selection Field */}
            <FormField
              control={form.control}
              name="committees"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">
                      Committee Membership
                    </FormLabel>
                    <FormDescription>
                      Select the committees you would like to join (optional).
                    </FormDescription>
                  </div>

                  {loadingCommittees ? (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">
                        Loading committees...
                      </p>
                    </div>
                  ) : committees.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">
                        No committees available at this time.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {committees.map((committee) => (
                        <FormField
                          key={committee.id}
                          control={form.control}
                          name="committees"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={committee.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(
                                      committee.id
                                    )}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...(field.value || []),
                                            committee.id,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== committee.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                  {committee.name || committee.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                  )}
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
                {loading ? "Saving..." : "Save Volunteer"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default VolunteerForm;

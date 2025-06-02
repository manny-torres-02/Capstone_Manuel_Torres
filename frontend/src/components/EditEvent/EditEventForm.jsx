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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";

const eventFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.string().min(1, "Date is required"),
  location: z.string().min(2, "Location is required"),
  maxParticipants: z.number().optional(),
});

const EditEventForm = ({
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
      title: initialData?.title || "",
      description: initialData?.description || "",
      date: initialData?.date || "",
      location: initialData?.location || "",
      maxParticipants: initialData?.maxParticipants || "",
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

  //Log Values for debugging
  const watchedValues = form.watch();

  useEffect(() => {
    console.log("Current form values:", watchedValues);
  }, [watchedValues]);

  const saveVolunteer = async (formData) => {
    setIsSubmitting(true);
    try {
      console.log("Submitting volunteer data:", formData);

      //Make sure the data is set up correctly to be sent to the backend.
      const backendData = {
        name: formData.name,
        email: formData.email || null, // Send null if empty
        phoneNumber: formData.phoneNumber || null, // Send null if empty
        categoryIds: formData.categoryIds?.map((id) => parseInt(id)) || [],
        eventIds: formData.eventIds?.map((id) => parseInt(id)) || [],
      };
      console.log("Transformed data for backend:", backendData);

      let response;

      if (initialData?.id) {
        //Set up the code to update the volunteer
        console.log(`Updating volunteer with ID: ${initialData.id}`);

        response = await axios.patch(
          `${apiURL}/volunteers/${initialData.id}`,
          backendData
        );
        console.log("Volunteer updated successfully:", response.data);
        if (response.data.categoryIds && response.data.eventIds) {
          form.reset({
            name: response.data.name || "",
            email: response.data.email || "",
            phoneNumber: response.data.phoneNumber || "",
            categoryIds: response.data.categoryIds || [],
            eventIds: response.data.eventIds || [],
          });
          console.log("Form updated with fresh data from server");
        }
      } else {
        console.log("Creating new volunteer");
        response = await axios.post(`${apiURL}/volunteers`, backendData);
        console.log("Volunteer created successfully:", response.data);
      }

      if (onSubmit) {
        onSubmit(response.data);
      }

      if (!initialData?.id) {
        form.reset();
      }

      alert(
        `Volunteer ${initialData?.id ? "updated" : "created"} successfully!`
      );
      console.log("Operation completed successfully");
    } catch (error) {
      console.error("Error saving volunteer:", error);

      // Handle different error types
      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          "Server error occurred";
        alert(`Error: ${errorMessage}`);
      } else if (error.request) {
        alert(
          "Error: Unable to connect to server. Please check your connection."
        );
      } else {
        alert("Error: An unexpected error occurred while saving.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {initialData?.id ? "Edit Event" : "Create New Event"}
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
                  <FormLabel>Event Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter event description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter location" {...field} />
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

export default EditEventForm;

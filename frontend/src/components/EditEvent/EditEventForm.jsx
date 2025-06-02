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
  name: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.string().min(1, "Date is required"),
  location: z.string().min(2, "Location is required"),
  categoryIds: z.array(z.string()).optional(),
  maxParticipants: z.coerce.number().optional(),
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [events, setEvents] = useState([]);

  const form = useForm({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: initialData?.title || "",
      description: initialData?.description || "",
      date: initialData?.date || "",
      location: initialData?.location || "",
      maxParticipants: initialData?.maxParticipants || "",
      categoryIds: [],
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

  const saveEvent = async (formData) => {
    setIsSubmitting(true);
    try {
      console.log("Submitting volunteer data:", formData);

      //Make sure the data is set up correctly to be sent to the backend.
      const backendData = {
        name: formData.name,
        description: formData.description, // Send null if empty
        date: formData.date, // Send null if empty
        location: formData.location, // Send null if empty
        maxParticipants: formData.maxParticipants
          ? parseInt(formData.maxParticipants)
          : null,
        categoryIds: formData.categoryIds?.map((id) => parseInt(id)) || [],
      };
      console.log("Transformed data for backend:", backendData);

      let response;

      //if we are coming in to adjust event details.
      //UPDATE existing event
      if (initialData?.id) {
        //Set up the code to update the event
        console.log(`Updating Event with ID: ${initialData.id}`);

        response = await axios.patch(
          `${apiURL}/events/${initialData.id}`,
          backendData
        );
        console.log("Volunteer updated successfully:", response.data);
      } else {
        //Create New Event
        console.log("Creating new Event");
        response = await axios.post(`${apiURL}/events/`, backendData);
        console.log("Event created successfully:", response.data);
      }

      if (onSubmit) {
        onSubmit(response.data);
      }

      if (!initialData?.id) {
        form.reset();
      }

      alert(`Event ${initialData?.id ? "updated" : "created"} successfully!`);
      console.log("Operation completed successfully");
    } catch (error) {
      console.error("Error saving volunteer:", error);

      // Handle different error types
      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          error.response.data?.details ||
          "Server error occurred";
        alert(`Error: ${errorMessage}`);

        //Log for errors/bugging...
        console.error("Full error response:", {
          status: error.response.status,
          data: error.response.data,
          url: error.config?.url,
          method: error.config?.method,
          sentData: backendData,
        });
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
        {process.env.NODE_ENV === "development" && (
          <div className="mb-4 p-3 bg-gray-100 rounded text-xs">
            <strong>Debug Info:</strong>
            <div>Mode: {initialData?.id ? "EDIT" : "CREATE"}</div>
            <div>
              Initial CategoryIds: {JSON.stringify(initialData?.categoryIds)}
            </div>
            <div>
              Current Form CategoryIds:{" "}
              {JSON.stringify(watchedValues.categoryIds)}
            </div>
            <div>Initial EventIds: {JSON.stringify(initialData?.eventIds)}</div>
            <div>
              Current Form EventIds: {JSON.stringify(watchedValues.eventIds)}
            </div>
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(saveEvent)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
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

            <FormField
              control={form.control}
              name="categoryIds"
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
                          name="categoryIds"
                          render={({ field }) => {
                            const committeeIdStr = committee.id.toString();
                            const isChecked =
                              field.value?.includes(committeeIdStr);

                            return (
                              <FormItem
                                key={committee.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={isChecked}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...(field.value || []),
                                            committeeIdStr,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) =>
                                                value !== committeeIdStr
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={loading || isSubmitting}>
                {isSubmitting
                  ? initialData?.id
                    ? "Updating..."
                    : "Creating..."
                  : initialData?.id
                  ? "Update Volunteer"
                  : "Create Volunteer"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EditEventForm;

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
  volunteerIds: z.array(z.string()).optional(),
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
  const [volunteers, setVolunteers] = useState([]);
  const [loadingVolunteers, setLoadingVolunteers] = useState(true);

  const form = useForm({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: initialData?.title || "",
      description: initialData?.description || "",
      date: initialData?.date || "",
      location: initialData?.location || "",
      maxParticipants: initialData?.maxParticipants || "",
      categoryIds: [],
      volunteerIds: [],
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

  // Load volunteers
  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        setLoadingVolunteers(true);
        const response = await axios.get(`${apiURL}/volunteers`);
        console.log("Fetched volunteers:", response.data);
        setVolunteers(response.data);
      } catch (error) {
        console.error("Error fetching volunteers:", error);
        setVolunteers([]);
      } finally {
        setLoadingVolunteers(false);
      }
    };

    fetchVolunteers();
  }, [apiURL]);

  //Log Values for debugging
  const watchedValues = form.watch();

  useEffect(() => {
    console.log("Current form values:", watchedValues);
  }, [watchedValues]);

  // useEffect to check and then fill in the data
  useEffect(() => {
    if (initialData) {
      console.log("Setting form data with initialData:", initialData);

      // Process the category and volunteer IDs
      let categoryIds = [];
      let volunteerIds = [];

      // Handle categoryIds - check for 'categories' array of objects or direct categoryIds
      if (initialData.categoryIds && Array.isArray(initialData.categoryIds)) {
        categoryIds = initialData.categoryIds.map((id) => id.toString());
      } else if (
        initialData.categories &&
        Array.isArray(initialData.categories)
      ) {
        categoryIds = initialData.categories.map((c) => c.id.toString());
      }

      // Handle volunteerIds - check for 'volunteers' array of objects or direct volunteerIds
      if (initialData.volunteerIds && Array.isArray(initialData.volunteerIds)) {
        volunteerIds = initialData.volunteerIds.map((id) => id.toString());
      } else if (
        initialData.volunteers &&
        Array.isArray(initialData.volunteers)
      ) {
        volunteerIds = initialData.volunteers.map((v) => v.id.toString());
      }

      console.log("Processed categoryIds:", categoryIds);
      console.log("Processed volunteerIds:", volunteerIds);

      // Format the date properly (backend might return full datetime)
      let formattedDate = initialData.date;
      if (formattedDate && formattedDate.includes("T")) {
        formattedDate = formattedDate.split("T")[0]; // Get just the date part
      }

      // Reset the form with the initial data
      form.reset({
        name: initialData.title || initialData.name || "",
        description: initialData.description || "",
        date: formattedDate || "",
        location: initialData.location || "",
        maxParticipants: initialData.maxParticipants?.toString() || "",
        categoryIds: categoryIds,
        volunteerIds: volunteerIds,
      });

      console.log(
        "Form reset with initial data. Current values:",
        form.getValues()
      );
    }
  }, [initialData, form]);

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
        volunteerIds: formData.volunteerIds?.map((id) => parseInt(id)) || [],
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
        response = await axios.post(`${apiURL}/events`, backendData);
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
            <div>Has Initial Data: {initialData ? "YES" : "NO"}</div>
            <div>
              Initial Data Keys:{" "}
              {initialData ? Object.keys(initialData).join(", ") : "None"}
            </div>
            <div>
              Initial Title/Name:{" "}
              {initialData?.title || initialData?.name || "None"}
            </div>
            <div>Form Name Value: {watchedValues.name || "Empty"}</div>
            <div>
              Form Description Value: {watchedValues.description || "Empty"}
            </div>
            <div>Form Date Value: {watchedValues.date || "Empty"}</div>
            <div>
              Initial CategoryIds: {JSON.stringify(initialData?.categoryIds)}
            </div>
            <div>
              Current Form CategoryIds:{" "}
              {JSON.stringify(watchedValues.categoryIds)}
            </div>
            <div>
              Initial VolunteerIds: {JSON.stringify(initialData?.volunteerIds)}
            </div>
            <div>
              Current Form VolunteerIds:{" "}
              {JSON.stringify(watchedValues.volunteerIds)}
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
              name="maxParticipants"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Participants (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter maximum participants"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Committee */}
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

            {/* Volunteer Section*/}
            <FormField
              control={form.control}
              name="volunteerIds"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">
                      Volunteer Assignment
                    </FormLabel>
                    <FormDescription>
                      Select volunteers to assign to this event (optional).
                    </FormDescription>
                  </div>

                  {loadingVolunteers ? (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">
                        Loading volunteers...
                      </p>
                    </div>
                  ) : volunteers.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">
                        No volunteers available at this time.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-64 overflow-y-auto border rounded-lg p-3">
                      {volunteers.map((volunteer) => (
                        <FormField
                          key={volunteer.id}
                          control={form.control}
                          name="volunteerIds"
                          render={({ field }) => {
                            const volunteerIdStr = volunteer.id.toString();
                            const isChecked =
                              field.value?.includes(volunteerIdStr);

                            return (
                              <FormItem
                                key={volunteer.id}
                                className="flex flex-row items-start space-x-3 space-y-0 border rounded-lg p-3"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={isChecked}
                                    onCheckedChange={(checked) => {
                                      const currentValues = field.value || [];

                                      if (checked) {
                                        field.onChange([
                                          ...currentValues,
                                          volunteerIdStr,
                                        ]);
                                      } else {
                                        field.onChange(
                                          currentValues.filter(
                                            (value) => value !== volunteerIdStr
                                          )
                                        );
                                      }
                                    }}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none flex-1">
                                  <FormLabel className="text-sm font-medium">
                                    {volunteer.name}
                                  </FormLabel>
                                  {volunteer.email && (
                                    <p className="text-xs text-muted-foreground">
                                      Email: {volunteer.email}
                                    </p>
                                  )}
                                  {volunteer.phoneNumber && (
                                    <p className="text-xs text-muted-foreground">
                                      Phone: {volunteer.phoneNumber}
                                    </p>
                                  )}
                                  {/* Show volunteer's committees if available */}
                                  {volunteer.committees &&
                                    volunteer.committees.length > 0 && (
                                      <p className="text-xs text-muted-foreground">
                                        Committees:{" "}
                                        {volunteer.committees
                                          .map((c) => c.name)
                                          .join(", ")}
                                      </p>
                                    )}
                                </div>
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
                  ? "Update Event"
                  : "Create Event"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default EditEventForm;

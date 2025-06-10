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

const volunteerFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  phoneNumber: z.string().optional(),
  categoryIds: z.array(z.string()).optional(),
  eventIds: z.array(z.string()).optional(),
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  const form = useForm({
    resolver: zodResolver(volunteerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      categoryIds: [],
      eventIds: [],
    },
  });

  //Pull the committees
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

  //pull the events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoadingEvents(true);
        const response = await axios.get(`${apiURL}/events`);
        console.log("Fetched events:", response.data);
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, [apiURL]);

  //refresh page to fill in intial data
  useEffect(() => {
    if (initialData) {
      // Ensure we have arrays of strings for the IDs
      let categoryIds = [];
      let eventIds = [];

      // Handle categoryIds - check multiple possible sources
      if (initialData.categoryIds && Array.isArray(initialData.categoryIds)) {
        categoryIds = initialData.categoryIds.map((id) => id.toString());
      } else if (
        initialData.categories &&
        Array.isArray(initialData.categories)
      ) {
        // Find Categories
        categoryIds = initialData.categories.map((c) => c.id.toString());
      }

      // Check all the sources for event ids
      if (initialData.eventIds && Array.isArray(initialData.eventIds)) {
        eventIds = initialData.eventIds.map((id) => id.toString());
      } else if (initialData.events && Array.isArray(initialData.events)) {
        eventIds = initialData.events.map((e) => e.id.toString());
      }

      // Reset the form with new values
      form.reset({
        name: initialData.name || "",
        email: initialData.email || "",
        phoneNumber: initialData.phoneNumber || "",
        categoryIds: categoryIds,
        eventIds: eventIds,
      });
    }
  }, [initialData, form]);

  // Log current form values for debugging
  const watchedValues = form.watch();

  useEffect(() => {}, [watchedValues]);

  const saveVolunteer = async (formData) => {
    setIsSubmitting(true);
    try {
      console.log("Submitting volunteer data:", formData);

      //Make sure the data is set up correctly to be sent to the backend.
      const backendData = {
        name: formData.name,
        email: formData.email || null,
        phoneNumber: formData.phoneNumber || null,
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
        }
      } else {
        response = await axios.post(`${apiURL}/volunteers`, backendData);
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
          {initialData?.id ? "Edit Volunteer" : "Create New Volunteer"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(saveVolunteer)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
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
              name="email"
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
              name="phoneNumber"
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

            {/* Events Selection Field */}
            <FormField
              control={form.control}
              name="eventIds"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-base">
                      Event Participation
                    </FormLabel>
                    <FormDescription>
                      Select the events you would like to volunteer for
                      (optional).
                    </FormDescription>
                  </div>

                  {loadingEvents ? (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">Loading events...</p>
                    </div>
                  ) : events.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">
                        No events available at this time.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {events.map((event) => (
                        <FormField
                          key={event.id}
                          control={form.control}
                          name="eventIds"
                          render={({ field }) => {
                            const eventIdStr = event.id.toString();
                            return (
                              <FormItem
                                key={event.id}
                                className="flex flex-row items-start space-x-3 space-y-0 border rounded-lg p-3"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(eventIdStr)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...(field.value || []),
                                            eventIdStr,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== eventIdStr
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="text-sm font-medium">
                                    {event.title || event.name}
                                  </FormLabel>
                                  {event.description && (
                                    <p className="text-xs text-muted-foreground">
                                      {event.description}
                                    </p>
                                  )}
                                  {event.date && (
                                    <p className="text-xs text-muted-foreground">
                                      Date:{" "}
                                      {new Date(
                                        event.date
                                      ).toLocaleDateString()}
                                    </p>
                                  )}
                                  {event.location && (
                                    <p className="text-xs text-muted-foreground">
                                      Location: {event.location}
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
              <Button
                type="submit"
                disabled={loading || isSubmitting} // Use isSubmitting instead of just loading
              >
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

export default VolunteerForm;

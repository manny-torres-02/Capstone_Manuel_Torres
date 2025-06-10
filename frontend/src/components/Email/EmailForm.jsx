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

//Schema
const emailFormSchema = z.object({
  emailSubject: z.string().min(1, "Subject is required"),
  emailMessage: z.string().min(1, "Message is required"),
  recipients: z.array(z.string()).optional(),
});

const EmailForm = ({ initialData, onSubmit, onCancel, loading = false }) => {
  const apiURL = import.meta.env.VITE_APP_API_URL || "http://localhost:8080";
  const [volunteers, setVolunteers] = useState([]);
  const [loadingVolunteers, setLoadingVolunteers] = useState(true);
  const [sending, setSending] = useState(false);

  // Define the form
  const form = useForm({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      emailSubject: initialData?.emailSubject || "",
      emailMessage: initialData?.emailMessage || "",
      recipients: [],
    },
  });

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const response = await axios.get(`${apiURL}/email/volunteers`);
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

  //set up event handler
  const handleSubmit = async (formData) => {
    console.log("Email form submitted:", formData);
    setSending(true);

    try {
      const response = await axios.post(`${apiURL}/email/send`, {
        subject: formData.emailSubject,
        message: formData.emailMessage,
        recipientIds: formData.recipients,
      });

      console.log("Email sent successfully:", response.data);
      alert(`Email sent successfully! ${response.data.message}`);

      if (onSubmit) {
        onSubmit(formData);
      }

      // Reset form
      form.reset();
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Send Email to Volunteers</CardTitle>
          <p className="text-muted-foreground">
            Compose and send emails to selected volunteers
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <FormField
                name="emailSubject"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Email subject" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="emailMessage"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your message"
                        rows={6}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="recipients"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">
                        Select Recipients
                      </FormLabel>
                      <FormDescription>
                        Choose volunteers to send the email to.
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
                          No volunteers with email addresses found.
                        </p>
                      </div>
                    ) : (
                      <div className="border rounded-lg p-3">
                        <div className="space-y-3">
                          {volunteers.map((volunteer) => (
                            <FormField
                              key={volunteer.id}
                              control={form.control}
                              name="recipients"
                              render={({ field }) => {
                                const volunteerIdStr = volunteer.id.toString();
                                const isChecked =
                                  field.value?.includes(volunteerIdStr);

                                return (
                                  <FormItem
                                    key={volunteer.id}
                                    className="flex flex-row items-start space-x-3 space-y-0 border rounded-lg p-3 hover:bg-gray-50 transition-colors"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={isChecked}
                                        onCheckedChange={(checked) => {
                                          const currentValues =
                                            field.value || [];
                                          if (checked) {
                                            field.onChange([
                                              ...currentValues,
                                              volunteerIdStr,
                                            ]);
                                          } else {
                                            field.onChange(
                                              currentValues.filter(
                                                (value) =>
                                                  value !== volunteerIdStr
                                              )
                                            );
                                          }
                                        }}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none flex-1">
                                      <FormLabel className="text-sm font-medium cursor-pointer">
                                        {volunteer.name}
                                      </FormLabel>
                                      <p className="text-xs text-muted-foreground">
                                        {volunteer.email}
                                      </p>
                                    </div>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
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
                  {loading ? "Sending..." : "Send Email"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};
export default EmailForm;

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
  // Define the form
  const form = useForm({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      emailSubject: initialData?.emailSubject || "",
      emailMessage: initialData?.emailMessage || "",
      recipients: [],
    },
  });

  //set up event handler. 
  const handleSubmit = async (formData) => {
    console.log("Email form submitted:", formData);

    try {
      if (onSubmit) {
        onSubmit(formData);
      }
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  return (
    <>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>EMAIL FORM</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={{}} className="space-y-6">
              <FormField
                name="emailSubject"
                // conrol={form}
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
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};
export default EmailForm;

'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form' // Assuming Form components exist
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast' // Assuming toast exists

// Define the Zod schema for the form
const settingsFormSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
})

// Infer the type from the schema
type SettingsFormValues = z.infer<typeof settingsFormSchema>

// Default values (optional, could fetch user settings later)
const defaultValues: Partial<SettingsFormValues> = {
  username: 'DefaultUser',
  email: 'user@example.com',
}

export function SettingsForm() {
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues,
    mode: 'onChange', // Validate on change
  })

  function onSubmit(data: SettingsFormValues) {
    // TODO: Implement actual API call to save settings
    console.log('Submitting settings:', data)
    toast({
      title: 'Settings Submitted (Placeholder)',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }: { field: any }) => ( // Explicitly type field for now
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Your username" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage /> {/* Displays validation errors */}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }: { field: any }) => ( // Explicitly type field for now
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Your email address" {...field} />
              </FormControl>
              <FormDescription>
                Your email address for notifications.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update Settings</Button>
      </form>
    </Form>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Save, RefreshCw, Database, Cpu, FileText } from "lucide-react"

export default function SettingsPage() {
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    setIsSaving(true)

    // Simulate saving
    setTimeout(() => {
      setIsSaving(false)

      toast({
        title: "Settings Saved",
        description: "Your settings have been saved successfully.",
      })
    }, 1500)
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 w-full">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="localization">Localization</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure general system settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="system-name">System Name</Label>
                <Input id="system-name" defaultValue="dokudoku - Intelligent Document Processing" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input id="company-name" defaultValue="Acme Corporation" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-email">Administrator Email</Label>
                <Input id="admin-email" type="email" defaultValue="admin@example.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="support-email">Support Email</Label>
                <Input id="support-email" type="email" defaultValue="support@example.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="system-logo">System Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-md border flex items-center justify-center bg-muted">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <Button variant="outline">Upload Logo</Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dashboard-refresh">Dashboard Refresh Interval (seconds)</Label>
                <Input id="dashboard-refresh" type="number" defaultValue="60" />
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="maintenance-mode" />
                <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Interface Settings</CardTitle>
              <CardDescription>Configure user interface preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Default Theme</Label>
                <Select defaultValue="light">
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="items-per-page">Items Per Page</Label>
                <Select defaultValue="10">
                  <SelectTrigger id="items-per-page">
                    <SelectValue placeholder="Select number" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="show-welcome" defaultChecked />
                <Label htmlFor="show-welcome">Show Welcome Message</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="show-tooltips" defaultChecked />
                <Label htmlFor="show-tooltips">Show Tooltips</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="animations" defaultChecked />
                <Label htmlFor="animations">Enable Animations</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="processing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Processing Settings</CardTitle>
              <CardDescription>Configure document processing options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="max-file-size">Maximum File Size (MB)</Label>
                <Input id="max-file-size" type="number" defaultValue="50" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supported-formats">Supported File Formats</Label>
                <Input id="supported-formats" defaultValue="pdf,docx,txt,xlsx" />
                <p className="text-xs text-muted-foreground mt-1">Comma-separated list of file extensions</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ocr-engine">OCR Engine</Label>
                <Select defaultValue="tesseract">
                  <SelectTrigger id="ocr-engine">
                    <SelectValue placeholder="Select OCR engine" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tesseract">Tesseract</SelectItem>
                    <SelectItem value="azure">Azure Computer Vision</SelectItem>
                    <SelectItem value="google">Google Cloud Vision</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ocr-languages">OCR Languages</Label>
                <Select defaultValue="en">
                  <SelectTrigger id="ocr-languages">
                    <SelectValue placeholder="Select languages" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="en,ms">English, Bahasa Malaysia</SelectItem>
                    <SelectItem value="en,ms,zh">English, Bahasa Malaysia, Mandarin</SelectItem>
                    <SelectItem value="all">All Supported Languages</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="processing-threads">Processing Threads</Label>
                <Input id="processing-threads" type="number" defaultValue="4" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="processing-timeout">Processing Timeout (minutes)</Label>
                <Input id="processing-timeout" type="number" defaultValue="30" />
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="enable-ocr" defaultChecked />
                <Label htmlFor="enable-ocr">Enable OCR for Image-based PDFs</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="auto-process" defaultChecked />
                <Label htmlFor="auto-process">Automatically Process Uploaded Documents</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>NLP & Analytics Engine Settings</CardTitle>
              <CardDescription>Configure NLP and analytics engine options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nlp-engine">NLP Engine</Label>
                <Select defaultValue="spacy">
                  <SelectTrigger id="nlp-engine">
                    <SelectValue placeholder="Select NLP engine" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spacy">spaCy</SelectItem>
                    <SelectItem value="nltk">NLTK</SelectItem>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="azure">Azure Language Understanding</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="entity-types">Entity Types to Extract</Label>
                <Textarea
                  id="entity-types"
                  defaultValue="Project ID, Client Name, Vendor Name, Cost, Date, Location, Person, Technology"
                  rows={3}
                />
                <p className="text-xs text-muted-foreground mt-1">Comma-separated list of entity types to extract</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confidence-threshold">Entity Confidence Threshold</Label>
                <div className="flex items-center gap-2">
                  <Input id="confidence-threshold" type="number" defaultValue="0.7" min="0" max="1" step="0.05" />
                  <span className="text-sm text-muted-foreground">0.0 - 1.0</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-entities">Maximum Entities Per Document</Label>
                <Input id="max-entities" type="number" defaultValue="500" />
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="enable-relationship" defaultChecked />
                <Label htmlFor="enable-relationship">Enable Relationship Extraction</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="enable-sentiment" />
                <Label htmlFor="enable-sentiment">Enable Sentiment Analysis</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security and authentication options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="auth-method">Authentication Method</Label>
                <Select defaultValue="local">
                  <SelectTrigger id="auth-method">
                    <SelectValue placeholder="Select authentication method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="local">Local Authentication</SelectItem>
                    <SelectItem value="ldap">LDAP</SelectItem>
                    <SelectItem value="oauth">OAuth 2.0</SelectItem>
                    <SelectItem value="saml">SAML</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                <Input id="session-timeout" type="number" defaultValue="30" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password-policy">Password Policy</Label>
                <Select defaultValue="strong">
                  <SelectTrigger id="password-policy">
                    <SelectValue placeholder="Select password policy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic (8+ characters)</SelectItem>
                    <SelectItem value="medium">Medium (8+ chars, mixed case)</SelectItem>
                    <SelectItem value="strong">Strong (8+ chars, mixed case, numbers, symbols)</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password-expiry">Password Expiry (days)</Label>
                <Input id="password-expiry" type="number" defaultValue="90" />
                <p className="text-xs text-muted-foreground mt-1">Set to 0 for no expiry</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-login-attempts">Maximum Login Attempts</Label>
                <Input id="max-login-attempts" type="number" defaultValue="5" />
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="enable-2fa" defaultChecked />
                <Label htmlFor="enable-2fa">Enable Two-Factor Authentication</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="enforce-ssl" defaultChecked />
                <Label htmlFor="enforce-ssl">Enforce SSL</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="audit-logging" defaultChecked />
                <Label htmlFor="audit-logging">Enable Audit Logging</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Protection</CardTitle>
              <CardDescription>Configure data protection and privacy settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="data-retention">Data Retention Period (days)</Label>
                <Input id="data-retention" type="number" defaultValue="365" />
                <p className="text-xs text-muted-foreground mt-1">Set to 0 for indefinite retention</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="backup-frequency">Backup Frequency</Label>
                <Select defaultValue="daily">
                  <SelectTrigger id="backup-frequency">
                    <SelectValue placeholder="Select backup frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="encrypt-data" defaultChecked />
                <Label htmlFor="encrypt-data">Encrypt Stored Data</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="anonymize-data" />
                <Label htmlFor="anonymize-data">Anonymize Personal Data</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure system notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-provider">Email Provider</Label>
                <Select defaultValue="smtp">
                  <SelectTrigger id="email-provider">
                    <SelectValue placeholder="Select email provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="smtp">SMTP</SelectItem>
                    <SelectItem value="sendgrid">SendGrid</SelectItem>
                    <SelectItem value="mailgun">Mailgun</SelectItem>
                    <SelectItem value="ses">Amazon SES</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtp-host">SMTP Host</Label>
                <Input id="smtp-host" defaultValue="smtp.example.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtp-port">SMTP Port</Label>
                <Input id="smtp-port" type="number" defaultValue="587" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtp-username">SMTP Username</Label>
                <Input id="smtp-username" defaultValue="notifications@example.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtp-password">SMTP Password</Label>
                <Input id="smtp-password" type="password" defaultValue="••••••••••••" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="from-email">From Email</Label>
                <Input id="from-email" type="email" defaultValue="notifications@example.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="from-name">From Name</Label>
                <Input id="from-name" defaultValue="dokudoku System" />
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="enable-email" defaultChecked />
                <Label htmlFor="enable-email">Enable Email Notifications</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="enable-browser" defaultChecked />
                <Label htmlFor="enable-browser">Enable Browser Notifications</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notification Events</CardTitle>
              <CardDescription>Configure which events trigger notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base">Document Processing</Label>
                <div className="space-y-2 ml-6">
                  <div className="flex items-center space-x-2">
                    <Switch id="notify-upload" defaultChecked />
                    <Label htmlFor="notify-upload">Document Upload</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="notify-processing-complete" defaultChecked />
                    <Label htmlFor="notify-processing-complete">Processing Complete</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="notify-processing-error" defaultChecked />
                    <Label htmlFor="notify-processing-error">Processing Error</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-base">User Management</Label>
                <div className="space-y-2 ml-6">
                  <div className="flex items-center space-x-2">
                    <Switch id="notify-user-created" defaultChecked />
                    <Label htmlFor="notify-user-created">User Created</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="notify-user-login" />
                    <Label htmlFor="notify-user-login">User Login</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="notify-password-reset" defaultChecked />
                    <Label htmlFor="notify-password-reset">Password Reset</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-base">System</Label>
                <div className="space-y-2 ml-6">
                  <div className="flex items-center space-x-2">
                    <Switch id="notify-system-error" defaultChecked />
                    <Label htmlFor="notify-system-error">System Error</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="notify-source-sync" defaultChecked />
                    <Label htmlFor="notify-source-sync">Source Synchronization</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="notify-backup" defaultChecked />
                    <Label htmlFor="notify-backup">Backup Complete</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="localization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Localization Settings</CardTitle>
              <CardDescription>Configure language and regional settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="default-language">Default Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger id="default-language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ms">Bahasa Malaysia</SelectItem>
                    <SelectItem value="zh">Mandarin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date-format">Date Format</Label>
                <Select defaultValue="yyyy-mm-dd">
                  <SelectTrigger id="date-format">
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                    <SelectItem value="dd-mm-yyyy">DD-MM-YYYY</SelectItem>
                    <SelectItem value="mm-dd-yyyy">MM-DD-YYYY</SelectItem>
                    <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time-format">Time Format</Label>
                <Select defaultValue="24h">
                  <SelectTrigger id="time-format">
                    <SelectValue placeholder="Select time format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">24-hour (HH:MM)</SelectItem>
                    <SelectItem value="12h">12-hour (hh:mm AM/PM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="utc+8">
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="utc+8">UTC+8 (Malaysia/Singapore)</SelectItem>
                    <SelectItem value="utc+7">UTC+7 (Western Indonesia)</SelectItem>
                    <SelectItem value="utc-5">UTC-5 (Eastern US)</SelectItem>
                    <SelectItem value="utc-8">UTC-8 (Pacific US)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="first-day">First Day of Week</Label>
                <Select defaultValue="monday">
                  <SelectTrigger id="first-day">
                    <SelectValue placeholder="Select first day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sunday">Sunday</SelectItem>
                    <SelectItem value="monday">Monday</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="enable-multilingual" defaultChecked />
                <Label htmlFor="enable-multilingual">Enable Multilingual Interface</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="user-language-select" defaultChecked />
                <Label htmlFor="user-language-select">Allow Users to Select Language</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>Configure advanced system settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="log-level">Log Level</Label>
                <Select defaultValue="info">
                  <SelectTrigger id="log-level">
                    <SelectValue placeholder="Select log level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="debug">Debug</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warn">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="log-retention">Log Retention (days)</Label>
                <Input id="log-retention" type="number" defaultValue="30" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="api-rate-limit">API Rate Limit (requests per minute)</Label>
                <Input id="api-rate-limit" type="number" defaultValue="100" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cache-ttl">Cache TTL (seconds)</Label>
                <Input id="cache-ttl" type="number" defaultValue="3600" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="temp-storage">Temporary Storage Path</Label>
                <Input id="temp-storage" defaultValue="/tmp/dokudoku" />
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="enable-debug" />
                <Label htmlFor="enable-debug">Enable Debug Mode</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="enable-performance-monitoring" defaultChecked />
                <Label htmlFor="enable-performance-monitoring">Enable Performance Monitoring</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="enable-api-logging" defaultChecked />
                <Label htmlFor="enable-api-logging">Enable API Request Logging</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Maintenance</CardTitle>
              <CardDescription>System maintenance operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Database Operations</Label>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline">
                    <Database className="mr-2 h-4 w-4" />
                    Backup Database
                  </Button>
                  <Button variant="outline">
                    <Database className="mr-2 h-4 w-4" />
                    Optimize Database
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Cache Operations</Label>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Clear Cache
                  </Button>
                  <Button variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Rebuild Search Index
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>System Operations</Label>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline">
                    <Cpu className="mr-2 h-4 w-4" />
                    System Diagnostics
                  </Button>
                  <Button variant="outline" className="text-red-500 hover:text-red-500">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Restart Services
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}


import { useState } from "react";
import {
  User,
  Building2,
  Bell,
  Shield,
  CreditCard,
  Users,
  Palette,
  Mail,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [taskReminders, setTaskReminders] = useState(true);
  const [deadlineAlerts, setDeadlineAlerts] = useState(true);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-lg font-semibold">Settings</h2>
        <p className="text-sm text-muted-foreground">
          Manage your account and application preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="practice" className="gap-2">
            <Building2 className="h-4 w-4" />
            Practice
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="team" className="gap-2">
            <Users className="h-4 w-4" />
            Team
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Smith" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="john.smith@accountpro.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" defaultValue="+44 7700 900123" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Job Title</Label>
                <Input id="role" defaultValue="Senior Accountant" />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>
                Manage your password and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
              </div>
              <Button>Update Password</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="practice" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Practice Details</CardTitle>
              <CardDescription>
                Update your practice information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="practiceName">Practice Name</Label>
                <Input id="practiceName" defaultValue="AccountPro Ltd" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="practiceEmail">Email</Label>
                  <Input id="practiceEmail" type="email" defaultValue="info@accountpro.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="practicePhone">Phone</Label>
                  <Input id="practicePhone" defaultValue="+44 20 1234 5678" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" defaultValue="123 Business Street, London, EC1A 1BB" />
              </div>
              <Separator />
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="vatNumber">VAT Number</Label>
                  <Input id="vatNumber" defaultValue="GB123456789" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyNumber">Company Number</Label>
                  <Input id="companyNumber" defaultValue="12345678" />
                </div>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>
                Configure which emails you'd like to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive email updates about your account
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Task Reminders</p>
                  <p className="text-sm text-muted-foreground">
                    Get reminded about upcoming tasks
                  </p>
                </div>
                <Switch
                  checked={taskReminders}
                  onCheckedChange={setTaskReminders}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Deadline Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts for approaching deadlines
                  </p>
                </div>
                <Switch
                  checked={deadlineAlerts}
                  onCheckedChange={setDeadlineAlerts}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                Manage your team and their permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "John Smith", role: "Admin", email: "john@accountpro.com" },
                  { name: "Sarah Jones", role: "Accountant", email: "sarah@accountpro.com" },
                  { name: "Mike Brown", role: "Accountant", email: "mike@accountpro.com" },
                  { name: "Emma Wilson", role: "Tax Specialist", email: "emma@accountpro.com" },
                ].map((member) => (
                  <div
                    key={member.email}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">{member.role}</span>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="mt-4">
                <Users className="mr-2 h-4 w-4" />
                Invite Team Member
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

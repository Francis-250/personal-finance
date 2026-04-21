"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  Camera,
  Mail,
  User,
  Shield,
  Key,
  Smartphone,
  CalendarDays,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface UserProps {
  name: string;
  email: string;
  image?: string | null;
  role: string;
  emailVerified: boolean;
  createdAt?: string;
}

export default function SettingsPage() {
  const [user, setUser] = useState<UserProps | null>(null);

  const [name, setName] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const { data } = await authClient.getSession();
      if (data?.user) {
        setUser(data?.user);
        setName(data.user.name || "");
      }
    }
    loadUser();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingProfile(true);

    const { error } = await authClient.updateUser({ name });

    setLoadingProfile(false);

    if (error) {
      toast.error(error.message || "Failed to update profile");
    } else {
      toast.success("Profile updated successfully");
      setUser({ ...user, name });
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setLoadingPassword(true);

    const { error } = await authClient.changePassword({
      newPassword,
      currentPassword,
      revokeOtherSessions: true,
    });

    setLoadingPassword(false);

    if (error) {
      toast.error(error.message || "Failed to change password");
    } else {
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  if (!user) {
    return (
      <div className="flex w-full items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      })
    : "Unknown";

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <Card className="mt-2">
        <CardContent className="p-6 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative group">
              <Avatar className="w-24 h-24 sm:w-28 sm:h-28 border border-border bg-muted">
                <AvatarImage src={user.image || ""} />
                <AvatarFallback className="text-3xl text-muted-foreground">
                  {user.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="space-y-2 text-center sm:text-left sm:mt-4">
              <h1 className="text-3xl font-bold tracking-tight">{user.name}</h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-muted-foreground text-sm">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4" /> {user.email}
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="w-4 h-4" /> Joined {joinDate}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-center sm:justify-end">
            <Badge
              variant="secondary"
              className="px-3 py-1 text-sm rounded-full"
            >
              {user.role === "admin" ? "Admin" : "Member"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col md:flex-row gap-8">
        <Tabs
          defaultValue="account"
          className="w-full flex flex-col md:flex-row gap-8"
        >
          <div className="md:w-64 shrink-0">
            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="p-0">
                <TabsList className="flex flex-col h-auto w-full bg-transparent gap-2 p-0">
                  <TabsTrigger
                    value="account"
                    className="w-full justify-start gap-3 px-4 py-3 rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-medium transition-all"
                  >
                    <User className="w-4 h-4" /> Account
                  </TabsTrigger>
                  <TabsTrigger
                    value="security"
                    className="w-full justify-start gap-3 px-4 py-3 rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-medium transition-all"
                  >
                    <Shield className="w-4 h-4" /> Security
                  </TabsTrigger>
                  <TabsTrigger
                    value="devices"
                    className="w-full justify-start gap-3 px-4 py-3 rounded-xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-medium transition-all"
                  >
                    <Smartphone className="w-4 h-4" /> Active Devices
                  </TabsTrigger>
                </TabsList>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 w-full max-w-3xl">
            {/* Account Tab */}
            <TabsContent
              value="account"
              className="mt-0 space-y-6 outline-none"
            >
              <Card className="border shadow-sm rounded-xl overflow-hidden">
                <CardHeader className="bg-muted/30 pb-4 border-b">
                  <CardTitle className="text-xl">Profile Settings</CardTitle>
                  <CardDescription>
                    Manage your personal information and how others see you on
                    the platform.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleUpdateProfile}>
                  <CardContent className="p-6 space-y-6">
                    <FieldGroup>
                      <Field>
                        <FieldLabel
                          htmlFor="fullName"
                          className="text-sm font-semibold"
                        >
                          Full Name
                        </FieldLabel>
                        <Input
                          id="fullName"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your complete name"
                          className="max-w-md h-11"
                          required
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          This is the name that will be displayed on your
                          profile and in emails.
                        </p>
                      </Field>

                      <Separator className="my-2" />

                      <Field>
                        <FieldLabel className="text-sm font-semibold">
                          Email Address
                        </FieldLabel>
                        <div className="flex gap-4 items-center">
                          <Input
                            id="email"
                            value={user.email}
                            readOnly
                            disabled
                            className="max-w-md h-11 bg-muted/50"
                          />
                          <Badge
                            variant={user.emailVerified ? "default" : "outline"}
                            className="cursor-default"
                          >
                            {user.emailVerified ? "Verified" : "Unverified"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Your email address is managed via your secure login
                          provider.
                        </p>
                      </Field>
                    </FieldGroup>
                  </CardContent>
                  <CardFooter className="px-6 py-4 border-t bg-muted/10 flex justify-end">
                    <Button
                      type="submit"
                      disabled={loadingProfile}
                      className="px-8"
                    >
                      {loadingProfile ? "Saving changes..." : "Save changes"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>

              <Card className="border border-red-200/50 dark:border-red-900/50 shadow-sm rounded-xl overflow-hidden">
                <CardHeader className="bg-red-50/50 dark:bg-red-950/20 pb-4 border-b border-red-100 dark:border-red-900/50">
                  <CardTitle className="text-xl text-red-600 dark:text-red-400">
                    Danger Zone
                  </CardTitle>
                  <CardDescription>
                    Irreversible actions that affect your account.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-medium text-sm">Delete Account</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Permanently delete your account and all associated data.
                      </p>
                    </div>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="mt-0 outline-none">
              <Card className="border shadow-sm rounded-xl overflow-hidden">
                <CardHeader className="bg-muted/30 pb-4 border-b">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Key className="w-5 h-5 text-primary" /> Password & Security
                  </CardTitle>
                  <CardDescription>
                    Update your password to keep your account secure.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleUpdatePassword}>
                  <CardContent className="p-6 space-y-6">
                    <FieldGroup>
                      <Field>
                        <FieldLabel htmlFor="currentPassword">
                          Current Password
                        </FieldLabel>
                        <div className="relative max-w-md">
                          <Input
                            id="currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="h-11 pr-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showCurrentPassword ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </button>
                        </div>
                      </Field>

                      <Separator className="my-2" />

                      <Field>
                        <FieldLabel htmlFor="newPassword">
                          New Password
                        </FieldLabel>
                        <div className="relative max-w-md">
                          <Input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="h-11 pr-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showNewPassword ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Must be at least 8 characters long.
                        </p>
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="confirmPassword">
                          Confirm New Password
                        </FieldLabel>
                        <div className="relative max-w-md">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="h-11 pr-10"
                            required
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showConfirmPassword ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </button>
                        </div>
                      </Field>
                    </FieldGroup>
                  </CardContent>
                  <CardFooter className="px-6 py-4 border-t bg-muted/10 flex justify-between items-center">
                    <p className="text-xs text-muted-foreground max-w-xs">
                      Changing your password will sign you out of all other
                      active sessions securely.
                    </p>
                    <Button type="submit" disabled={loadingPassword}>
                      {loadingPassword ? "Updating..." : "Update Password"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            {/* Devices Tab */}
            <TabsContent value="devices" className="mt-0 outline-none">
              <Card className="border shadow-sm rounded-xl overflow-hidden">
                <CardHeader className="bg-muted/30 pb-4 border-b">
                  <CardTitle className="text-xl">Active Sessions</CardTitle>
                  <CardDescription>
                    Manage devices that are currently logged into your account.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-primary/10 rounded-full text-primary">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">Current Session</h4>
                        <p className="text-xs text-muted-foreground">
                          Mac OS • Web Browser
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-none">
                      Active Now
                    </Badge>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex items-center justify-between py-2 opacity-50">
                    <div className="flex gap-3 items-center">
                      <p className="text-sm">No other active devices found.</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="px-6 py-4 border-t bg-muted/10">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto"
                    onClick={() => toast.success("Revoked all other sessions")}
                  >
                    Sign out all other sessions
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

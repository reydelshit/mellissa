"use client"

import axios from "axios"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { User, Store, Building, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()

  // login states
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userType, setUserType] = useState("customer")

  // signup states
  const [signupName, setSignupName] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [showSignupModal, setShowSignupModal] = useState(false)


  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    console.log("login clicked");
    e.preventDefault();
  
    if (userType === "admin" && email.includes("admin")) {
      localStorage.setItem("role", JSON.stringify("admin"));
      toast.success("Admin login successful!");
      router.push("/admin");
      return; // skip the rest
    }
  
    let loginUrl = "";
  
    if (userType === "customer") {
      loginUrl = "http://localhost:8800/user/login";
    } else if (userType === "store-owner") {
      loginUrl = "http://localhost:8800/store-owner/login";
    }
  
    try {
      const res = await axios.post(loginUrl, {
        email,
        password,
      });
  
      console.log("res:", res.data);
      if (res.data.status === "success") {
        const user = res.data.data[0];
  
        localStorage.setItem("user_id", JSON.stringify(user.user_id));
        localStorage.setItem("role", JSON.stringify(user.role));
  
        toast.success("Login successful!");
  
        if (userType === "customer") {
          router.push("/customer");
        } else if (userType === "store-owner") {
          localStorage.setItem("store_owner_details", JSON.stringify(user));

          router.push("/store-owner");
        } else {
          toast.error("Unknown role");
        }
      } else {
        toast.error("Login failed");
        setError("Email or password is incorrect");
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Login failed");
      toast.error(err?.response?.data?.message || "Login failed");
    }
  };
  
  const handleSignup = async () => {
    try {
      const res = await axios.post("http://localhost:8800/user/create", {
        fullname: signupName,
        email: signupEmail,
        password: signupPassword,
        role: userType,
      })

      console.log(res.data)
      toast.success("Account created successfully!")
      setShowSignupModal(false)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Signup failed")
    }
  }

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-muted/40">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">MAP MAP</CardTitle>
            <CardDescription className="text-center">Login to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="customer" onValueChange={setUserType}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="customer" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Customer
                </TabsTrigger>
                <TabsTrigger value="store-owner" className="flex items-center gap-2">
                  <Store className="h-4 w-4" />
                  Store Owner
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Admin
                </TabsTrigger>
              </TabsList>

              <form onSubmit={handleLogin}>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type={
                        userType === "customer"
                          ? "email"
                          : userType === "store-owner"
                          ? "email"
                          : "text"
                      }
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <a href="#" className="text-sm text-primary hover:underline">
                        Forgot password?
                      </a>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <TabsContent value="customer" className="mt-0 space-y-4">
                    <Button type="submit" className="w-full">
                      Login as Customer
                    </Button>
                  </TabsContent>

                  <TabsContent value="store-owner" className="mt-0 space-y-4">
                    <Button type="submit" className="w-full">
                      Login as Store Owner
                    </Button>
                  </TabsContent>


                  <TabsContent value="admin" className="mt-0 space-y-4">
                    <Button type="submit" className="w-full">
                      Login as Admin
                    </Button>
                  </TabsContent>
                </div>
              </form>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
          {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            <div className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => setShowSignupModal(true)}
                className="text-primary hover:underline"
              >
                Sign up
              </button>
            </div>

            {/* <div className="text-xs text-center text-muted-foreground">
              <p>For demo purposes:</p>
              <p>Customer: customer@example.com / password</p>
              <p>Store Owner: owner@example.com / password</p>
              <p>Admin: admin@example.com / password</p>
            </div> */}

           
          </CardFooter>
        </Card>
      </div>

      {/* Sign Up Modal */}
      <Dialog open={showSignupModal} onOpenChange={setShowSignupModal}>
        <DialogContent>
          <DialogHeader className="flex items-center justify-between">
            <DialogTitle>Create an Account</DialogTitle>
        
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-name">Full Name</Label>
              <Input
                id="signup-name"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                type="password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
              />
            </div>
            <Button className="w-full" onClick={handleSignup}>
              Create Account
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

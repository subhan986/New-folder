"use client"

import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { placeOrder } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import React from "react";
import Link from "next/link";

const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  phone: z.string().min(1, "Phone number is required"),
  paymentMethod: z.enum(["cod", "card"], { required_error: "Please select a payment method" }),
});

type FormData = z.infer<typeof formSchema>;

export default function CheckoutPage() {
  const { cart, cartTotal, cartCount, clearCart } = useCart();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = React.useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      phone: "",
      paymentMethod: "cod",
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      formData.append('address', data.address);
      formData.append('city', data.city);
      formData.append('phone', data.phone);
      formData.append('paymentMethod', data.paymentMethod);
      formData.append('cartItems', JSON.stringify(cart));
      formData.append('cartTotal', (cartTotal + 5000).toString());

      const result = await placeOrder(formData);

      if (result.success) {
        toast({ title: "Order Placed!", description: result.message || "Thank you for your order. We will be in touch shortly." });
        clearCart();
        setIsOrderPlaced(true);
      } else {
        toast({ variant: "destructive", title: "Order Failed", description: result.message || "Something went wrong. Please try again." });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "An error occurred", description: (error as Error).message || "Something went wrong. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  if (cartCount === 0 && !isOrderPlaced) {
    return (
      <div className="container text-center py-20">
        <h1 className="font-headline text-3xl">Your Cart is Empty</h1>
        <p className="text-muted-foreground mt-2">You can't proceed to checkout without any items.</p>
        <Button asChild className="mt-4"><a href="/">Go Shopping</a></Button>
      </div>
    );
  }

  if (isOrderPlaced) {
    return (
       <div className="container text-center py-20">
        <h1 className="font-headline text-3xl">Thank You For Your Order!</h1>
        <p className="text-muted-foreground mt-2">Your order has been placed successfully. You will receive a confirmation call shortly.</p>
        <Button asChild className="mt-4"><Link href="/">Continue Shopping</Link></Button>
      </div>
    )
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="text-center mb-8">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Checkout</h1>
      </div>
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Shipping and Payment Form */}
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Sana" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                         <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Ahmed" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                         <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123, Street Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  <div className="grid sm:grid-cols-2 gap-4">
                     <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                         <FormItem>
                          <FormLabel>City</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a city" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="karachi">Karachi</SelectItem>
                              <SelectItem value="lahore">Lahore</SelectItem>
                              <SelectItem value="islamabad">Islamabad</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                         <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="0300-1234567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                         <FormControl>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-4">
                            <FormItem className="flex items-center space-x-3 border rounded-md p-4 has-[:checked]:border-primary">
                              <FormControl>
                                <RadioGroupItem value="cod" id="cod" />
                              </FormControl>
                              <FormLabel htmlFor="cod" className="font-medium cursor-pointer flex-1">Cash on Delivery (COD)</FormLabel>
                              <p className="text-sm text-muted-foreground">Pay upon receiving your order.</p>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 border rounded-md p-4 has-[:checked]:border-primary">
                              <FormControl>
                                <RadioGroupItem value="card" id="card" />
                              </FormControl>
                              <FormLabel htmlFor="card" className="font-medium cursor-pointer flex-1">Credit/Debit Card</FormLabel>
                              <div className="flex items-center gap-2">
                                <p className="text-sm text-muted-foreground">Visa, Mastercard</p>
                              </div>
                            </FormItem>
                          </RadioGroup>
                         </FormControl>
                         <FormMessage />
                      </FormItem>
                    )}
                   />
                </CardContent>
              </Card>
            </form>
          </Form>
        </div>

        {/* Order Summary */}
        <aside>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex items-center space-x-4">
                  <Image src={item.images[0]} alt={item.name} width={64} height={64} className="rounded-md" data-ai-hint="product image"/>
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">PKR {(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>PKR {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>PKR 5,000</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>PKR {(cartTotal + 5000).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

"use client";
import React, { useState } from 'react'
import axios from 'axios';
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
import { Nav } from '@/components/nav';

declare global {
    interface Window {
        Razorpay: any;
    }
}

const PaymentPage = () => {
    function loadScript(src: any) {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    }
    const [amount_checkout, setAmount] = useState(0);
    const [name, setName] = useState('');
    const displayRazorpay = async () => {
        if (amount_checkout < 50000) {
            alert("Please enter a valid amount");
            return;
        }
        if (name === '' || name === null || name === undefined || name.length < 3) {
            alert("Please enter a valid name");
            return;
        }
        const res = await loadScript(
            "https://checkout.razorpay.com/v1/checkout.js"
        );

        if (!res) {
            alert("Razorpay SDK failed to load. Are you online?");
            return;
        }

        const token = localStorage.getItem('token');

        // creating a new order
        const result = await axios.post("http://localhost:8080/api/orders", {
            amount: amount_checkout,
            receiver: name
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!result) {
            alert("Server error. Are you online?");
            return;
        }

        // Getting the order details back
        const { amount, id: order_id, currency } = result.data;

        const options = {
            key: "rzp_test_aIUdfp8MB3CGnk",
            amount: amount.toString(),
            currency: currency,
            name: "FinGenius Pvt Ltd",
            description: "Thank you for nothing. Please give us some money",
            image: "https://github.com/divyanshu1810.png", // add logo here
            order_id: order_id,
            prefill: {
                name: "Aryan Raj",
                email: "aryanraj2713@gmail.com",
                contact: "+91 82872 76911",
            },
            notes: {
                address: "SRM Institute of Science and Technology",
            },
            theme: {
                color: "#000000",
            },
            callback_url: "http://localhost:3000/success",
        };

        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    }


    const handleAmountChange = (e: any) => {
        setAmount(e.target.value);
    }

    const handleNameChange = (e: any) => {
        setName(e.target.value);
    }
    return (
        <div>
            <Nav />
            <div className="flex justify-center items-center h-screen">
                <Card className="w-full max-w-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl">Payment</CardTitle>
                        <CardDescription>
                            Enter the amount you want to pay
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Amount</Label>
                            <Input id="amount" type="email" placeholder="Enter amount" required onChange={handleAmountChange} />
                        </div>
                    </CardContent>
                    <CardContent>
                        <div className="grid gap-2">
                            <Label htmlFor="name">Recipient Account Name</Label>
                            <Input id="name" type="email" placeholder="Enter account name" required onChange={handleNameChange} />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" onClick={displayRazorpay}>Checkout</Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

export default PaymentPage;
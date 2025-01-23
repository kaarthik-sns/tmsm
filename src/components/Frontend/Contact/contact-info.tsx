"use client";

import Image from "next/image";
import React from "react";
import Link from "next/link";
import AuthLayout from '@/components/Layouts/AuthLayout';

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { TriangleAlert } from "lucide-react";


const ContactInfo = () => {

const router = useRouter();
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState({
        name: "",
        lastname: "",
        email: "",
        message: "",
        interest: "",
        phone: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Set pending state while submitting
        setPending(true);
        setError(null); // Reset any previous error message

        try {
            const res = await fetch("/api/contact-us", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (res.ok) {
                // On success, show success message
                setPending(false);

                toast.success(data.message, {
                    className: "sonner-toast-success",
                    cancel: {
                        label: "Close",
                        onClick: () => console.log("Close"),
                    },
                });

                // Optionally, reset form after successful submission
                setForm({
                    name: "",
                    lastname: "",
                    email: "",
                    message: "",
                    interest: "",
                    phone: "",
                });
            } else {
                // On error, set the error state
                setError(data.message || "Something went wrong!");
                setPending(false);
            }
        } catch (err) {
            // Catch any errors from the fetch itself
            setPending(false);
            setError("An error occurred while submitting the form. Please try again.");
        }
    };

  return (
    <>
    <section className="contact-info-con">
        <div className="container mx-auto">
        <div className="row flex flex-col md:flex-row ">
          <div className="con-top-title px-7.5">
            <h3>Get in Touch</h3>
          </div>
        </div>
          <div className="row flex flex-col md:flex-row ">
            <div className="w-full md:w-1/2 px-7.5 con-form-line-info">
                <div className="con-message">
                  <h4>Send a Message</h4>
                  <p>Our support team is here for you! Whether you have questions or need assistance, feel free to contact us via phone, email, or our contact form. We're dedicated to making your journey to finding a partner smooth and enjoyable.</p>
                </div>
          <div className="con-data-forms">
          <form onSubmit={handleSubmit}>
          <div className="row flex flex-col md:flex-row ">
          <div className="w-full md:w-1/2  con-list-info">    
    <div className="relative">
        <input
            type="text"
            disabled={pending}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            placeholder="Name"
            className="w-full text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        />
    </div>
</div>
<div className="w-full md:w-1/2  con-list-info">
   
    <div className="relative">
        <input
            type="email"
            disabled={pending}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            placeholder="E-mail id"
            className="w-full text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        />
    </div>
</div>

          </div>
    
          <div className="row flex flex-col md:flex-row  ">
                      <div className="w-full md:w-1/2  con-list-info">   
              <div className="relative">
              <input
                      type="text"
                      disabled={pending}
                      value={form.interest}
                      onChange={(e) => setForm({ ...form, interest: e.target.value })}
                      required
                      placeholder="Interest In"
                      className="w-full text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  />
                  
              </div>
            </div>
            <div className="w-full md:w-1/2 con-list-info">    
    <div className="relative">
    <input
            type="text"
            disabled={pending}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
            placeholder="Phone Number"
            className="w-full text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        />
    </div>
</div>
          </div>


          <div className="row flex flex-col md:flex-row ">
          <div className="w-full md:w-1/1 con-list-info ">
            <div className="relative">
                <textarea
                    disabled={pending}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    placeholder="Message"
                    className="w-full text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
            </div>
        </div>
 </div>
    <div className="mb-5">
        <input
            type="submit"
            value="Submit"
            className="cta-submit cursor-pointer rounded-lg border p-4 text-white transition hover:bg-opacity-90"
        />
    </div>


          </form>
          </div>

            </div>
            <div className="w-full md:w-1/2 px-7.5">
                <div className="right-contact-info">
                    <div className="con-list-of-data">
                        <h4>Call Us</h4>
                        <p>Call us for any assistance or inquiries about your matrimonial journey.</p>
                        <div className="call-info">
                            <span className="icon-info"><img src="/images/contact/call-icon.svg" alt="call-icon"/></span>
                            <a className="info-link-data" href="tel:+91 0987654321">+91 0987654321</a>
                        </div>
                    </div>
                    <div className="con-list-of-data">
                        <h4>E-Mail Address</h4>
                        <p>E-Mail us for any assistance or inquiries about your matrimonial journey.</p>
                        <div className="call-info">
                            <span className="icon-info"><img src="/images/contact/mail-icon.svg" alt="call-icon"/></span>
                            <a className="info-link-data" href="mailto:TMSM@gmail.com">TMSM@gmail.com</a>
                        </div>
                    </div>

                    <div className="con-list-of-data">
                        <h4>Follow Us</h4>
                        <p>Follow us on social media links for the latest updates and matrimonial tips.</p>
                        <ul className="social-media-info">
                            <li><a href="#"><img src="/images/contact/twitter-icon.svg" alt="twitter"/></a></li>
                            <li><a href="#"><img src="/images/contact/facebook-icon.svg" alt="facebook"/></a></li>
                            <li><a href="#"><img src="/images/contact/instagram-icon.svg" alt="instagram"/></a></li>
                        </ul>
                    </div>
                </div>
            </div>
          </div>
        </div>
    </section>
    </>
  );
};

export default ContactInfo;
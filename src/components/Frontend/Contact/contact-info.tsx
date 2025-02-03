"use client";

import React from "react";
import { useState } from "react";

const ContactInfo = ({ data }) => {

    const [pending, setPending] = useState(false);
    const [msg, setMsg] = useState(null);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState<any>({});

    const [form, setForm] = useState({
        name: "",
        lastname: "",
        email: "",
        message: "",
        interest: "",
        phone: "",
    });


    const validate = () => {
        let newErrors: any = {};

        // Name validation
        if (!form.name) {
            newErrors.name = "Name cannot be empty.";
        }

        // Email validation
        if (!form.email) {
            newErrors.email = "Email cannot be empty.";
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        // Phone number validation
        if (!form.phone) {
            newErrors.phone = "Phone number cannot be empty";
        } else if (!/^\d{10}$/.test(form.phone)) {
            newErrors.phone = "Please enter a valid 10-digit phone number";
        }
        if (!form.message) {
            newErrors.message = "Message cannot be empty.";
        }



        return newErrors;
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPending(true);
        setErrors({});
        setMsg(""); // Clear any previous success messages

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setPending(false);
            return;
        }


        const res = await fetch("/api/contact-us", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
        });

        const data = await res.json();

        if (res.ok) {
            // On success, show success message
            setPending(false);

            setMsg('Thank you for contacting us. Our support team will contact you shortly!');

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
                                <p>{data.contact_desc}</p>
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
                                                    placeholder="Name"
                                                    className="w-full text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                />
                                                {errors.name && (
                                                    <p className="text-red-600 text-sm">{errors.name}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="w-full md:w-1/2  con-list-info">

                                            <div className="relative">
                                                <input
                                                    type="email"
                                                    disabled={pending}
                                                    value={form.email}
                                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                                    placeholder="E-mail id"
                                                    className="w-full text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                />
                                            </div>
                                            {errors.email && (
                                                <p className="text-red-600 text-sm">{errors.email}</p>
                                            )}
                                        </div>

                                    </div>

                                    <div className="row flex flex-col md:flex-row ">
                                        <div className="w-full md:w-1/2 con-list-info">
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    disabled={pending}
                                                    value={form.phone}
                                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                                    placeholder="Phone Number"
                                                    className="w-full text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                />
                                            </div>
                                            {errors.phone && (
                                                <p className="text-red-600 text-sm">{errors.phone}</p>
                                            )}
                                        </div>

                                    </div>


                                    <div className="row flex flex-col md:flex-row ">
                                        <div className="w-full md:w-1/1 con-list-info ">
                                            <div className="relative">
                                                <textarea
                                                    disabled={pending}
                                                    value={form.message}
                                                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                                                    placeholder="Message"
                                                    className="w-full text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                                />
                                            </div>
                                            {errors.message && (
                                                <p className="text-red-600 text-sm">{errors.message}</p>
                                            )}
                                        </div>
                                    </div>
                                    <p className={`${msg ? "text-green-500" : error ? "text-red-500" : ""}`}>
                                        {msg || error}
                                    </p>
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
                                        <span className="icon-info"><img src="/images/contact/call-icon.svg" alt="call-icon" /></span>
                                        <a className="info-link-data" href={`tel:${data.phone_no}`} >{data.phone_no}</a>
                                    </div>
                                </div>
                                <div className="con-list-of-data">
                                    <h4>E-Mail Address</h4>
                                    <p>E-Mail us for any assistance or inquiries about your matrimonial journey.</p>
                                    <div className="call-info">
                                        <span className="icon-info"><img src="/images/contact/mail-icon.svg" alt="call-icon" /></span>
                                        <a className="info-link-data" href={`mailto:${data.organisation_email_id}`}>{data.organisation_email_id}</a>
                                    </div>
                                </div>

                                <div className="con-list-of-data">
                                    <h4>Follow Us</h4>
                                    <p>Follow us on social media links for the latest updates and matrimonial tips.</p>
                                    <ul className="social-media-info">
                                        <li><a href={data.twitter} target="_blank"><img src="/images/contact/twitter-icon.svg" alt="twitter" /></a></li>
                                        <li><a href={data.facebook} target="_blank"><img src="/images/contact/facebook-icon.svg" alt="facebook" /></a></li>
                                        <li><a href={data.instagram} target="_blank"><img src="/images/contact/instagram-icon.svg" alt="instagram" /></a></li>
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
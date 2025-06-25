"use client";

import React from "react";
import { useState } from "react";
import Image from "next/image";

const ContactInfo = ({ data }) => {

    const lang = localStorage.getItem('lang') || 'en';

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
            <section className="inner-page-top-banner">
                <div className="relative in-banner-bg">
                    <Image
                        src="/images/contact/contact-us.webp"
                        alt="Happy Couple"
                        layout="fill"
                    />
                </div>

                <div className="inner-banner-info">
                    <div className="top-title">
                        <h2>{lang == 'ta' ? 'எங்களை தொடர்புகொள்ளுங்கள்' : 'Contact Us'}</h2>
                    </div>
                </div>
            </section>
            <section className="contact-info-con">
                <div className="container mx-auto">
                    <div className="row flex flex-col md:flex-row ">
                        <div className="con-top-title px-7.5">
                            <h3>{lang == 'ta' ? 'எங்களுடன் தொடர்பு கொள்ளுங்கள்' : 'Get in Touch'}</h3>
                        </div>
                    </div>
                    <div className="row flex flex-col md:flex-row ">
                        <div className="w-full md:w-1/2 px-7.5 con-form-line-info">
                            <div className="con-message">
                                <p>
                                    {lang == 'ta' ? data.contact_desc_ta : data.contact_desc}
                                </p>
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
                                                    placeholder={lang == 'ta' ? 'பெயர்' : 'Name'}
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
                                                    placeholder={lang == 'ta' ? 'மின்னஞ்சல் முகவரி' : 'E-mail address'}
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
                                                    placeholder={lang == 'ta' ? 'தொலைபேசி எண்' : 'Phone Number'}
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
                                                    placeholder={lang == 'ta' ? 'செய்தி' : 'Message'}
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
                                            value={lang == 'ta' ? 'சமர்ப்பி ' : 'Submit'}
                                            className="cta-submit cursor-pointer rounded-lg border p-4 text-white transition hover:bg-opacity-90"
                                        />
                                    </div>

                                </form>
                            </div>

                        </div>
                        <div className="w-full md:w-1/2 px-7.5">
                            <div className="right-contact-info">
                                <div className="con-list-of-data">

                                    <h4>{lang == 'ta' ? 'எங்களை அழைக்க' : 'Call Us'}</h4>
                                    <p>{lang == 'ta' ? 'உங்கள் திருமண பயணத்தைப் பற்றி ஏதேனும் உதவியோ அல்லது கேள்விகளோ இருந்தால், எங்களை அழைக்கலாம்.' : 'Call us for any assistance or inquiries about your matrimonial journey.'}</p>

                                    <div className="call-info">
                                        <span className="icon-info"><img src="/images/contact/call-icon.svg" alt="call-icon" /></span>
                                        <a className="info-link-data" href={`tel:${data.phone_no}`} >{data.phone_no}</a>
                                    </div>
                                </div>
                                <div className="con-list-of-data">

                                    <h4>{lang === 'ta' ? 'மின்னஞ்சல் அனுப்ப' : 'Email Us'}</h4>
                                    <p>{lang === 'ta'
                                        ? 'உங்கள் திருமண பயணத்தைப் பற்றி ஏதேனும் உதவியோ அல்லது கேள்விகளோ இருந்தால், மின்னஞ்சல் அனுப்பலாம்.'
                                        : 'E-Mail us for any assistance or inquiries about your matrimonial journey.'}</p>


                                    <div className="call-info">
                                        <span className="icon-info"><img src="/images/contact/mail-icon.svg" alt="call-icon" /></span>
                                        <a className="info-link-data" href={`mailto:${data.organisation_email_id}`}>{data.organisation_email_id}</a>
                                    </div>
                                </div>

                                <div className="con-list-of-data">
                                    <h4>{lang === 'ta' ? 'எங்களை பின்தொடர' : 'Follow Us'}</h4>
                                    <p>{lang === 'ta'
                                        ? 'சமூக ஊடக இணைப்புகளில் எங்களை பின்தொடர்ந்து புதிய தகவல்கள் மற்றும் திருமண குறிப்புகளுக்கான மேம்பட்ட வழிகாட்டிகளைப் பெறுங்கள்.'
                                        : 'Follow us on social media links for the latest updates and matrimonial tips.'}</p>

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
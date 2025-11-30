// Updated Contact.jsx with additional info section
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ParticlesBackground from "../components/ParticlesBackground";
import emailjs from "@emailjs/browser";
import Astra from "../assets/astra.png";
import toast from "react-hot-toast";

const SERVICE_ID = import.meta.env.VITE_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_PUBLIC_KEY;

export default function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        service: "",
        budget: "",
        idea: "",
    });

    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState("");

    useEffect(() => {
        if (status === "success" || status === "error") {
            const timer = setTimeout(() => setStatus(""), 3000);
            return () => clearTimeout(timer);
        }
    }, [status]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "budget" && value && !/^\d+$/.test(value)) return;

        setFormData((p) => ({ ...p, [name]: value }));
        if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
    };

    const validateForm = () => {
        const required = ["name", "email", "service", "idea"];
        const newErrors = {};

        required.forEach((f) => {
            if (!formData[f].trim()) newErrors[f] = "Fill this field";
        });

        if (formData.service !== "other" && !formData.budget.trim())
            newErrors.budget = "Fill this field";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setStatus("sending");

        try {
            await emailjs.send(
                SERVICE_ID,
                TEMPLATE_ID,
                {
                    ...formData,
                    from_name: formData.name,
                    reply_to: formData.email,
                },
                PUBLIC_KEY
            );

            setStatus("success");
            toast.success("Message sent successfully!");

            setFormData({ name: "", email: "", service: "", budget: "", idea: "" });
        } catch (err) {
            console.error("EmailJS Error:", err);
            setStatus("error");
            toast.error("Failed to send message. Try again.");
        }
    };

    return (
        <section
            id="contact"
            className="w-full min-h-screen relative bg-black overflow-hidden text-white py-20 px-6 md:px-20 flex flex-col md:flex-row items-center gap-10"
        >
            <ParticlesBackground />

            <div className="relative z-10 w-full flex flex-col md:flex-row items-center gap-10">

                {/* Left Image */}
                <motion.div
                    className="w-full md:w-1/2 flex justify-center"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.img
                        src={Astra}
                        alt="Contact"
                        className="w-72 md:w-140 rounded-2xl shadow-lg object-cover"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                </motion.div>

                {/* Right Form */}
                <motion.div
                    className="w-full md:w-1/2 bg-white/5 p-8 rounded-2xl shadow-lg border border-white/10 flex flex-col gap-6"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl font-bold">Let's Work Together</h2>

                    {/* Added Info Section */}
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-sm flex flex-col gap-2">
                        <p><span className="font-semibold">📍 Location:</span> Karachi, Pakistan</p>
                        <p><span className="font-semibold">✉️ Email:</span> uzairbaig040@gmail.com</p>
                        <p><span className="font-semibold">💼 Availability:</span> Open for projects & collaborations</p>
                        <p className="opacity-80">Feel free to contact me via the form. I usually respond within 24 hours.</p>
                    </div>

                    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>

                        {status === "success" && (
                            <p className="text-green-400 text-sm bg-green-400/10 p-3 rounded-md border border-green-400/20">
                                ✅ Message sent successfully!
                            </p>
                        )}

                        {status === "error" && (
                            <motion.p
                                className="text-red-400 text-sm bg-red-400/10 p-3 rounded-md border border-red-400/20"
                                animate={{ x: [-5, 5, -5, 5, 0] }}
                                transition={{ duration: 0.3 }}
                            >
                                ❌ Failed to send message!
                            </motion.p>
                        )}

                        <div className="flex flex-col">
                            <label>Your Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`p-3 rounded-md bg-white/10 border ${errors.name ? "border-red-500" : "border-gray-500"} text-white`}
                            />
                            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                        </div>

                        <div className="flex flex-col">
                            <label>Your Email <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="email"
                                placeholder="Your Email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`p-3 rounded-md bg-white/10 border ${errors.email ? "border-red-500" : "border-gray-500"} text-white`}
                            />
                            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                        </div>

                        <div className="flex flex-col">
                            <label>Service Needed <span className="text-red-500">*</span></label>
                            <select
                                name="service"
                                value={formData.service}
                                onChange={handleChange}
                                className={`p-3 rounded-md bg-white/10 border ${errors.service ? "border-red-500" : "border-gray-500"} text-white`}
                            >
                                <option value="" disabled>Something in mind?</option>
                                <option value="Web Development" className="text-black">Web Development</option>
                                <option value="Mobile Application" className="text-black">Mobile Application</option>
                                <option value="other" className="text-black">Others</option>
                            </select>
                            {errors.service && <p className="text-red-500 text-xs">{errors.service}</p>}
                        </div>

                        {formData.service && formData.service !== "other" && (
                            <div className="flex flex-col">
                                <label>Budget <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="budget"
                                    placeholder="Your Budget"
                                    value={formData.budget}
                                    onChange={handleChange}
                                    className={`p-3 rounded-md bg-white/10 border ${errors.budget ? "border-red-500" : "border-gray-500"} text-white`}
                                />
                                {errors.budget && <p className="text-red-500 text-xs">{errors.budget}</p>}
                            </div>
                        )}

                        <div className="flex flex-col">
                            <label>Explain Your Idea <span className="text-red-500">*</span></label>
                            <textarea
                                name="idea"
                                rows={5}
                                placeholder="Enter Your Idea"
                                value={formData.idea}
                                onChange={handleChange}
                                className={`p-3 rounded-md bg-white/10 border ${errors.idea ? "border-red-500" : "border-gray-500"} text-white`}
                            ></textarea>
                            {errors.idea && <p className="text-red-500 text-xs">{errors.idea}</p>}
                        </div>

                        <motion.button
                            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3 rounded-md font-semibold"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={status === "sending"}
                            type="submit"
                        >
                            {status === "sending" ? "Sending..." : "Send Message"}
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        </section>
    );
}

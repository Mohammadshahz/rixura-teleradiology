import { useState } from "react";
import { Star, Quote } from "lucide-react";
import { useSubmitForm } from "../hooks/useSubmitForm";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Modal from "./Modal";

const Testimonials = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { submitContact, loading } = useSubmitForm();

  const testimonials = [
    {
      name: "Dr. Sarah Chen",
      title: "Chief of Radiology",
      organization: "Metro General Hospital",
      content:
        "TeleRad Solutions has transformed our emergency department workflow...",
      rating: 5,
      specialty: "Emergency Medicine",
    },
    {
      name: "Dr. Michael Rodriguez",
      title: "Medical Director",
      organization: "Regional Diagnostic Center",
      content:
        "The subspecialty expertise available through their network is outstanding...",
      rating: 5,
      specialty: "Neuroradiology",
    },
    {
      name: "Dr. Emily Thompson",
      title: "Department Head",
      organization: "Community Medical Center",
      content:
        "Seamless integration with our PACS system and excellent report quality...",
      rating: 5,
      specialty: "General Radiology",
    },
    {
      name: "Dr. James Park",
      title: "Chief Medical Officer",
      organization: "Children's Healthcare Network",
      content: "Their pediatric radiology expertise is exceptional...",
      rating: 5,
      specialty: "Pediatric",
    },
    {
      name: "Dr. Maria Gonzalez",
      title: "Imaging Director",
      organization: "Orthopedic Specialists Group",
      content:
        "The musculoskeletal imaging reports are comprehensive and clinically relevant...",
      rating: 5,
      specialty: "Musculoskeletal",
    },
    {
      name: "Dr. Maria Gonzalez",
      title: "Imaging Director",
      organization: "Orthopedic Specialists Group",
      content:
        "The musculoskeletal imaging reports are comprehensive and clinically relevant...",
      rating: 5,
      specialty: "Musculoskeletal",
    },
  ];

  const validationSchema = Yup.object({
    name: Yup.string().required("Full name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string()
      .required("Phone number is required")
      .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
    message: Yup.string().required("Message is required"),
  });

  const initialValues = {
    name: "",
    email: "",
    phone: "",
    message: "",
    countryCode: "+91",
  };

  const handleSubmit = async (
    values: typeof initialValues,
    formikHelpers: {
      resetForm: () => void;
      setSubmitting: (isSubmitting: boolean) => void;
    }
  ) => {
    const { resetForm, setSubmitting } = formikHelpers;

    setSubmitting(true);
    const result = await submitContact({
      ...values,
      phone: `${values.countryCode}${values.phone}`,
      userType: "Center",
      requestType: "DEMO",
    });

    if (result) {
      resetForm();
      setIsModalOpen(false);
    }

    setSubmitting(false);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Trusted by Healthcare Leaders
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real testimonials from medical professionals who rely on our
            teleradiology services to enhance patient care and improve clinical
            outcomes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-center mb-6">
                <Quote className="w-8 h-8 text-blue-600 mr-3" />
                <div className="flex space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed italic">
                "{testimonial.content}"
              </p>

              <div className="border-t pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600">{testimonial.title}</p>
                    <p className="text-sm text-blue-600 font-medium">
                      {testimonial.organization}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                      {testimonial.specialty}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Block */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">
            Join 100+ Healthcare Centers
          </h3>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Experience the difference that expert teleradiology services can
            make for your practice. Join the growing network of healthcare
            providers who trust us with their diagnostic imaging needs.
          </p>

          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-blue-200">Healthcare Partners</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">90K</div>
              <div className="text-blue-200">Studies Read</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">99.2%</div>
              <div className="text-blue-200">Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-blue-200">Coverage Available</div>
            </div>
          </div>

          <div className="flex justify-center mt-10">
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-white font-semibold px-8 py-4 rounded-lg hover:bg-blue-100 transition-all duration-300 border-2 border-white-700 hover:text-blue-700"
            >
              Join Us
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-2xl font-bold mb-4">Partner with Us</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <Field
                name="name"
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                placeholder="Dr. John Smith"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-sm text-red-500 mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <Field
                name="email"
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                placeholder="john.smith@hospital.com"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-sm text-red-500 mt-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <div className="flex space-x-2">
                <Field
                  as="select"
                  name="countryCode"
                  className="px-4 py-3 border border-gray-300 rounded-lg bg-white w-28"
                >
                  <option value="+91">🇮🇳 +91</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+61">🇦🇺 +61</option>
                  <option value="+971">🇦🇪 +971</option>
                  <option value="+81">🇯🇵 +81</option>
                  <option value="+49">🇩🇪 +49</option>
                  <option value="+33">🇫🇷 +33</option>
                  <option value="+92">🇵🇰 +92</option>
                  <option value="+880">🇧🇩 +880</option>
                  <option value="+94">🇱🇰 +94</option>
                  <option value="+7">🇷🇺 +7</option>
                  <option value="+20">🇪🇬 +20</option>
                  <option value="+55">🇧🇷 +55</option>
                  <option value="+27">🇿🇦 +27</option>
                  <option value="+34">🇪🇸 +34</option>
                  <option value="+39">🇮🇹 +39</option>
                  <option value="+62">🇮🇩 +62</option>
                  <option value="+65">🇸🇬 +65</option>
                </Field>

                <Field
                  name="phone"
                  type="tel"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
                  placeholder="Enter phone number"
                />
              </div>
              <ErrorMessage
                name="phone"
                component="div"
                className="text-sm text-red-500 mt-1"
              />
            </div>

            {/* User type fixed */}
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded text-sm font-medium">
              I am a Center
            </div>

            {loading ? (
              <div className="text-center text-blue-600 font-semibold">
                Submitting form...
              </div>
            ) : (
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Submit Request
              </button>
            )}
          </Form>
        </Formik>
      </Modal>
    </section>
  );
};

export default Testimonials;

"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Alert from "./Alert";

const MyForm = (props) => {
  const [data, setData] = useState({});
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    roll: "",
    admission: "",
    aadhar: "",
    name: "",
    father: "",
    mother: "",
    category: "",
    grade: "",
    dob: "",
    phone: "",
    email: "",
    address: "",
    account: "",
    photo: null,
    selectOption: "",
  });

  const [photo, setPhoto] = useState(null);
  const [change, setChange] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchUrl = props.URL || "/api/addStudents";
        const res = await axios.get(`${fetchUrl}?admission=${props.admission}`);
        const fetchedData = Array.isArray(res.data) ? res.data[0] : res.data;
        if (fetchedData) {
          setData(fetchedData);
        } else {
          alert("ERROR: No student data found for admission: " + props.admission);
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
        alert("ERROR: Failed to fetch student data");
      }
    };

    if (props.admission) {
      fetchData();
    }
  }, [props.URL, props.admission]);

  // Update formData when data changes
  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      setFormData({
        roll: data.roll || "",
        name: data.name || "",
        dob: data.dob || "",
        admission:
          data.admission !== undefined && data.admission !== null
            ? String(data.admission)
            : "",
        aadhar: data.aadhar || "",
        father: data.father || data.parentage || "",
        mother: data.mother || "",
        grade: data.grade || "",
        phone: data.phone || "",
        email: data.email || "",
        address: data.address || "",
        account: data.account || "",
        photo: data.photo || null,
        selectOption: data.category || "",
      });
    }
  }, [data]);

  const handleChange = (e) => {
    if (e.target.name === "photo") {
      if (e.target.files && e.target.files[0]) {
        setChange(true);
        setFormData({
          ...formData,
          photo: URL.createObjectURL(e.target.files[0]),
        });
        setPhoto(e.target.files[0]);
      }
    } else {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const renderExistingPhoto = () => {
    if (!formData.photo) return null;

    if (typeof formData.photo === "string") {
      const src =
        formData.photo.startsWith("data:") ||
        formData.photo.startsWith("blob:") ||
        formData.photo.startsWith("http")
          ? formData.photo
          : `data:image/png;base64,${formData.photo}`;
      return (
        <img
          src={src}
          alt="Student"
          className="w-96 h-96 object-cover rounded-full"
        />
      );
    }

    if (formData.photo && formData.photo.data && Array.isArray(formData.photo.data)) {
      try {
        const str = formData.photo.data
          .map((b) => String.fromCharCode(b))
          .join("");
        const src = str.startsWith("data:image")
          ? str
          : `data:image/png;base64,${str}`;
        return (
          <img
            src={src}
            alt="Student"
            className="w-96 h-96 object-cover rounded-full"
          />
        );
      } catch (err) {
        console.error("Error decoding photo buffer:", err);
      }
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const formDATA = new FormData();
      // Crucial: send oldAdmission so backend can find and update student & cascade to exams
      formDATA.append("oldAdmission", props.admission || "");
      formDATA.append("roll", formData.roll || "");
      formDATA.append("admission", formData.admission || "");
      formDATA.append("aadhar", formData.aadhar || "");
      formDATA.append("name", formData.name || "");
      formDATA.append("father", formData.father || "");
      formDATA.append("mother", formData.mother || "");
      formDATA.append("category", formData.selectOption || "");
      formDATA.append("grade", formData.grade || "");
      formDATA.append("dob", formData.dob || "");
      formDATA.append("phone", formData.phone || "");
      formDATA.append("email", formData.email || "");
      formDATA.append("address", formData.address || "");
      formDATA.append("account", formData.account || "");

      // Only append photo if a new file was actually selected
      if (photo) {
        formDATA.append("photo", photo);
      }

      const postUrl = props.POST_URL || "/api/updateStudent";
      const res = await axios.post(postUrl, formDATA);

      if (res.status === 200 || res.data?.status === 200) {
        setSuccess(true);
      } else {
        alert("Failed to submit form: " + (res.data?.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(
        "Failed to submit form: " +
          (error.response?.data?.error || error.message || "Unknown error")
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div>
        {/* Display selected photo */}
        <label htmlFor="photo" className="cursor-pointer">
          {change && formData.photo ? (
            <div className="max-w-md mx-auto bg-white shadow-lg overflow-hidden mb-4 mt-10 flex justify-center align-middle rounded-full">
              <img
                className="w-96 h-96 object-cover rounded-full"
                src={formData.photo}
                alt="Selected"
              />
            </div>
          ) : formData.photo ? (
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden mb-4 mt-10 flex justify-center align-middle rounded-full">
              {renderExistingPhoto() || (
                <div className="w-96 h-96 bg-slate-200 flex items-center justify-center text-slate-500 font-bold rounded-full p-4 text-center">
                  PHOTO ATTACHED (CLICK TO CHANGE)
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-md mx-auto bg-slate-400 rounded-lg shadow-lg overflow-hidden mb-4 mt-10 w-full p-10 text-center">
              <span className="text-lg font-bold text-white">SELECT PHOTO</span>
            </div>
          )}
        </label>

        {/* Form */}
        <form
          className="max-w-md mx-auto bg-white p-10 mb-10 shadow rounded"
          onSubmit={handleSubmit}
        >
          {/* Roll */}
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-gray-700" htmlFor="roll">
              Roll No.
            </label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              id="roll"
              name="roll"
              value={formData.roll}
              onChange={handleChange}
            />
          </div>

          {/* Admission (Editable & Cascades to Exams) */}
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-blue-700" htmlFor="admission">
              Admission No.
            </label>
            <input
              className="w-full border-2 border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              type="text"
              id="admission"
              name="admission"
              value={formData.admission}
              onChange={handleChange}
              placeholder="Enter Admission Number"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Note: Updating Admission No. will automatically sync in all exams.
            </p>
          </div>

          {/* Aadhar */}
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-gray-700" htmlFor="aadhar">
              Aadhar
            </label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              id="aadhar"
              name="aadhar"
              value={formData.aadhar}
              onChange={handleChange}
            />
          </div>

          {/* Name */}
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-gray-700" htmlFor="name">
              Name
            </label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Father */}
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-gray-700" htmlFor="father">
              Father's Name
            </label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              id="father"
              name="father"
              value={formData.father}
              onChange={handleChange}
            />
          </div>

          {/* Mother */}
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-gray-700" htmlFor="mother">
              Mother's Name
            </label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              id="mother"
              name="mother"
              value={formData.mother}
              onChange={handleChange}
            />
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-gray-700" htmlFor="selectOption">
              Select Category
            </label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="selectOption"
              name="selectOption"
              value={formData.selectOption}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="OM">OM</option>
              <option value="RBA">RBA</option>
              <option value="ST">ST</option>
              <option value="SC">SC</option>
              <option value="STGB">STGB</option>
            </select>
          </div>

          {/* Grade */}
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-gray-700" htmlFor="grade">
              Grade / Class
            </label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              id="grade"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
            />
          </div>

          {/* DOB */}
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-gray-700" htmlFor="dob">
              Date of Birth
            </label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
            />
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-gray-700" htmlFor="phone">
              Phone
            </label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Address */}
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-gray-700" htmlFor="address">
              Address
            </label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          {/* Account */}
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-gray-700" htmlFor="account">
              Account No.
            </label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              id="account"
              name="account"
              value={formData.account}
              onChange={handleChange}
            />
          </div>

          {/* Photo */}
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-gray-700" htmlFor="photo">
              Photo
            </label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="file"
              id="photo"
              name="photo"
              accept="image/*"
              onChange={handleChange}
            />
          </div>

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded cursor-pointer transition duration-200 disabled:opacity-50"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Updating..." : "Submit"}
          </button>
        </form>
      </div>

      {success && <Alert Function={setSuccess} />}
    </>
  );
};

export default MyForm;

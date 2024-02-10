"use client";
import React, { useEffect, useState } from "react";
import { get } from "../../../../../functions/axios.get";
import { post } from "../../../../../functions/axios.post";
import Alert from "./Alert";

const MyForm = (props) => {
  const [data, setData] = useState({});
  const [success, setSuccess] = useState();
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
        await get(`${props.URL}?admission=${props.admission}`, (response) => {
          const fetchedData = response.data[0];
          if (fetchedData) {
            setData(fetchedData);
          } else {
            alert("ERROR: No data received");
          }
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("ERROR: Failed to fetch data");
      }
    };

    fetchData();
  }, [props.URL, props.admission]);

  // Update formData when data changes
  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      roll: data.roll,
      name: data.name,
      dob: data.dob,
      admission: data.admission,
      aadhar: data.aadhar,
      father: data.father || data.parentage,
      mother: data.mother,
      grade: data.grade,
      phone: data.phone,
      email: data.email,
      address: data.address,
      account: data.account,
      photo: data.photo || null,
      selectOption: data.category,
    }));
  }, [data]);

  // Log the updated state
  useEffect(() => {
    console.log("Updated data:", data);
  }, [data]);

  const handleChange = (e) => {
    if (e.target.name === "photo") {
      setChange(true);
      setFormData({
        ...formData,
        photo: URL.createObjectURL(e.target.files[0]),
      });
      setPhoto(e.target.files[0]);
    } else {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDATA = new FormData();
      // Append form data
      formDATA.append("roll", formData.roll);
      formDATA.append("admission", formData.admission);
      formDATA.append("aadhar", formData.aadhar);
      formDATA.append("name", formData.name);
      formDATA.append("father", formData.father);
      formDATA.append("mother", formData.mother);
      formDATA.append("category", formData.selectOption);
      formDATA.append("grade", formData.grade);
      formDATA.append("dob", formData.dob);
      formDATA.append("phone", formData.phone);
      formDATA.append("email", formData.email);
      formDATA.append("address", formData.address);
      formDATA.append("account", formData.account);
      formDATA.append("photo", photo); // Append the file object

      // Send the form data using your post function
      await post(props.POST_URL, formDATA, () => {
        setSuccess(true);
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit form");
    }
  };

  return (
    <>
      <div>
        {/* Display selected photo */}
        <label htmlFor="photo" className="cursor-pointer">
          {formData.photo ? (
            change ? (
              <div className="max-w-md mx-auto bg-white shadow-lg overflow-hidden mb-4 mt-10 flex justify-center align-middle rounded-full">
                <img
                  className="w-96 h-96"
                  src={formData.photo}
                  alt="Selected"
                />
              </div>
            ) : (
              <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden mb-4 mt-10 flex justify-center align-middle rounded-full">
                <img
                  src={`data:image/png;base64,${Uint8Array.from(
                    formData.photo.data
                  ).reduce(
                    (data, byte) => data + String.fromCharCode(byte),
                    ""
                  )}`}
                  alt="Binary Image"
                  className="w96 h96"
                />
              </div>
            )
          ) : (
            <div className="max-w-md mx-auto bg-slate-400 rounded-lg shadow-lg overflow-hidden mb-4 mt-10 w-full p-10">
              <span className="text-lg font-bold">SELECT PHOTO</span>
            </div>
          )}
        </label>

        {/* Form */}
        <form
          className="max-w-md mx-auto bg-white p-10 mb-10"
          onSubmit={handleSubmit}
        >
          {/* Roll */}
          <div className="mb-4">
            <label className="block mb-1" htmlFor="roll">
              Roll
            </label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2"
              type="text"
              id="roll"
              name="roll"
              value={formData.roll}
              onChange={handleChange}
            />
          </div>

          {/* Admission */}
          <div className="mb-4">
            <label className="block mb-1" htmlFor="admission">
              Admission
            </label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2"
              type="text"
              id="admission"
              name="admission"
              value={formData.admission}
              onChange={handleChange}
            />
          </div>

          {/* Aadhar */}
          <div className="mb-4">
            <label className="block mb-1" htmlFor="aadhar">
              Aadhar
            </label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2"
              type="text"
              id="aadhar"
              name="aadhar"
              value={formData.aadhar}
              onChange={handleChange}
            />
          </div>

          {/* Name */}
          <div className="mb-4">
            <label className="block mb-1" htmlFor="name">
              Name
            </label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2"
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Father */}
          <div className="mb-4">
            <label className="block mb-1" htmlFor="father">
              Father
            </label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2"
              type="text"
              id="father"
              name="father"
              value={formData.father}
              onChange={handleChange}
            />
          </div>

          {/* Mother */}
          <div className="mb-4">
            <label className="block mb-1" htmlFor="mother">
              Mother
            </label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2"
              type="text"
              id="mother"
              name="mother"
              value={formData.mother}
              onChange={handleChange}
            />
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className="block mb-1" htmlFor="selectOption">
              Select Category
            </label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2"
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
            <label className="block mb-1" htmlFor="grade">
              Grade
            </label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2"
              type="text"
              id="grade"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
            />
          </div>

          {/* DOB */}
          <div className="mb-4">
            <label className="block mb-1" htmlFor="dob">
              DOB
            </label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2"
              type="text"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
            />
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label className="block mb-1" htmlFor="phone">
              Phone
            </label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2"
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block mb-1" htmlFor="email">
              Email
            </label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2"
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Address */}
          <div className="mb-4">
            <label className="block mb-1" htmlFor="address">
              Address
            </label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2"
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          {/* Account */}
          <div className="mb-4">
            <label className="block mb-1" htmlFor="account">
              Account
            </label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2"
              type="text"
              id="account"
              name="account"
              value={formData.account}
              onChange={handleChange}
            />
          </div>

          {/* Photo */}
          <div className="mb-4">
            <label className="block mb-1" htmlFor="photo">
              Photo
            </label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2"
              type="file"
              id="photo"
              name="photo"
              accept="image/*"
              onChange={handleChange}
            />
          </div>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>

      {success && <Alert Function={setSuccess} />}
    </>
  );
};

export default MyForm;

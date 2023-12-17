import React, { useState } from "react";
import Button from "./Button";

const AddEmailForm = ({ dataProtector, fetchData, setIsOpenForm }) => {
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const handleProtectData = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      await dataProtector.protectData({
        data: {
          email: formData.email,
        },
        name: formData.name,
      });
      fetchData();
      setIsOpenForm(false);
      window.alert("Successfully pushed " + formData.name);
    } catch (error) {
      window.alert(
        error.message + "\nPlease Select iExec Sidechain network on MetaMask",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeForm = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <form onSubmit={handleProtectData}>
      <p>
        Protect your address with iExec. Your email address stays secret, only
        your name will be shared with the organization.
      </p>
      <div className="flex flex-col gap-4 mt-8">
        <div className="flex flex-col gap-1">
          <label htmlFor="email">Email Address (secret)</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChangeForm}
            required
            placeholder="johndoe@gmail.com"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChangeForm}
            placeholder="John Doe"
            required
          />
        </div>

        <Button
          type="button"
          innerHTML={isLoading ? "Initializing..." : "Protect my Address"}
          onClickHandler={handleProtectData}
          isLoading={isLoading}
        />
      </div>
    </form>
  );
};

export default AddEmailForm;

import React, { useEffect, useState } from "react";
import Button from "./Button";

const AddEmailForm = ({
  submitHandler,
  changeFormHandler,
  formData,
  isLoading,
}) => {
  return (
    <form onSubmit={submitHandler}>
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
            onChange={changeFormHandler}
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
            onChange={changeFormHandler}
            placeholder="John Doe"
            required
          />
        </div>

        <Button
          type="button"
          innerHTML={isLoading ? "Initializing..." : "Protect my Address"}
          onClickHandler={submitHandler}
          isLoading={isLoading}
        />
      </div>
    </form>
  );
};

export default AddEmailForm;

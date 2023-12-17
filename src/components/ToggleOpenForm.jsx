import React, { useState, useEffect } from "react";
import Plus from "../assets/plus.png";

const ToggleOpenForm = ({ isOpenForm, setIsOpenForm }) => {
  return (
    <>
      {isOpenForm ? (
        <button
          onClick={() => setIsOpenForm(false)}
          className="bg-transparent m-0 p-0 flex gap-1 items-center text-white underline"
        >
          <p>Cancel adding new address</p>
        </button>
      ) : (
        <button
          onClick={() => setIsOpenForm(true)}
          className="bg-transparent m-0 p-0 flex gap-1 items-center underline text-yellow"
        >
          <img src={Plus} className="plus" alt="+" />
          <p>Add new</p>
        </button>
      )}
    </>
  );
};

export default ToggleOpenForm;

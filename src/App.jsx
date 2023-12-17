import { useEffect, useState } from "react";
import "./App.css";
import Plus from "./assets/plus.png";

import { ethers } from "ethers";
import { IExecDataProtector } from "@iexec/dataprotector";
import Button from "./components/Button";
import AddEmailForm from "./components/AddEmailForm";
import Navbar from "./components/Navbar";
import ProtectedData from "./components/ProtectedData";

function App() {
  const web3Provider = window.ethereum;
  const companyAddress = "0xF048eF3d7E3B33A465E0599E641BB29421f7Df92";
  // instantiate
  const dataProtector = new IExecDataProtector(web3Provider);
  const [account, setAccount] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [isOpenForm, setIsOpenForm] = useState(false);
  const [myProtectedData, setMyProtectedData] = useState([]);

  const [selectedDataAddress, setSelectedDataAddress] = useState(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });


  const handleItemClick = (item, index) => {
    setSelectedDataAddress(item.address);
    setSelectedItemIndex(index);
  };

  const fetchData = () => {
    dataProtector
      .fetchProtectedData({
        owner: account,
      })
      .then((result) => {
        console.log("result", result);
        setMyProtectedData(result);
        setSelectedDataAddress(myProtectedData[0]?.address);
      });
  };

  useEffect(() => {
    if (account) {
      fetchData();
    }
  }, [account]);

  const handleChangeForm = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleGrantAccess = async () => {
    console.log(
      "trying to grant access of",
      selectedDataAddress,
      "to",
      companyAddress,
      "from",
      account,
    );

    const grantedAccess = await dataProtector.grantAccess({
      protectedData: selectedDataAddress,
      authorizedApp: "0xF048eF3d7E3B33A465E0599E641BB29421f7Df92",
      authorizedUser: account,
    });

    console.log("granted access, ", grantedAccess);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitting:", formData);

    setIsLoading(true);
    await dataProtector.protectData({
      data: {
        email: formData.email,
      },
      name: formData.name,
    });
    fetchData();
    setIsLoading(false);
    setIsOpenForm(false);
    console.log("form submitted");
    // Add your form submission logic here
  };

  const handleConnect = async () => {
    setIsLoading(true);
    let accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);
    setIsLoading(false);
  };

  // Detect disconnection from MetaMask
  window.ethereum.on("disconnect", () => {
    setAccount("");
  });

  return (
    <>
      <div className="h-screen bg-cover bg-image">
        {/* NAVBAR */}
        <Navbar
          setAccount={setAccount}
          account={account}
          handleConnect={handleConnect}
        />

        {/* MAIN */}
        <main className="text-white flex flex-col items-center vertical mt-16">
          <div className="flex flex-col items-center">
            <h1>Secret Email Service</h1>
            <p className="mx-16 mt-4">
              iExec creates the technologies for individuals and organizations
              to create, protect and develop their digital estate.
            </p>
          </div>

          <div className="frame gradient-border my-16 flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h2>Grant Access</h2>
              <p>
                <span className="text-yellow underline">{companyAddress}</span>{" "}
                would like to get access to you, using iExec secured email
                service.
              </p>
            </div>

            {/* FETCHED DATA */}
            {myProtectedData.length != 0 && (
              <div className="flex flex-col gap-4">
                <h2>My Protected Emails</h2>
                <p>Select the one you want to grant access</p>
                <ProtectedData
                  myProtectedData={myProtectedData}
                  setSelectedDataAddress={setSelectedDataAddress}/>
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
                    <img src={Plus} className="plus" />
                    <p>Add new</p>
                  </button>
                )}

                <div className="flex gap-4">
                  <button className="flex-1 bg-transparent border border-gray border-solid text-white">
                    Revoke Access
                  </button>
                  <Button
                    innerHTML={"Share Access"}
                    className="flex-1"
                    onClickHandler={handleGrantAccess}
                  />
                </div>
              </div>
            )}

            {!account ? (
              <div className="flex flex-col gap-4">
                <p>Connect with MetaMask</p>
                <Button
                  innerHTML={isLoading ? "Initializing" : "Connect Wallet"}
                  onClickHandler={handleConnect}
                  isLoading={isLoading}
                />
              </div>
            ) : !isOpenForm ? (
              myProtectedData.length == 0 && (
                <div className="flex flex-col gap-4">
                  <p>You have no protected address yet.</p>
                  <Button
                    innerHTML={"Protect My Address"}
                    onClickHandler={() => setIsOpenForm(true)}
                  />
                </div>
              )
            ) : (
              <AddEmailForm
                submitHandler={handleSubmit}
                changeFormHandler={handleChangeForm}
                formData={formData}
                isLoading={isLoading}
              />
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default App;

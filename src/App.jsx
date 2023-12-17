import { useEffect, useState } from "react";
import "./App.css";

import { ethers } from "ethers";
import { IExecDataProtector } from "@iexec/dataprotector";
import Button from "./components/Button";
import AddEmailForm from "./components/AddEmailForm";
import Navbar from "./components/Navbar";
import ProtectedData from "./components/ProtectedData";
import ToggleOpenForm from "./components/ToggleOpenForm";

function App() {
  const IEXEC_SIDECHAIN_ID = 134;
  const WEB3MAIL_APP_ENS = 'web3mail.apps.iexec.eth';
  const web3Provider = window.ethereum;
  const companyAddress = "0xF048eF3d7E3B33A465E0599E641BB29421f7Df92";
  // instantiate
  const dataProtector = new IExecDataProtector(web3Provider);
  const [account, setAccount] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [isOpenForm, setIsOpenForm] = useState(false);
  const [myProtectedData, setMyProtectedData] = useState([]);

  const [selectedDataAddress, setSelectedDataAddress] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const fetchData = () => {
    dataProtector
      .fetchProtectedData({
        owner: account,
      })
      .then((result) => {
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
    let grantedAccess;
    try {
      setIsLoading(true)
      grantedAccess = await dataProtector.grantAccess({
        protectedData: selectedDataAddress || myProtectedData[0].address,
        authorizedApp: WEB3MAIL_APP_ENS,
        authorizedUser: companyAddress,
      });
      console.log(grantedAccess)
      window.alert('granted access to' + grantedAccess.dataset)
    } catch (error) {
      if (error.message == 'Failed to check granted access') {
        window.alert(error.message + '\nPlease Select iExec Sidechain network on MetaMask')
      } else {
        window.alert(error.message)
      }
    } finally {
      setIsLoading(false)
    }
  };

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
      window.alert('Successfully pushed ' + formData.name)
    } catch (error) {
      window.alert(error.message + '\nPlease Select iExec Sidechain network on MetaMask')
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      let accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
      const networkId = window.ethereum.networkVersion;
      if (networkId != IEXEC_SIDECHAIN_ID) {
        window.alert('You succesfully connected to MetaMask, but on the wrong network. Please select iExec SideChain Network in MetaMask, otherwise protecting and granting data won\'t be available')
      }
    } catch (error) {
      window.alert('Failed to connect to wallet : ' + error.message)
    } finally {
      setIsLoading(false);
    }
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
                <ToggleOpenForm isOpenForm={isOpenForm} setIsOpenForm={setIsOpenForm}/>

                <div className="flex gap-4">
                  <button className="flex-1 bg-transparent border border-gray border-solid text-white rounded-lg px-4">
                    Revoke Access
                  </button>
                  <Button
                    className={'flex-1'}
                    isLoading={isLoading}
                    innerHTML={isLoading ? "Signing..." : "Share Access"}
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
                submitHandler={handleProtectData}
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

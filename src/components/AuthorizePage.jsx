import { useEffect, useState } from "react";

import { IExecDataProtector } from "@iexec/dataprotector";
import Button from "./Button";
import AddEmailForm from "./AddEmailForm";
import Navbar from "./Navbar";
import ProtectedData from "./ProtectedData";
import ToggleOpenForm from "./ToggleOpenForm";
import { useLocation, Link } from "react-router-dom";
import { data } from "autoprefixer";

function AuthorizePage() {
  const IEXEC_SIDECHAIN_ID = 134;
  const WEB3MAIL_APP_ENS = "web3mail.apps.iexec.eth";
  const location = useLocation();
  const IEXEC_DEFAULT_ADDRESS = "0xF048eF3d7E3B33A465E0599E641BB29421f7Df92";
  const companyAddress = new URLSearchParams(location.search).get("user");
  const web3Provider = window.ethereum;
  // instantiate
  const dataProtector = new IExecDataProtector(web3Provider);
  const [account, setAccount] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [isOpenForm, setIsOpenForm] = useState(false);
  const [myProtectedData, setMyProtectedData] = useState([]);
  const [grantedAccesses, setGrantedAccesses] = useState([]);

  const [selectedDataAddress, setSelectedDataAddress] = useState(null);

  useEffect(() => {
    if (!account) return;
    async function getGranted() {
      let granted = [];
      for (let i = 0; i != myProtectedData.length; i++) {
        let grantedAccess = await dataProtector.fetchGrantedAccess({
          protectedData: myProtectedData[i].address,
          authorizedApp: WEB3MAIL_APP_ENS,
          authorizedUser: companyAddress,
        });
        granted.push(grantedAccess.count == 1);
      }
      setGrantedAccesses(granted);
    }

    getGranted();
  }, [myProtectedData]);

  const fetchData = () => {
    dataProtector
      .fetchProtectedData({
        owner: account,
      })
      .then((result) => {
        setMyProtectedData(result);
        // select the first element by default
        setSelectedDataAddress(myProtectedData[0]?.address);
      });
  };

  useEffect(() => {
    if (account) {
      fetchData();
    }
  }, [account]);

  const handleGrantAccess = async () => {
    try {
      setIsLoading(true);
      let grantedAccess = await dataProtector.grantAccess({
        protectedData: selectedDataAddress || myProtectedData[0].address,
        authorizedApp: WEB3MAIL_APP_ENS,
        authorizedUser: companyAddress,
      });
      fetchData()
    } catch (error) {
      if (error.message == "Failed to check granted access") {
        window.alert(
          error.message + "\nPlease Select iExec Sidechain network on MetaMask",
        );
      } else {
        window.alert(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addAndSwitchToIExecNetwork = async () => {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: "0x86",
          chainName: "iExec Sidechain",
          nativeCurrency: {
            name: "xRLC",
            symbol: "xRLC",
            decimals: 18,
          },
          rpcUrls: ["https://bellecour.iex.ec"],
          blockExplorerUrls: ["https://blockscout-bellecour.iex.ec"],
        },
      ],
    });

    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [
        {
          chainId: "0x86",
        },
      ],
    });
  };

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      if (!window.ethereum || !window.ethereum.isMetaMask) {
        throw Error(
          "Please install MetaMask plugin first, visit https://metamask.io/download",
        );
      }
      const [address] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(address);

      const networkId = window.ethereum.networkVersion;
      if (networkId != IEXEC_SIDECHAIN_ID) {
        addAndSwitchToIExecNetwork();
      }
    } catch (e) {
      window.alert(`Error: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevoke = async () => {
    try {
      setIsLoading(true);
      dataProtector
        .fetchGrantedAccess({
          protectedData: selectedDataAddress || myProtectedData[0].address,
          authorizedApp: WEB3MAIL_APP_ENS,
          authorizedUser: companyAddress,
        })
        .then(async (grantedAccess) => {
          if (grantedAccess.count == 0) {
            throw new Error(
              "Can't revoke an element that hasn't been granted.",
            );
          }
          try {
            await dataProtector.revokeOneAccess(grantedAccess.grantedAccess[0]);
            setIsLoading(false)
            fetchData();
          } catch (error) {
            console.error(error);
          }
        });
    } catch (error) {
      window.alert(error.message);
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
              <div>
                {companyAddress ? (
                  <>
                    <span className="text-yellow underline">
                      {companyAddress}
                    </span>{" "}
                    <span>
                      would like to get access to you, using iExec secured email
                      service.
                    </span>
                  </>
                ) : (
                  <div>
                    <p>No user specified in URL</p>
                    <Link to={`/authorize?user=${IEXEC_DEFAULT_ADDRESS}`}>
                      <Button
                        className="mt-4 w-full"
                        innerHTML={"Try default address from iExec"}
                      ></Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* FETCHED DATA */}
            {myProtectedData.length != 0 && (
              <div className="flex flex-col gap-4">
                <h2>My Protected Emails</h2>
                <p>Select the one you want to grant access</p>
                <ProtectedData
                  myProtectedData={myProtectedData}
                  grantedAccesses={grantedAccesses}
                  setSelectedDataAddress={setSelectedDataAddress}
                  dataProtector={dataProtector}
                />
                <ToggleOpenForm
                  isOpenForm={isOpenForm}
                  setIsOpenForm={setIsOpenForm}
                />

                {!isOpenForm && (
                  <div className="flex gap-4">
                    <button
                      disabled={isLoading}
                      onClick={handleRevoke}
                      className="flex-1 bg-transparent border border-gray border-solid text-white hover:text-gray-500 rounded-lg px-4"
                    >
                      Revoke Access
                    </button>
                    <Button
                      className={"flex-1"}
                      isLoading={isLoading}
                      innerHTML={isLoading ? "Signing..." : "Share Access"}
                      onClickHandler={handleGrantAccess}
                    />
                  </div>
                )}
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
                dataProtector={dataProtector}
                fetchData={fetchData}
                setIsOpenForm={setIsOpenForm}
              />
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default AuthorizePage;

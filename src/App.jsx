import { useEffect, useState } from "react";
import "./App.css";
import Logo from "./assets/iexec-logo.png";
import Icon from "./assets/identicon.png";
import Logout from "./assets/logout.svg";
import { ethers } from "ethers";
import { IExecDataProtector } from "@iexec/dataprotector";



function App() {
  const web3Provider = window.ethereum;
  // instantiate
  const dataProtector = new IExecDataProtector(web3Provider);
  const [account, setAccount] = useState("");

  const [isOpenForm, setIsOpenForm] = useState(false);
  const [myProtectedData, setMyProtectedData] = useState([])
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    if (account) {
      console.log('trying to fetch data')
      dataProtector.fetchProtectedData({
        owner: account
      }).then((result) => {
        console.log('result', result)
        setMyProtectedData(result)
      })
    }
  }, [account])

  const handleChangeForm = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleGrantAccess = async () => {
    const protectedData = await dataProtector.protectData({
      data: {
        email: formData.email
      },
      name: formData.name
    })

    const grantedAccess = await dataProtector.grantAccess({
      protectedData: protectedData,
      authorizedApp: '0xF048eF3d7E3B33A465E0599E641BB29421f7Df92',
      authorizedUser: account
    })

    console.log('granted access, ', grantedAccess)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitting:", formData);
    await handleGrantAccess()
    setIsOpenForm(false)
    console.log("form submitted")
    // Add your form submission logic here
  };

  const handleConnect = async () => {
    let accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);
  };



  // Detect disconnection from MetaMask
  window.ethereum.on("disconnect", () => {
    setAccount("");
  });

  return (
    <>
      <div className="h-screen bg-cover bg-image">
        {/* NAVBAR */}
        <div className="navbar">
          <div className="flex horizontal gap-3 items-center">
            <img src={Logo} className="logo" />
            <p>Secret Email</p>
          </div>

          {account != "" ? (
            <div className="flex horizontal items-center gap-3">
              <div className="address">
                {account.slice(0, 5) + "..." + account.slice(38, 42)}
                <img src={Icon} />
              </div>
              <button className="bg-transparent p-0">
                <img
                  src={Logout}
                  className="logout"
                  onClick={() => setAccount("")}
                />
              </button>
            </div>
          ) : (
            <button onClick={handleConnect}>Connect Wallet</button>
          )}
        </div>

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
                <span className="text-yellow underline">
                  0xF048eF3d7E3B33A465E0599E641BB29421f7Df92
                </span>{" "}
                would like to get access to you, using iExec secured email
                service.
              </p>
            </div>


            { /* FETCHED DATA */ }
            { myProtectedData.length != 0 ? 
              myProtectedData.map((item, index) =>
              <>
              <div key={index} className="protected-data-frame flex flex-col gap-1">
                <p className="font-bold">{item.name}</p>
                <p className="italic">
                  **email protected**
                </p>
              </div>
              </>)
              :
              <p>You have no protected address yet.</p>
            }

            {/* ICI INSERER LES ADDRESSES PROTEGEES */}
            {!isOpenForm ? (
              <div className="flex flex-col gap-4">
                <button onClick={() => setIsOpenForm(true)}>
                  Protect My Address
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <p>
                Protect your address with iExec. Your email address stays secret, only your name will be shared with the organization.
                </p>
                <div className="flex flex-col gap-1 mt-8">
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

                
                

                
                <input className='button mt-8' type="submit" value="Submit"></input>
                </div>
                
                {/* Submit Button */}
                
              </form>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default App;

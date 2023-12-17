# **iExec Test Dev frontend [draft]**

[Context ](#_page0_x72.00_y322.91)[Deliverable ](#_page0_x72.00_y455.34)[User stories](#_page1_x72.00_y115.64)

[As a web3 company, I want to request access to my users’ email protected by iExec](#_page1_x72.00_y189.31)

[As a user, I want to be able to authorize a web3 company to reach me on one of my emails protected by iExec](#_page1_x72.00_y319.07)

[As a user, I want to be able to protect my email address with iExec ](#_page1_x72.00_y431.57)[Resources](#_page1_x72.00_y516.43)

[MetaMask installation](#_page1_x72.00_y561.59)

[Connect iExec sidechain with MetaMask - Codesandbox ](#_page1_x72.00_y668.19)[@iexec/dataprotector](#_page2_x72.00_y72.00)

[Mockups](#_page2_x72.00_y123.61)

## <a name="_page0_x72.00_y322.91"></a>Context

iExec creates the technologies for individuals and organizations to create, protect and develop their digital estate.

In this context, iExec wants to give the opportunity to web3 companies to contact their users by email without revealing the email address.

## <a name="_page0_x72.00_y455.34"></a>Deliverable

Create a GitHub repository to host the project and invite these users to collaborate:

- PierreJeanjacquot ([https://github.com/PierreJeanjacquot](https://github.com/PierreJeanjacquot/))
- cdaumur (<https://github.com/cdaumur>)
- Fran6o (<https://github.com/Fran6o>)

The deliverable of the project is a SPA created with **React** ready to deploy with **Docker**. The test duration is **2 days**, you must implement as many user stories as possible. Refer to the resources and mockups to achieve this project.

## <a name="_page1_x72.00_y115.64"></a>User stories

#### As a web3 company, I want to request access to my users’ email <a name="_page1_x72.00_y189.31"></a>protected by iExec

- the company can integrate this feature as a link to the web app route **/authorize** with the query parameter **user** containing the company ethereum address (example: localhost:1234/authorize?user=0xF048eF3d7E3B33A465E0599E641BB29421f7Df92 )

#### As a user, I want to be able to authorize a web3 company to reach me <a name="_page1_x72.00_y319.07"></a>on one of my emails protected by iExec

- the user can select a protected email among his/her protected data satisfying the data schema **{ emai l : “s t ri ng” }** (use @iexec/dataprotector fetchProtectedData)
- the user can grant access to the selected protected data to the web3 company **user** ethereum address via the app **web3mai l . apps . i exec. et h** (use @iexec/dataprotector gantAccess)

#### <a name="_page1_x72.00_y431.57"></a>As a user, I want to be able to protect my email address with iExec

- the user can create a new protected data satisfying the data schema **{ emai l : “s t ri ng” }** with a custom name (use @iexec/dataprotector protectData)

## <a name="_page1_x72.00_y516.43"></a>Resources

### <a name="_page1_x72.00_y561.59"></a>MetaMask installation

MetaMask is a blockchain wallet in a browser plugin. It allows the user to interact with decentralized applications on blockchains via its on-chain identity.

MetaMask injects the wi ndow. et her eumobject into the browser allowing decentralized apps to interact with the user’s wallet.

<https://metamask.io/download>

### <a name="_page1_x72.00_y668.19"></a>Connect iExec sidechain with MetaMask - Codesandbox

iExec runs on a specific blockchain, the user needs to be connected to that blockchain to interact with iExec.

<https://codesandbox.io/s/connect-iexec-sidechain-c99k6m>

### <a name="_page2_x72.00_y72.00"></a>@iexec/dataprotector

<https://www.npmjs.com/package/@iexec/dataprotector>

### <a name="_page2_x72.00_y123.61"></a>Mockups

[Figma Mockups here](https://www.figma.com/file/MRxRtyGtIh8kOQjeplX597/mockup-test-dev-front?node-id=0%3A1&mode=dev)

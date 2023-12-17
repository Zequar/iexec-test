import React, { useState, useEffect } from "react";
import Icon from "../assets/identicon.png";
import Logo from "../assets/Logo.png";
import Logout from "../assets/logout.svg";
import Button from "./Button";

import styled from "styled-components";

const StyledNavbar = styled.div`
  background-color: #0d0d1280;
  border-bottom: solid 1px #30303866;
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 32px;
  color: #fff;
  gap: 12px;
  justify-content: space-between;
`;

const LogoImg = styled.img`
  height: 32px;
`;

const IdenticonImg = styled.img`
  height: 16px;
`;

const LogoutImg = styled.img`
  height: 20px;
`;

const AddressWrapper = styled.div`
  border-radius: 8px;
  padding: 8px 12px;
  background-color: #1d1d24;
  color: #fcd15a;
  height: 34px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Navbar = ({ setAccount, account, handleConnect }) => {
  return (
    <StyledNavbar className="navbar">
      <div className="flex horizontal gap-3 items-center">
        <LogoImg src={Logo} alt="Logo iExec" />
        <p className="logoFont">Secret Email</p>
      </div>

      {account != "" ? (
        <div className="flex horizontal items-center gap-3">
          <AddressWrapper>
            {account.slice(0, 5) + "..." + account.slice(38, 42)}
            <IdenticonImg src={Icon} alt="connectedIcon" />
          </AddressWrapper>
          <button className="bg-transparent p-0">
            <LogoutImg
              src={Logout}
              alt="Logout"
              onClick={() => setAccount("")}
            />
          </button>
        </div>
      ) : (
        <Button innerHTML={"Connect Wallet"} onClickHandler={handleConnect} />
      )}
    </StyledNavbar>
  );
};

export default Navbar;

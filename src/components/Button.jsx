import React, { useState, useEffect } from "react";

import styled from "styled-components";

const StyledButton = styled.button`
  background-color: #fcd15a;
  padding: 8px 16px;
  color: #000;
  border-radius: 8px;

  &:not(:disabled):hover {
    background: radial-gradient(
      circle 185px at var(--x, 50%) var(--y, 50%),
      #ffad4d 0%,
      #fcd15a 50%
    );
  }

  &:disabled {
    background-color: #dac17c;
  }
`;

const Button = ({ onClickHandler, innerHTML, className, isLoading = false }) => {
  const [gradientPosition, setGradientPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    let rect = e.target.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    setGradientPosition({ x: x, y: y });
  };

  return (
    <StyledButton
      className={className}
      disabled={isLoading}
      dangerouslySetInnerHTML={{ __html: innerHTML }}
      style={{
        "--x": gradientPosition.x + "px", // Define a different color for hover
        "--y": gradientPosition.y + "px", // Define a different color for hover
      }}
      onClick={onClickHandler}
      onMouseMove={handleMouseMove}
    ></StyledButton>
  );
};

export default Button;

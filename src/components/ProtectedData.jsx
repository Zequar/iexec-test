import React, { useState, useEffect, useRef } from "react";
import { throttle } from "lodash";

const ProtectedData = ({ myProtectedData, grantedAccesses, setSelectedDataAddress, dataProtector }) => {
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  let element = document.querySelector(".data-selected")

  const handleItemClick = (item, index) => {
    setSelectedDataAddress(item.address);
    setSelectedItemIndex(index);
    element = document.querySelector(".data-selected")
  };

  const startAnimating = () => {
    let startTime;

    const animate = (currentTime) => {
      if (!startTime) {
        startTime = currentTime;
      }

      const elapsedTime = currentTime - startTime;
      const animationDuration = 2500;

      const progress = (elapsedTime % animationDuration) / animationDuration;
      const newAngle = 360 * progress;

      element = document.querySelector(".data-selected")
      element.style.setProperty("--gradient-angle", `${newAngle}deg`);

      setTimeout(() => {
        requestAnimationFrame(animate)
      }, 16)
    }

    requestAnimationFrame(animate);
  }

  useEffect(() => {
    element = document.querySelector(".data-selected")
    startAnimating()
  }, []);

  return (
    <ul className="flex flex-col gap-4 w-full">
      {myProtectedData.map((item, index) => (
        <li
          key={index}
          style={{

          }}
          className={`protected-data-frame flex flex-col gap-1 
                      ${
                        selectedItemIndex == index
                          ? "data-selected"
                          : "data-unselected"
                      }`}
          onClick={() => handleItemClick(item, index)}
        >
          <div>
            <p className="font-bold">{item.name}</p>
            <p className="italic">**email protected**</p>
            {
              grantedAccesses[index] && 
              <p className="text-gray-600">Already Granted ✓</p>
            }

          </div>
        </li>
      ))}
    </ul>
  );
};

export default ProtectedData;

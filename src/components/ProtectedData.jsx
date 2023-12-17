import React, { useState, useEffect, useRef } from "react";
import { throttle } from "lodash";

const ProtectedData = ({ myProtectedData, setSelectedDataAddress }) => {
  const [selectedItemIndex, setSelectedItemIndex] = useState(0);

  const elementRef = useRef(null);
  let element = document.querySelector(".data-selected")

  const handleItemClick = (item, index) => {
    setSelectedDataAddress(item.address);
    setSelectedItemIndex(index);
    element = document.querySelector(".data-selected")
  };

  const startAnimating = () => {
    let startTime;

    const animate = (currentTime) => {
      console.log('animating')
      if (!startTime) {
        startTime = currentTime;
      }

      const elapsedTime = currentTime - startTime;
      const animationDuration = 2500;

      const progress = (elapsedTime % animationDuration) / animationDuration;
      const newAngle = 360 * progress;

      element.style.setProperty("--gradient-angle", `${newAngle}deg`);

      requestAnimationFrame(animate);
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
          ref={selectedItemIndex == index ? elementRef : null}
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
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ProtectedData;

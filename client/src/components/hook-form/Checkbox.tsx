import React from "react";
import "@/styles/Checkbox.css";

interface IProps {}

function Checkbox() {
  return (
    <div className="checkbox_container">
      <label>
        <input type="radio" name="radio" />
        <span>CSS</span>
      </label>
      <label>
        <input type="radio" name="radio" />
        <span>Javascript</span>
      </label>
    </div>
  );
}

export default Checkbox;

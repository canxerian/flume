import React from "react";
import styles from "./TextInput.css";
import { RecalculateStageRectContext } from '../../context'

const TextInput = ({
  placeholder,
  updateNodeConnections,
  onChange,
  data,
  step,
  minValue = Number.MIN_VALUE,
  maxValue = Number.MAX_VALUE,
  type,
  disableInputs
}) => {
  const numberInput = React.useRef()
  const recalculateStageRect = React.useContext(RecalculateStageRectContext)

  const handleDragEnd = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleDragEnd);
  };

  const handleMouseMove = e => {
    e.stopPropagation();
    updateNodeConnections();
  };

  const handlePossibleResize = e => {
    e.stopPropagation();
    recalculateStageRect();
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleDragEnd);
  };

  return (
    <div className={styles.wrapper} data-flume-component="text-input">
      {type === "number" ? (
        <input
          disabled={disableInputs}
          data-flume-component="text-input-number"
          onKeyDown={e => {
            if (e.keyCode === 69) {
              e.preventDefault()
              return false;
            }
          }}
          onChange={e => {
            const inputValue = e.target.value.replace(/e/g, "");
            if (!!inputValue) {
              let value = parseFloat(inputValue, 10);
              if (Number.isNaN(value)) {
                onChange(0);
              }
              else {
                value = Math.min(value, maxValue);
                value = Math.max(value, minValue);
                onChange(value);
                numberInput.current.value = value;
              }
            }
          }}
          onBlur={e => {
            if (!e.target.value) {
              onChange(0);
              numberInput.current.value = 0;
            }
          }}
          step={step || "1"}
          min={`"${minValue}"`}
          max={`"${maxValue}"`}
          onMouseDown={handlePossibleResize}
          type={type || "text"}
          placeholder={placeholder}
          className={styles.input}
          defaultValue={data}
          onDragStart={e => e.stopPropagation()}
          ref={numberInput}
        />
      ) : (
        <textarea
          data-flume-component="text-input-textarea"
          onChange={e => onChange(e.target.value)}
          onMouseDown={handlePossibleResize}
          type="text"
          placeholder={placeholder}
          className={styles.input}
          value={data}
          onDragStart={e => e.stopPropagation()}
        />
      )}
    </div>
  );
};

export default TextInput;

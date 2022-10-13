import React from "react";
import selectStyles from "../Select/Select.css";
import { Portal } from "react-portal";
import ContextMenu from "../ContextMenu/ContextMenu";
import styles from "./Select.css";

const MAX_LABEL_LENGTH = 50;

const Select = ({
  options = [],
  placeholder = "[Select an option]",
  onChange,
  data,
  allowMultiple,
  disableInputs,
}) => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [drawerCoordinates, setDrawerCoordinates] = React.useState({
    x: 0,
    y: 0
  });
  const wrapper = React.useRef();

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const openDrawer = () => {
    if (disableInputs) {
      return;
    }

    if (!drawerOpen) {
      const wrapperRect = wrapper.current.getBoundingClientRect();
      setDrawerCoordinates({
        x: wrapperRect.x,
        y: wrapperRect.y + wrapperRect.height
      });
      setDrawerOpen(true);
    }
  };

  const handleOptionSelected = option => {
    if (allowMultiple) {
      onChange([...data, option.value]);
    } else {
      onChange(option.value)
    }
  };

  const handleOptionDeleted = optionIndex => {
    onChange([...data.slice(0, optionIndex), ...data.slice(optionIndex + 1)]);
  };

  const getFilteredOptions = () => (
    allowMultiple ?
      options.filter(opt => !data.includes(opt.value))
      : options
  )

  const selectedOption = React.useMemo(() => {
    const option = options.find(o => o.value === data);
    if (option) {
      return {
        ...option,
        label:
          option.label.length > MAX_LABEL_LENGTH
            ? option.label.slice(0, MAX_LABEL_LENGTH) + "..."
            : option.label
      };
    }
  }, [options, data]);

  return (
    <React.Fragment>
      {allowMultiple ? (
        data.length ? (
          <div className={styles.chipsWrapper}>
            {data.map((val, i) => {
              const optLabel =
                (options.find(opt => opt.value === val) || {}).label || "";
              return (
                <OptionChip
                  onRequestDelete={() => handleOptionDeleted(i)}
                  key={val}
                >
                  {optLabel}
                </OptionChip>
              );
            })}
          </div>
        ) : null
      ) : data ? (
        <SelectedOption
          wrapperRef={wrapper}
          option={selectedOption}
          onClick={openDrawer}
          disableInputs={disableInputs}
        />
      ) : null}
      {
        (allowMultiple || !data) &&
        <div className={selectStyles.wrapper} ref={wrapper} onClick={openDrawer}>
          {placeholder}
        </div>
      }
      {drawerOpen && (
        <Portal>
          <ContextMenu
            x={drawerCoordinates.x}
            y={drawerCoordinates.y}
            emptyText="There are no options"
            options={getFilteredOptions()}
            onOptionSelected={handleOptionSelected}
            onRequestClose={closeDrawer}
          />
        </Portal>
      )}
    </React.Fragment>
  );
};

export default Select;

const SelectedOption = ({
  option: { label, description } = {},
  wrapperRef,
  onClick,
  disableInputs
}) => (
  <div
    className={styles.selectedWrapper}
    onClick={onClick}
    ref={wrapperRef}
    data-flume-component="select"
    data-disabled={disableInputs ? "true" : "false"}
  >
    <label data-flume-component="select-label">{label}</label>
    {description ? <p data-flume-component="select-desc">{description}</p> : null}

    {/* Down chevron */}
    <div className={selectStyles.selectedWrapperIcon}>
      <svg fill="currentColor" class="___12fm75w_v8ls9a0 f1w7gpdv fez10in fg4l7m0" aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.85 7.65c.2.2.2.5 0 .7l-5.46 5.49a.55.55 0 01-.78 0L4.15 8.35a.5.5 0 11.7-.7L10 12.8l5.15-5.16c.2-.2.5-.2.7 0z" fill="currentColor">
        </path>
      </svg>
    </div>
  </div>
);

const OptionChip = ({ children, onRequestDelete }) => (
  <div className={styles.chipWrapper}>
    {children}
    <button
      className={styles.deleteButton}
      onMouseDown={e => {
        e.stopPropagation();
      }}
      onClick={onRequestDelete}
    >
      ✕
    </button>
  </div>
);

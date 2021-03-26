import React, { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import FilterGroup from "./filterGroup";

const FilterModal = ({
  buttonLabel,
  className,
  setSizeFilter,
  setParishesFilter,
  checkedIndexSize,
  checkedIndexParishes,
  setCheckedIndexSize,
  setCheckedIndexParishes,
}) => {
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  const handleRadioChangeSize = (filter, index) => {
    setCheckedIndexSize(index);
    setSizeFilter(filter);
  };

  const handleRadioChangeParishes = (filter, index) => {
    console.log("parishes filter is", filter);
    setCheckedIndexParishes(index);
    setParishesFilter(filter);
  };

  return (
    <div>
      <Button color="danger" onClick={toggle}>
        {buttonLabel}
      </Button>
      <Modal isOpen={modal} toggle={toggle} className={className}>
        <ModalHeader toggle={toggle}>Filter Options</ModalHeader>
        <ModalBody>
          <FilterGroup
            filters={["All", "Small", "Medium", "Big"]}
            filtersName={"Size"}
            selectedIndex={checkedIndexSize}
            onRadioChange={handleRadioChangeSize}
          ></FilterGroup>
          <FilterGroup
            filters={[
              "All",
              "St. James",
              "Christ Church",
              "St. Michael",
              "St. Philip",
              "St. George",
              "St. John",
              "St. Joseph",
              "St. Andrew",
              "St. Peter",
              "St. Lucy",
              "St. Thomas",
            ]}
            filtersName={"Parishes"}
            selectedIndex={checkedIndexParishes}
            onRadioChange={handleRadioChangeParishes}
          ></FilterGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={toggle}>
            Apply filters
          </Button>{" "}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default FilterModal;

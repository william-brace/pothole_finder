import React, { useState } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import FilterGroup from "./filterGroup";

const FilterModal = ({ buttonLabel, className, setSizeFilter }) => {
  const [checkedIndexSize, setCheckedIndexSize] = useState(0);

  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  const handleRadioChangeSize = (filter, index) => {
    setCheckedIndexSize(index);
    setSizeFilter(filter);
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

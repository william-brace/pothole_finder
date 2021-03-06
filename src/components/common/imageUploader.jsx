import React, { useState } from "react";
import { FormGroup, Input } from "reactstrap";

const ImageUploader = () => {
  const [selectedImages, setSelectedImages] = useState([]);

  const handleImageChange = (e) => {
    if (e.target.files) {
      console.log(e.target.files);

      if (e.target.files) {
        const filesArray = Array.from(e.target.files).map((file) =>
          URL.createObjectURL(file)
        );

        setSelectedImages((prevImages) => prevImages.concat(filesArray));

        console.log(filesArray);
      }
    }
  };

  const handleImageDelete = (image) => {
    setSelectedImages(selectedImages.filter((pic) => pic !== image));
  };

  const renderImages = (images) => {
    if (images) {
      return images.map((image) => {
        return (
          <span className="position-relative">
            <img
              src={image}
              key={image}
              height={75}
              width={75}
              className="border rounded m-2"
            />
            <span
              className="material-icons position-absolute top-0 end-0"
              style={{ colot: "white" }}
              onClick={() => handleImageDelete(image)}
              data-key={image}
            >
              cancel
            </span>
          </span>
        );
      });
    }
  };

  return (
    <FormGroup>
      <span>{renderImages(selectedImages)}</span>
      <Input
        className="border rounded py-2 px-2"
        type={"file"}
        name={"imageUploader"}
        id="exampleName"
        placeholder={"Upload Images Here"}
        multiple
        onChange={handleImageChange}
      />
    </FormGroup>
  );
};

export default ImageUploader;

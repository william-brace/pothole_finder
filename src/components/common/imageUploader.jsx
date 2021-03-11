import React, { useState } from "react";
import { FormGroup, Input } from "reactstrap";
import { storage } from "../../firebase.js";

const ImageUploader = () => {
  const [selectedImages, setSelectedImages] = useState([]);

  const handleImageChange = (e) => {
    if (e.target.files) {
      console.log(e.target.files);

      const imagesArray = Array.from(e.target.files);

      setSelectedImages(imagesArray);

      // if (e.target.files) {
      //   const filesArray = Array.from(e.target.files).map((file) =>
      //     URL.createObjectURL(file)
      //   );

      //   setSelectedImages((prevImages) => prevImages.concat(filesArray));

      //   console.log(filesArray);
      // }
    }
  };

  const handleImageDelete = (image) => {
    setSelectedImages(selectedImages.filter((pic) => pic !== image));
  };

  const handleImageUpload = () => {
    selectedImages.forEach((image) => {
      const uploadTask = storage.ref().child(`images/${image.name}`).put(image);

      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          // Handle unsuccessful uploads
          console.log("Error uploading image", image.name);
        },
        () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            console.log("File available at", downloadURL);
          });
        }
      );
    });
  };

  const renderImages = (images) => {
    if (images) {
      const imageDisplay = Array.from(images).map((image) =>
        URL.createObjectURL(image)
      );

      return imageDisplay.map((image, index) => {
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
              onClick={() => handleImageDelete(selectedImages[index])}
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
      <span onClick={handleImageUpload}>Upload</span>
      {console.log(selectedImages)}
    </FormGroup>
  );
};

export default ImageUploader;

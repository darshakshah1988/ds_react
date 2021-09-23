import React, { Fragment, useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Controller, UseFormSetValue, UseFormSetError } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';

import { ImageUploadIcon } from '../../svgs';
import { InvalidBorderUtility } from '../../styles/reuse';

// Types
type Props = {
  control: any; // This object contains methods for registering external components into RHF.
  name: string; // Name of the field which you want to register with RHF.
  setValue: UseFormSetValue<any>; // This RHF function allows us to dynamically set the value of a registered field.
  setError: UseFormSetError<any>; // This RHF function allows us to manually set one or more errors.
  invalid?: boolean | undefined;
  initialUrl?: string | null | undefined;
};

export default function ArtistSingleImageUploader(props: Props) {
  const { control, name, setValue, invalid, initialUrl } = props;

  const [files, setFiles] = useState<Array<any>>([]);

  // ------------------ Functions ------------------

  const onDrop = useCallback(
    acceptedFiles => {
      const acceptedLength = acceptedFiles.length;
      if (acceptedLength > 0) {
        // ------------------ Update Field ------------------
        setValue(name, acceptedFiles[0]);
        // ------------------ Previews ------------------
        const filesWithPreview = acceptedFiles.map((file: any) => {
          return { ...file, preview: URL.createObjectURL(file) };
        });
        // ------------------ State updating ------------------
        setFiles(filesWithPreview);
      }
    },
    [name, setValue]
  );

  const thumbs = files.map((file: any, index: number) => {
    return (
      <ArtistSingleImageUploader.FileUploadThumb key={`${file.name}-${index}`}>
        <img src={file.preview} alt={file.name} />
      </ArtistSingleImageUploader.FileUploadThumb>
    );
  });

  // ------------------ End - Functions ------------------

  // ------------------ useDropzone hook ------------------
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/jpg, image/jpeg, image/png',
    multiple: false,
    onDrop: onDrop
  });
  // ------------------ End - useDropzone hook ------------------

  useEffect(() => {
    return () => {
      files.forEach((file: any) => URL.revokeObjectURL(file.preview)); // Make sure to revoke the data uris to avoid memory leaks
    };
  }, [files]);

  // Initialize preview if there is attached with the field
  useEffect(() => {
    if (typeof initialUrl === 'string' && initialUrl.length > 0) {
      setFiles([{ preview: initialUrl }]);
    }
  }, [initialUrl]);

  return (
    <Fragment>
      <Controller
        control={control}
        name={name}
        render={controllerProps => {
          const {
            field: { onChange }
          } = controllerProps;
          return (
            <ArtistSingleImageUploader.FileUpload
              {...getRootProps()}
              $invalid={invalid}
            >
              <input
                {...getInputProps({
                  onChange: (e: any) => onChange(e.target.files[0])
                })}
              />
              <ArtistSingleImageUploader.UploadSvgWrap>
                <ImageUploadIcon width={50} height={50} />
              </ArtistSingleImageUploader.UploadSvgWrap>
              <ArtistSingleImageUploader.UploadText>
                ADD ARTIST IMAGE
              </ArtistSingleImageUploader.UploadText>
              {thumbs}
            </ArtistSingleImageUploader.FileUpload>
          );
        }}
      />
      {/* ------------------ End - File Upload  ------------------ */}
    </Fragment>
  );
}

// FileUpload
ArtistSingleImageUploader.FileUpload = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 5px;
  transition: border 0.24s ease-in-out;
  cursor: pointer;
  z-index: 1;
  width: 296px;
  height: 296px;

  ${InvalidBorderUtility};
`;

ArtistSingleImageUploader.UploadSvgWrap = styled.div`
  color: #718898;
  margin-bottom: 8px;
`;

ArtistSingleImageUploader.UploadText = styled.p`
  font-size: 18px;
  text-align: center;
  color: #718898;
  margin-bottom: 0;
`;

ArtistSingleImageUploader.FileUploadThumb = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 2;

  & > img {
    display: block;
    max-width: 100%;
    min-width: 296px;
    min-height: 296px;
    height: 100%;
  }
`;

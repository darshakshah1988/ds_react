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

export default function AdminSingleFileUpload(props: Props) {
  const { control, name, setValue, setError, invalid, initialUrl } = props;

  const [files, setFiles] = useState<Array<any>>([]);

  // ------------------ Functions ------------------

  const onDrop = useCallback(
    (acceptedFiles, fileRejections) => {
      const acceptedLength = acceptedFiles.length;
      const rejectedLength = fileRejections.length;

      if (acceptedLength > 0) {
        // ------------------ Update Field ------------------
        setValue(name, acceptedFiles[0], { shouldValidate: true });
        // ------------------ Previews ------------------
        const filesWithPreview = acceptedFiles.map((file: any) => {
          return { ...file, preview: URL.createObjectURL(file) };
        });
        // ------------------ State updating ------------------
        setFiles(filesWithPreview);
      } else if (rejectedLength > 0) {
        // ------------------ Update Field ------------------
        setValue(name, null, { shouldValidate: false });

        // ------------------ Update Error ------------------
        setError(name, {
          type: 'manual',
          message: 'File must be JPG or PNG only'
        });

        // ------------------ Previews ------------------
        setFiles([]);
      }
    },
    [name, setValue, setError]
  );

  const thumbs = files.map((file: any, index: number) => {
    return (
      <AdminSingleFileUpload.FileUploadThumb key={`${file.name}-${index}`}>
        <img src={file.preview} alt={file.name} />
      </AdminSingleFileUpload.FileUploadThumb>
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

  // ✅ useEffect 1 - To revoke the data uris to avoid memory leaks
  useEffect(() => {
    return () => {
      files.forEach((file: any) => URL.revokeObjectURL(file.preview)); // Make sure to revoke the data uris to avoid memory leaks
    };
  }, [files]);

  // ✅ useEffect 2 - Initialize preview if there is attached with the field
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
            <AdminSingleFileUpload.FileUpload
              {...getRootProps()}
              $invalid={invalid}
            >
              <input
                {...getInputProps({
                  onChange: (e: any) => onChange(e.target.files[0])
                })}
              />
              <AdminSingleFileUpload.UploadSvgWrap>
                <ImageUploadIcon width={50} height={50} />
              </AdminSingleFileUpload.UploadSvgWrap>
              <AdminSingleFileUpload.UploadText>
                Add ARTWORK IMAGE
              </AdminSingleFileUpload.UploadText>
              {thumbs}
            </AdminSingleFileUpload.FileUpload>
          );
        }}
      />
      {/* ------------------ End - File Upload  ------------------ */}
    </Fragment>
  );
}

// FileUpload
AdminSingleFileUpload.FileUpload = styled.div`
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
  margin-left: auto;
  margin-right: auto;

  width: 314px;
  height: 314px;

  ${InvalidBorderUtility};

  @media (min-width: 992px) {
    margin: 0;
  }
`;

AdminSingleFileUpload.UploadSvgWrap = styled.div`
  color: #718898;
  margin-bottom: 8px;
`;

AdminSingleFileUpload.UploadText = styled.p`
  font-size: 18px;
  text-align: center;
  color: #718898;
  margin-bottom: 0;
`;

AdminSingleFileUpload.FileUploadThumb = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 2;

  & > img {
    display: block;
    min-width: 314px;
    min-height: 314px;
    max-width: 100%;
    height: 100%;
  }
`;

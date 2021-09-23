import React, { Fragment, useState, useCallback } from 'react';
import styled from 'styled-components';
import { rem } from 'polished';
import { Controller } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';

import { FileUploadIcon } from '../../svgs';

import { InvalidBorderUtility } from '../../styles/reuse';

// Types
type Props = {
  control: any; // This object contains methods for registering external components into RHF.
  name: string; // Name of the field which you want to register with RHF.
  text: string;
  onAcceptedFiles: (acceptedFiles: Array<any>) => void; // This function will invoke through parent.
  onRejectedFiles: (rejectedFiles: Array<any>) => void; // This function will invoke through parent.
  width?: number;
  height?: number;
  invalid?: boolean | undefined;
};

export default function AdminSingleGraphUpload(props: Props) {
  const {
    control,
    name,
    text,
    onAcceptedFiles,
    onRejectedFiles,
    width,
    height,
    invalid
  } = props;

  const [files, setFiles] = useState([]);

  // ------------------ Functions ------------------

  const onDrop = useCallback(
    acceptedFiles => {
      onRejectedFiles([]); // Invoke function of the parent component when files will be rejected.
      onAcceptedFiles(acceptedFiles); // Invoke function of the parent component when files will be accepted.
      setFiles(acceptedFiles); // Update the state of the files
    },
    [onAcceptedFiles, onRejectedFiles]
  );

  const onDropRejected = useCallback(
    rejectedFiles => {
      // Invoke function of the parent component when files will be rejected.
      onRejectedFiles(rejectedFiles);
    },
    [onRejectedFiles]
  );

  const filesInfoJSX = files.map((file: any, index: number) => {
    return (
      <AdminSingleGraphUpload.FileInfo key={`${file.name}-${index}`}>
        {file.name} - <span>({file.size} bytes)</span>
      </AdminSingleGraphUpload.FileInfo>
    );
  });

  // ------------------ End - Functions ------------------

  // ------------------ useDropzone hook ------------------
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*,.pdf, .txt',
    multiple: false,
    onDrop: onDrop,
    onDropRejected: onDropRejected
  });
  // ------------------ End - useDropzone hook ------------------

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
            <Fragment>
              <AdminSingleGraphUpload.FileUpload
                {...getRootProps()}
                $width={width}
                $height={height}
                $invalid={invalid}
                $styled={styled}
              >
                <input
                  {...getInputProps({
                    onChange: (e: any) => onChange(e.target.files[0])
                  })}
                />
                <AdminSingleGraphUpload.UploadSmallBox>
                  <FileUploadIcon />
                  <span>{text}</span>
                </AdminSingleGraphUpload.UploadSmallBox>
              </AdminSingleGraphUpload.FileUpload>
              {/*  Show filename with its bytes */}
              {filesInfoJSX}
            </Fragment>
          );
        }}
      />
      {/* ------------------ End - File Upload  ------------------ */}
    </Fragment>
  );
}

// FileUpload
AdminSingleGraphUpload.FileUpload = styled.div<{
  $width?: number;
  $height?: number;
}>`
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

  padding: ${rem(80)} ${rem(40)};

  & {
    width: ${({ $width }) => ($width ? `${$width}px` : 'auto')};
    height: ${({ $height }) => ($height ? `${$height}px` : 'auto')};
  }

  ${InvalidBorderUtility};
`;

AdminSingleGraphUpload.UploadSmallBox = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  font-size: ${rem(14)};
  font-weight: 600;
  font-family: ${({ theme }) => theme.fonts.sansSerif.montserrat};

  color: #272b2f;
  background-color: #eee;
  padding: ${rem(8)} ${rem(20)};

  border-radius: 9999px;

  > svg {
    margin-right: ${rem(12)};
  }
`;

AdminSingleGraphUpload.FileInfo = styled.div`
  margin-top: 24px;
  font-size: ${rem(14)};
  font-weight: 700;
  color: #272b2f;
  text-align: center;
  > span {
    font-weight: 400;
    color: #bebebe;
  }
`;

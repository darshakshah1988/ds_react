import { Fragment, useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { rem } from 'polished';
import { Controller, UseFormSetValue, UseFormSetError } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';

import { InvalidBorderUtility } from '../../styles/reuse';
import { ArtworkUploadIcon, ArtworkUploadCloseIcon } from '../../svgs';

// Types
type Props = {
  control: any; // This object contains methods for registering external components into RHF.
  name: string; // Name of the field which you want to register with RHF.
  setValue: UseFormSetValue<any>; // This RHF function allows us to dynamically set the value of a registered field.
  setError: UseFormSetError<any>; // This RHF function allows us to manually set one or more errors.
  invalid?: boolean | undefined;
  initialUrl?: string | null | undefined;
};

export default function NotableArtworkUploader(props: Props) {
  const { control, name, setValue, setError, invalid, initialUrl } = props;

  const [previewFiles, setPreviewFiles] = useState<Array<any>>([]);

  // ------------------ Functions ------------------
  // Note that on-drop callback will always be called regardless of whether
  // dropped files are accepted or rejected.
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
        setPreviewFiles(filesWithPreview);
      } else if (rejectedLength > 0) {
        // ------------------ Update Field ------------------
        setValue(name, null, { shouldValidate: false });

        // ------------------ Update Error ------------------
        setError(name, {
          type: 'manual',
          message: 'File must be JPG or PNG only'
        });

        // ------------------ Previews ------------------
        setPreviewFiles([]);
      }
    },
    [name, setValue, setError]
  );

  // This function will help us to remove the file based on the index number.
  function removeFile(
    event: React.MouseEvent<HTMLButtonElement>,
    fileIndex: number
  ) {
    if (
      fileIndex !== -1 &&
      Array.isArray(previewFiles) &&
      previewFiles.length > 0
    ) {
      const filteredArray = previewFiles.filter((_, index) => {
        return fileIndex !== index; // In false iteration case it will skip/remove that element from the array.
      });
      if (Array.isArray(filteredArray) && filteredArray.length === 0) {
        setValue(name, null, { shouldValidate: true });
      }
      setPreviewFiles(filteredArray);
    }
  }

  // This function will render the preview of the uploaded images in the form of JSX.
  function renderThumbs(files: Array<any>) {
    if (Array.isArray(files) && files.length > 0) {
      return (
        <Fragment>
          {files.map((file: any, index: number) => {
            return (
              <NotableArtworkUploader.FileUploadThumbWrapper
                key={`${file.name}-${index}`}
              >
                {/* Thumb Image */}
                <img src={file.preview} alt={file.name} />
                {/* End - Thumb Image */}

                {/* Thumb Close Button */}
                <NotableArtworkUploader.FileUploadThumbCloseButton
                  type="button"
                  onClick={event => removeFile(event, index)}
                >
                  <ArtworkUploadCloseIcon />
                </NotableArtworkUploader.FileUploadThumbCloseButton>
                {/* End - Thumb Close Button */}
              </NotableArtworkUploader.FileUploadThumbWrapper>
            );
          })}
        </Fragment>
      );
    } else {
      return null;
    }
  }

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
      previewFiles.forEach((file: any) => URL.revokeObjectURL(file.preview)); // Make sure to revoke the data uris to avoid memory leaks
    };
  }, [previewFiles]);

  // Initialize preview if there is attached with the field
  useEffect(() => {
    if (typeof initialUrl === 'string' && initialUrl.length > 0) {
      setPreviewFiles([{ preview: initialUrl }]);
    }
  }, [initialUrl]);

  return (
    <Fragment>
      <NotableArtworkUploader.FileUploadWrapperFlex>
        {/* Item 1 */}
        <NotableArtworkUploader.FileUploadBox>
          <Controller
            control={control}
            name={name}
            render={controllerProps => {
              const {
                field: { onChange }
              } = controllerProps;
              return (
                <NotableArtworkUploader.FileUpload
                  {...getRootProps()}
                  $invalid={invalid}
                >
                  <input
                    {...getInputProps({
                      onChange: (e: any) => onChange(e.target.files[0])
                    })}
                  />
                  <NotableArtworkUploader.UploadSvgWrap>
                    <ArtworkUploadIcon />
                  </NotableArtworkUploader.UploadSvgWrap>
                  <NotableArtworkUploader.UploadText>
                    Upload
                  </NotableArtworkUploader.UploadText>
                </NotableArtworkUploader.FileUpload>
              );
            }}
          />
        </NotableArtworkUploader.FileUploadBox>
        {/* End- Item 1 */}

        {/* Item 2 */}
        {renderThumbs(previewFiles)}
        {/* End - Item 2 */}
      </NotableArtworkUploader.FileUploadWrapperFlex>
    </Fragment>
  );
}

// Styled
// Notable Artwork File Uploader
// Flex
NotableArtworkUploader.FileUploadWrapperFlex = styled.div`
  display: flex;
  margin-bottom: ${rem(16)};
`;

// Flex Item 1
NotableArtworkUploader.FileUploadBox = styled.div`
  width: 178px;
  height: 178px;
`;

NotableArtworkUploader.FileUpload = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border: 1px solid #c5c5c5;
  border-radius: 5px;
  transition: border 0.24s ease-in-out;
  cursor: pointer;
  z-index: 1;

  width: 178px;
  height: 178px;

  ${InvalidBorderUtility};
`;

NotableArtworkUploader.UploadSvgWrap = styled.div`
  color: #718898;
  margin-bottom: 8px;

  > svg {
    width: 24px;
    height: 24px;
  }
`;

NotableArtworkUploader.UploadText = styled.p`
  font-size: 16px;
  text-align: center;
  color: #696969;
  margin-bottom: 0;
`;
// End - Notable Artwork File Uploader

// Flex Item 2
NotableArtworkUploader.FileUploadThumbWrapper = styled.div`
  position: relative;
  background-color: #eee;
  width: 178px;
  height: 178px;
  margin-left: ${rem(32)};

  & > img {
    display: block;
    min-width: 178px;
    min-height: 178px;
    max-width: 100%;
    height: 100%;
    border-radius: 5px;
  }
`;

NotableArtworkUploader.FileUploadThumbCloseButton = styled.button`
  position: absolute;
  top: -12px;
  right: -8px;
  background-color: #fff;
  border: 1px solid #dfdfdf;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  user-select: none;

  &:focus {
    outline: 0;
  }

  > svg {
    width: 10px;
    height: 10px;
  }
`;

// End - Notable Artwork File Thumbs list

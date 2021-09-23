import * as Yup from 'yup';

import {
  ADMIN_CLIENT_SIDE_RULES,
  ADMIN_ADD_ARTWORK_BASIC
} from '../constants/Validations';

import {
  onlyAlphabetsAndSpace,
  onlyPositiveNumeric,
  onlyPositiveNumericAndFraction
} from '../../helpers';

// Add Artist Validation Schema
export const addArtistValidationSchema = Yup.object().shape({
  name: Yup.string().required(ADMIN_CLIENT_SIDE_RULES.ARTIST.NAME.MESSAGE_1),
  overview: Yup.string().required(
    ADMIN_CLIENT_SIDE_RULES.ARTIST.OVERVIEW.MESSAGE_1
  ),
  notableArtworks: Yup.array().of(
    Yup.object().shape({
      notableArtName: Yup.string().required(
        ADMIN_CLIENT_SIDE_RULES.ARTIST.NOTABLE_ARTWORK_NAME.MESSAGE_1
      ),
      notableArtDescription: Yup.string().required(
        ADMIN_CLIENT_SIDE_RULES.ARTIST.NOTABLE_ARTWORK_DESCRIPTION.MESSAGE_1
      ),
      notableArtImage: Yup.mixed().required(
        ADMIN_CLIENT_SIDE_RULES.ARTIST.NOTABLE_ARTWORK_IMAGE.MESSAGE_1
      )
    })
  )
});

// Add Artwork Validation Schema
export const addArtworkBasicValidationSchema = Yup.object().shape({
  artistName: Yup.string().required(
    ADMIN_ADD_ARTWORK_BASIC.ARTIST_NAME.MESSAGE_1
  ),

  name: Yup.string()
    .required(ADMIN_ADD_ARTWORK_BASIC.ARTWORK_NAME.MESSAGE_1)
    .test('name', ADMIN_ADD_ARTWORK_BASIC.ARTWORK_NAME.MESSAGE_2, value =>
      onlyAlphabetsAndSpace(value)
    ),

  price: Yup.string()
    .required(ADMIN_ADD_ARTWORK_BASIC.ART_PRICE.MESSAGE_1)
    .test('price', ADMIN_ADD_ARTWORK_BASIC.ART_PRICE.MESSAGE_2, value =>
      onlyPositiveNumeric(value)
    ),

  category: Yup.string()
    .required()
    .oneOf(['TA', 'NFT']),

  subCategory: Yup.string().required(),

  material: Yup.string().required(ADMIN_ADD_ARTWORK_BASIC.MATERIAL.MESSAGE_1),

  artFile: Yup.mixed().required(ADMIN_ADD_ARTWORK_BASIC.ART_FILE.MESSAGE_1),

  size: Yup.object().shape({
    dimension: Yup.string()
      .required('')
      .test('dimension', ADMIN_ADD_ARTWORK_BASIC.SIZE.MESSAGE_1, value =>
        onlyPositiveNumericAndFraction(value)
      ),
    length: Yup.string()
      .required('')
      .test('length', ADMIN_ADD_ARTWORK_BASIC.SIZE.MESSAGE_1, value =>
        onlyPositiveNumericAndFraction(value)
      ),
    width: Yup.string()
      .required('')
      .test('width', ADMIN_ADD_ARTWORK_BASIC.SIZE.MESSAGE_1, value =>
        onlyPositiveNumericAndFraction(value)
      ),
    height: Yup.string()
      .required('')
      .test('height', ADMIN_ADD_ARTWORK_BASIC.SIZE.MESSAGE_1, value =>
        onlyPositiveNumericAndFraction(value)
      )
  }),

  // Holdings Optional
  holdings: Yup.string()
    .notRequired()
    .test('holdings', ADMIN_ADD_ARTWORK_BASIC.HOLDING.MESSAGE_1, value =>
      value && value.length > 0 ? onlyPositiveNumeric(value) : true
    ),

  // Collectors Optional
  collectors: Yup.string()
    .notRequired()
    .test('collectors', ADMIN_ADD_ARTWORK_BASIC.COLLECTORS.MESSAGE_1, value =>
      value && value.length > 0 ? onlyPositiveNumeric(value) : true
    ),

  description: Yup.string().required(
    ADMIN_ADD_ARTWORK_BASIC.DESCRIPTION.MESSAGE_1
  )
});

/**
 * We are not using Yup to validate uploaded files. Since we are using
 * the react-dropzone package which already has a built-in file validation
 * rules, we will rely on it and this package will return a file rejection
 * array containing validation errors. So we will show these on the UI.
 ---------------------------------------------------------------
 const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png'];
 notableArtworks: Yup.mixed().test(
 'notableArtworks',
 'Unsupported File Format',
 value => SUPPORTED_FORMATS.includes(value.type)
 )
 ---------------------------------------------------------------

 Checkbox validation:
 ---------------------------------------------------------------
 status: Yup.boolean().oneOf(
 [true],
 ADMIN_CLIENT_SIDE_RULES.ARTIST.STATUS.MESSAGE_1
 ),
 ---------------------------------------------------------------

 *
 */

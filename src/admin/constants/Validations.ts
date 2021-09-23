// Add Artist validation messages
export const ADMIN_CLIENT_SIDE_RULES = {
  ARTIST: {
    NAME: {
      MESSAGE_1: 'Artist name is required'
    },
    OVERVIEW: {
      MESSAGE_1: 'Overview is required'
    },
    NOTABLE_ARTWORK_NAME: {
      MESSAGE_1: 'Notable Artwork is required'
    },
    NOTABLE_ARTWORK_DESCRIPTION: {
      MESSAGE_1: 'Description is required'
    },
    NOTABLE_ARTWORK_IMAGE: {
      MESSAGE_1: 'Artwork Image is required'
    }
  }
};

// Add Artwork validation messages
export const ADMIN_ADD_ARTWORK_BASIC = {
  ARTIST_NAME: {
    MESSAGE_1: 'Artist Name is required'
  },
  ARTWORK_NAME: {
    MESSAGE_1: 'Artwork Name is required',
    MESSAGE_2: 'Artwork name must have alphabets'
  },
  ART_FILE: {
    MESSAGE_1: 'Artwork Photo is required'
  },
  ART_PRICE: {
    MESSAGE_1: 'Artwork Price is required',
    MESSAGE_2: 'Artwork Price must be numeric'
  },
  MATERIAL: {
    MESSAGE_1: 'Material is required'
  },
  HOLDING: {
    MESSAGE_1: 'Holding will be positive numeric value'
  },
  COLLECTORS: {
    MESSAGE_1: 'Collectors value will be positive numeric value'
  },
  SIZE: {
    MESSAGE_1: 'Size will be positive numeric value'
  },
  DESCRIPTION: {
    MESSAGE_1: 'Artwork Description is required',
    MESSAGE_2: 'Artwork Description must have alphabets'
  }
};

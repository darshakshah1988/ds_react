// This file contain all constant variables and functions for material dropdown.

export const ALL_MATERIALS = [
  'Oil',
  'Water color',
  'Graphite',
  'Mixed',
  'Glass',
  'Metal',
  'Stone',
  'Brick',
  'Wood',
  'Mixture',
  'JPEG',
  'BMP',
  'SVG',
  'MP4',
  'MOV',
  'MP3',
  'WAV'
];

const MATERIAL_PAINTING = ['Oil', 'Water color', 'Graphite', 'Mixed'];

const MATERIAL_DRAWING = ['Graphite', 'Mixed'];

const MATERIAL_SCULPTURE = [
  'Glass',
  'Metal',
  'Stone',
  'Brick',
  'Wood',
  'Mixture'
];

export const MATERIAL_IMAGE = ['JPEG', 'BMP', 'SVG'];

export const MATERIAL_VIDEO = ['MP4', 'MOV'];

export const MATERIAL_AUDIO = ['MP3', 'WAV'];

export function materialOptions(category: string, subCategory: string) {
  if (category === 'TA' && subCategory === 'Painting') {
    return MATERIAL_PAINTING;
  } else if (category === 'TA' && subCategory === 'Drawing') {
    return MATERIAL_DRAWING;
  } else if (category === 'TA' && subCategory === 'Sculpture') {
    return MATERIAL_SCULPTURE;
  } else {
    return [];
  }
}

export function materialDisabled(category: string, subCategory: string) {
  if (category === 'TA' && subCategory === 'Painting') {
    return false;
  } else if (category === 'TA' && subCategory === 'Drawing') {
    return false;
  } else if (category === 'TA' && subCategory === 'Sculpture') {
    return false;
  } else {
    return true;
  }
}

export function materialOptions2(category: string, subCategory: string) {
  if (category === 'NFT' && subCategory === 'Image') {
    return MATERIAL_IMAGE;
  } else if (category === 'NFT' && subCategory === 'Video') {
    return MATERIAL_VIDEO;
  } else if (category === 'NFT' && subCategory === 'Audio') {
    return MATERIAL_AUDIO;
  } else {
    return [];
  }
}

export function materialDisabled2(category: string, subCategory: string) {
  if (category === 'NFT' && subCategory === 'Image') {
    return false;
  } else {
    return true;
  }
}

import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';

// Default State for the artwork reducer
export const getDefaultArtworkState = () => {
  return {
    basic: {
      artistId: '',
      artistName: '',
      artFile: null,
      name: '',
      price: '',
      registeredDate: '',
      category: '',
      subCategory: '',
      material: '',
      size: {
        length: '',
        width: '',
        height: '',
        dimension: ''
      },
      holdings: '',
      collectors: '',
      source: '',
      description: ''
    },
    investment: {
      titleHolders: '',
      ownershipSales: '',
      remainingPercentageShares: '',
      residualOrTotalOwnership: '',
      qtyOfOurHoldings: '',
      publicOfferingPrice: ''
    },
    sale: {
      salesStartDate: '',
      salesEndDate: '',
      firstSalesStartDate: '',
      firstSalesQty: '',
      secondSalesStartDate: '',
      secondSalesQty: '',
      thirdSalesStartDate: '',
      thirdSalesQty: ''
    },
    stat: {
      similarWorkAvgAnnualGrowth: '',
      statisticsSimilarArtwork: '',
      highTradingVolumeAndTradingPrice: '',
      estimatedValue: '',
      avgAnnualValueGrowthRateOfSimilarArtwork: '',
      avgAnnualAuctionTransactionInLast3Years: ''
    },
    artId: '',
    step: 1,
    completedStep: 0,
    basicSubmit: false,
    investmentSubmit: false,
    saleSubmit: false,
    statSubmit: false
  };
};

export const artworkSlice = createSlice({
  name: 'artwork',
  initialState: getDefaultArtworkState(),
  reducers: {
    // Actions
    saveStep: (state: Draft<any>, action: PayloadAction<any>) => {
      if (action.payload === 1) {
        state.step = 1;
        state.completedStep = 0;
      } else if (action.payload === 2) {
        state.step = 2;
        state.completedStep = 1;
      } else if (action.payload === 3) {
        state.step = 3;
        state.completedStep = 2;
      } else if (action.payload === 4) {
        state.step = 4;
        state.completedStep = 3;
      }
      // Reset steps something is wrong!
      else {
        state.step = 1;
        state.completedStep = 0;
      }
    },

    goToStep: (state: Draft<any>, action: PayloadAction<any>) => {
      state.step = action.payload;
    },

    saveArtId: (state: Draft<any>, action: PayloadAction<any>) => {
      state.artId = action.payload;
    },

    // Basic Details
    saveBasicDetail: (state: Draft<any>, action: PayloadAction<any>) => {
      // Save all basic data
      state.basic = action.payload.basic;

      // And update basicSubmit to true
      state.basicSubmit = true;
    },

    // Investment Details
    saveInvestmentDetail: (state: Draft<any>, action: PayloadAction<any>) => {
      // Save all investment data
      state.investment = action.payload.investment;

      // And update investment submit to true
      state.investmentSubmit = true;
    },

    // Sales Details
    saveSaleDetail: (state: Draft<any>, action: PayloadAction<any>) => {
      // Save all sale data
      state.sale = action.payload.sale;

      // And update sale submit to true
      state.saleSubmit = true;
    },

    // Stat Details
    saveStatDetail: (state: Draft<any>, action: PayloadAction<any>) => {
      // Save all stat data
      state.stat = action.payload.stat;

      // And update stat submit to true
      state.statSubmit = true;
    },

    // Reset to the initialState
    resetArtworkForm: () => getDefaultArtworkState()
  }
});

// Reducers and actions
export const {
  saveStep,
  goToStep,
  saveArtId,
  saveBasicDetail,
  saveInvestmentDetail,
  saveSaleDetail,
  saveStatDetail,
  resetArtworkForm
} = artworkSlice.actions;

// Selectors
export const getStepValue = (state: { artwork: any }) => state.artwork.step;
export const getCompletedStepValue = (state: { artwork: any }) =>
  state.artwork.completedStep;

export const getStoredArtistId = (state: { artwork: any }) =>
  state.artwork.basic.artistId;

export const getStoredArtId = (state: { artwork: any }) => state.artwork.artId;

// BasicDetails
export const getArtUrl = (state: { artwork: any }) =>
  state.artwork.basic.artFile;
export const getBasicDetails = (state: { artwork: any }) => state.artwork.basic;
export const getBasicSubmit = (state: { artwork: any }) =>
  state.artwork.basicSubmit;

// InvestmentDetails
export const getInvestmentDetails = (state: { artwork: any }) =>
  state.artwork.investment;

export const getInvestmentSubmit = (state: { artwork: any }) =>
  state.artwork.investmentSubmit;

// SaleDetails
export const getSaleDetails = (state: { artwork: any }) => state.artwork.sale;

export const getSaleSubmit = (state: { artwork: any }) =>
  state.artwork.saleSubmit;

// StatDetails
export const getStatDetails = (state: { artwork: any }) => state.artwork.stat;

export default artworkSlice.reducer;

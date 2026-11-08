import { XRayType } from '../report/enums/x-ray-type.enum';
import { UserRole } from '../user/enums/user-role.enum';

/**
 * Default pricing configuration for different x-ray types and user roles
 * This centralized configuration allows for easy updates to pricing across the application
 * Includes both regular and review prices
 */
export const DEFAULT_PRICES = {
  [XRayType.XRAY]: {
    [UserRole.CENTER]: {
      regular: 50,
      review: 25
    },
    [UserRole.RADIOLOGIST]: {
      regular: 100,
      review: 50
    }
  },
  [XRayType.CT_SCAN]: {
    [UserRole.CENTER]: {
      regular: 75,
      review: 37.5
    },
    [UserRole.RADIOLOGIST]: {
      regular: 150,
      review: 75
    }
  },
  [XRayType.MRI]: {
    [UserRole.CENTER]: {
      regular: 100,
      review: 50
    },
    [UserRole.RADIOLOGIST]: {
      regular: 200,
      review: 100
    }
  }
};

/**
 * Get the default price for a specific x-ray type and user role
 * @param xRayType - Type of X-ray
 * @param userRole - User role (CENTER or RADIOLOGIST)
 * @param isReview - Whether to get the review price (true) or regular price (false)
 * @param fallbackXRayType - Fallback X-ray type if the specified one doesn't have pricing
 * @returns The default price for the specified x-ray type and user role
 */
export const getDefaultPrice = (
  xRayType: XRayType,
  userRole: UserRole,
  isReview: boolean = false,
  fallbackXRayType: XRayType = XRayType.XRAY
): number => {
  const priceType = isReview ? 'review' : 'regular';

  // Try to get the price for the specified x-ray type and user role
  const price = DEFAULT_PRICES[xRayType]?.[userRole]?.[priceType];
  
  // If price exists, return it
  if (price !== undefined) {
    return price;
  }
  
  // Otherwise, return the fallback price
  return DEFAULT_PRICES[fallbackXRayType][userRole][priceType];
};

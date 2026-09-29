export interface Destination {
  id: string;
  category: string;
  place: string;
  duration: string;
  title: string;
  imageUrl: string;
  imageAlt: string;
  price: number;
  isBundle: boolean;
  activityTags: string[];
  priceBreakdown: {
    priceBeforeTax: number;
    tax: number;
    extra: number;
    finalPrice: number;
  };
}

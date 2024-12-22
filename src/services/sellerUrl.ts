const baseUrl = process.env.NEXT_PUBLIC_BASE_URL_SELLER;
console.log("base url at service ", baseUrl);

export const productUrl = {
    getProductDetails : baseUrl+"api/product/getProductDetails" ,
    getProduct : baseUrl+"api/product",
    getSeachedProduct : baseUrl + 'api/product/getSearchedProduct',
    getProductsById: baseUrl + 'api/product/getProductsById'
}

export const categoryUrl = {
    getCategoryProducts : baseUrl + "api/category/getCategoryProducts",
    getFilteredProducts : baseUrl + "api/category/getFilteredProduct"
}

export const orderdUrl = {
    createOrderinseller : baseUrl + "api/order/createOrder",
    cancelOrder: baseUrl + "api/order/deleteOrder"
}

export const ratingReviewsUrl = {
    getRatingAndReview : baseUrl + "api/getRating&reviews",
    createRating: baseUrl + "api/getRating&reviews/createRating",
    findRatings: baseUrl + "api/getRating&reviews/findRatingByUser"
}
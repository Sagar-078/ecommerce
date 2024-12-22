// import { createSlice } from "@reduxjs/toolkit";
// const initialState ={
//     stapeOfPayment: 1,
//     buyingProduct: []
// }

// export const paymentSlice = createSlice({
//     name: 'payment',
//     initialState,
//     reducers: {
//         setStepOfPayment: (state, action) => {
//             state.stapeOfPayment = action.payload
//         },
//         setBuyingProduct: (state, action) => {
//             state.buyingProduct = action.payload
//         },
//         removeproduct:(state:any,action)=>{
//             const newproducts=state.buyingProduct.filter((item:any)=>item._id!==action.payload)
//             state.products=newproducts
//         }
//     }
// })

// export const { setBuyingProduct, setStepOfPayment, removeproduct } = paymentSlice.actions;
// export default paymentSlice.reducer;


// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// // Define the Product interface here at the top of the file
// interface Product {
//     _id: string;
//     assuredProduct: boolean;
//     attributes: Record<string, string>;
//     averageRating: number;
//     deliverycharge: number;
//     description: string;
//     discount: number;
//     highlights: string[];
//     images: string[];
//     launchDate: string;
//     limitedAddition: boolean;
//     numberOfProducts: number;
//     numberOfPurchases: number;
//     numberOfRatings: number;
//     originalPrice: number;
//     productName: string;
//     ratings: any[]; // Adjust this type as needed
//     sellPrice: number;
//     seller: {
//         _id: string;
//         firstName: string;
//         lastName: string;
//         email: string;
//         // Add other seller fields if needed
//     };
//     typeOfCategory: string;
//     quantity: number;
// }

// // Define the shape of your slice's state
// interface PaymentState {
//     stapeOfPayment: number;
//     buyingProduct: Product[];
// }

// // Initialize the state with the PaymentState type
// const initialState: PaymentState = {
//     stapeOfPayment: 1,
//     buyingProduct: []
// };

// // Create the slice
// export const paymentSlice = createSlice({
//     name: 'payment',
//     initialState,
//     reducers: {
//         setStepOfPayment: (state, action: PayloadAction<number>) => {
//             state.stapeOfPayment = action.payload;
//         },
//         setBuyingProduct: (state, action: PayloadAction<Product[]>) => {
//             state.buyingProduct = action.payload;
//         },
//         addProduct: (state, action: PayloadAction<Product>) => {
//             const existingProduct = state.buyingProduct.find((product) => product._id === action.payload._id);

//             if (existingProduct) {
//                 existingProduct.quantity += 1;
//             } else {
//                 const newProduct = { ...action.payload, quantity: 1 };
//                 state.buyingProduct.push(newProduct);
//             }
//         },
//         increaseQuantityProduct: (state, action) => {
//             const item = state.buyingProduct.find((item:any) => item._id === action.payload);
//             if (item) {
//                 item.quantity += 1;
//                 localStorage.setItem('cart', JSON.stringify(state.buyingProduct));
//             }
//         },
//         decreaseQuantityProduct: (state, action) => {
//             const item = state.buyingProduct.find((item:any) => item._id === action.payload);
//             if (item && item.quantity > 1) {
//                 item.quantity -= 1;
//                 localStorage.setItem('cart', JSON.stringify(state.buyingProduct));
//             } else if (item && item.quantity === 1) {
//                 state.buyingProduct = state.buyingProduct.filter((cartItem:any) => cartItem._id !== item._id);
//                 localStorage.setItem('cart', JSON.stringify(state.buyingProduct));
//             }
//         },
//         removeProduct: (state, action: PayloadAction<string>) => {
//             state.buyingProduct = state.buyingProduct.filter((product) => product._id !== action.payload);
//         }
//     }
// });

// // Export actions and reducer
// export const { setStepOfPayment, setBuyingProduct, addProduct, removeProduct, increaseQuantityProduct, decreaseQuantityProduct } = paymentSlice.actions;
// export default paymentSlice.reducer;




import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the Product interface
interface Product {
    _id: string;
    assuredProduct: boolean;
    attributes: Record<string, string>;
    averageRating: number;
    deliverycharge: number;
    description: string;
    discount: number;
    highlights: string[];
    images: string[];
    launchDate: string;
    limitedAddition: boolean;
    numberOfProducts: number;
    numberOfPurchases: number;
    numberOfRatings: number;
    originalPrice: number;
    productName: string;
    ratings: any[]; // Adjust this type as needed
    sellPrice: number;
    seller: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        // Add other seller fields if needed
    };
    typeOfCategory: string;
    quantity: number;
}

// Define the shape of your slice's state
interface PaymentState {
    stapeOfPayment: number;
    buyingProduct: Product[];
}

// Initialize the state with the PaymentState type
const initialState: PaymentState = {
    stapeOfPayment: 1,
    buyingProduct: []
};

// Create the slice
export const paymentSlice = createSlice({
    name: 'payment',
    initialState,
    reducers: {
        setStepOfPayment: (state, action: PayloadAction<number>) => {
            state.stapeOfPayment = action.payload;
        },
        
        setBuyingProduct: (state, action: PayloadAction<Product[]>) => {
            // Initialize quantity for all products in the array if missing
            state.buyingProduct = action.payload.map(product => ({
                ...product,
                quantity: product.quantity ?? 1
            }));
            // localStorage.setItem('cart', JSON.stringify(state.buyingProduct));
        },
        
        addProduct: (state, action: PayloadAction<Product>) => {
            const existingProduct = state.buyingProduct.find((product) => product._id === action.payload._id);
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                const newProduct = { ...action.payload, quantity: 1 };
                state.buyingProduct.push(newProduct);
            }
            localStorage.setItem('cart', JSON.stringify(state.buyingProduct));
        },
        
        increaseQuantityProduct: (state, action: PayloadAction<string>) => {
            const item = state.buyingProduct.find((item) => item._id === action.payload);
            if (item && typeof item.quantity === 'number') {
                item.quantity += 1;
                localStorage.setItem('cart', JSON.stringify(state.buyingProduct));
            }
        },
        
        decreaseQuantityProduct: (state, action: PayloadAction<string>) => {
            const item = state.buyingProduct.find((item) => item._id === action.payload);
            if (item && typeof item.quantity === 'number') {
                if (item.quantity > 1) {
                    item.quantity -= 1;
                } else {
                    // Remove item if quantity reaches 1 and is decreased further
                    state.buyingProduct = state.buyingProduct.filter(
                        (cartItem) => cartItem._id !== item._id
                    );
                }
                localStorage.setItem('cart', JSON.stringify(state.buyingProduct));
            }
        },
        
        removeProduct: (state, action: PayloadAction<string>) => {
            state.buyingProduct = state.buyingProduct.filter((product) => product._id !== action.payload);
            localStorage.setItem('cart', JSON.stringify(state.buyingProduct));
        }
    }
});

// Export actions and reducer
export const {
    setStepOfPayment,
    setBuyingProduct,
    addProduct,
    removeProduct,
    increaseQuantityProduct,
    decreaseQuantityProduct
} = paymentSlice.actions;

export default paymentSlice.reducer;
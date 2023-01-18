import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";
import axios from "axios";

export const getProducts = createAsyncThunk(
  "products/getProducts",
  async () => {
    const response = await axios.get("http://localhost:5000/products");
    return response.data;
  }
);

export const saveProduct = createAsyncThunk(
  "products/saveProduct",
  async ({ title, price }) => {
    const response = await axios.post("http://localhost:5000/products", {
      title,
      price,
    });
    return response.data;
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, title, price }) => {
    const response = await axios.patch(`http://localhost:5000/products/${id}`, {
      title,
      price,
    });
    return response.data;
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id) => {
    await axios.delete(`http://localhost:5000/products/${id}`);
    return id;
  }
);

const productEntitiy = createEntityAdapter({
  selectId: (product) => product.id,
});

const productSlice = createSlice({
  name: "product",
  initialState: productEntitiy.getInitialState(),
  extraReducers: {
    [getProducts.fulfilled]: (state, action) => {
      productEntitiy.setAll(state, action.payload);
    },
    [saveProduct.fulfilled]: (state, action) => {
      productEntitiy.addOne(state, action.payload);
    },
    [updateProduct.fulfilled]: (state, action) => {
      productEntitiy.updateOne(state, {
        id: action.payload.id,
        updates: action.payload,
      });
    },
    [deleteProduct.fulfilled]: (state, action) => {
      productEntitiy.removeOne(state, action.payload);
    },
  },
});

export const productSelectors = productEntitiy.getSelectors(
  (state) => state.product
);
export default productSlice.reducer;

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"

export interface MongoDbState {
  value: object[]
  status: "idle" | "loading" | "failed"
}

const initialState: MongoDbState = {
  value: [],
  status: "idle",
}

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const requestMongoDdAsync = createAsyncThunk(
  "mongodb/request",
  async () => {
    const response = await fetch("http://localhost:3000/pesto-content-type", {
      mode: "no-cors",
    })
    if (!response.ok) {
      console.log("Network response was not OK")
      throw new Error("Network response was not OK")
    }
    console.log("reponse: ", response)
    return response //.formData()
    /*
    const json = await response.json()
    console.log("ret: ", json)
    return JSON.stringify(json)
    */
  },
)

export const mongodbSlice = createSlice({
  name: "mongodb",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {},
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(requestMongoDdAsync.pending, (state) => {
        state.status = "loading"
        console.log("loading")
      })
      .addCase(requestMongoDdAsync.fulfilled, (state, action) => {
        state.status = "idle"
        //state.value = JSON.stringify(action.payload)
        console.log("fulfilled: ", action.payload)
      })
      .addCase(requestMongoDdAsync.rejected, (state) => {
        state.status = "failed"
        console.log("failed")
      })
  },
})

// export const { increment, decrement, incrementByAmount } = mongodbSlice.actions

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectInput = (state: RootState) => state.mongodb.value

export default mongodbSlice.reducer

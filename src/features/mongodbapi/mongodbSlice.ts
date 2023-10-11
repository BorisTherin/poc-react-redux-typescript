import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"
import axios from "axios"
/* 
  FORKED FROM ../counter/conterSlice.ts IN ORDER TO MAKE MY 1ST PESTO-API REQUEST
*/
const FRONT_DEV_PORT = "5173"
const FRONT_DEV_HOST = "localhost"
const API_PORT = "3000"
const API_HOST = "localhost"
const API_URL = `http://${API_HOST}:${API_PORT}/pesto-content-type`
/* schema mongodb
[
  {
    "_id":"65201112f92b3d9b3b7174ab",
    "title":"robe",
    "description":"un autre type de contenu pour mon blog",
    "identifier":"robe",
    "createdAt":"2023-10-06T13:52:18.627Z",
    "__v":0
  }
]
*/

export interface MongoDbShema {
  _id: string
  title: string
  description: string
  createdAt: string
  __v: number
}

export interface MongoDbState {
  value: MongoDbShema
  status: "idle" | "loading" | "failed"
}

const initialState: MongoDbState = {
  value: {
    _id: "",
    title: "",
    description: "",
    createdAt: "",
    __v: 0,
  },
  status: "idle",
}
type PestoContentTypeData = {
  _id: number
  title: string
  // project_id: string
  // frontmatter_schema: string
  // frontmatter_format: string
  description: string
  identifier: string
  createdAt: string
}

type GetPestoContentTypesResponse = {
  data: PestoContentTypeData[]
}

async function getPestoContentTypes(): Promise<
  GetPestoContentTypesResponse | String
> {
  try {
    // 👇️ const data: GetPestoContentTypesResponse
    const { data, status } = await axios.get<GetPestoContentTypesResponse>(
      // "https://reqres.in/api/users",
      "http://localhost:3000/pesto-content-type",
      {
        headers: {
          Accept: "application/json",
        },
      },
    )
    console.log("JSON payload data is [GetPestoContentTypesResponse]: ")
    console.log(JSON.stringify(data, null, 4))

    // 👇️ "response status is: 200"
    console.log("response status is: ", status)

    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("error message: ", error.message)
      return error.message
    } else {
      console.log("unexpected error: ", error)
      return "An unexpected error occurred"
    }
  }
}

export async function fetchPestoApi() {
  const options: object = {
    method: "GET",
    mode: "no-cors",
  }
  const results = await getPestoContentTypes()
  // const response = await fetch(API_URL, options)
  return JSON.stringify(results, null, 4)
}
// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
export const requestMongoDdAsync = createAsyncThunk(
  "bernard/minet",
  async () => {
    const options: object = {
      method: "GET",
      mode: "no-cors",
    }
    // const response = await fetch(API_URL, options)
    const response = await fetchPestoApi()

    // console.log(`response :`, response)
    /*
    if (response && !response.ok) {
      console.log("response.ok = false ")
    }
    */
    //const json: any = await response.json()
    //console.log("json(): ", json)
    console.log(" >>>>>>>>>>> [requestMongoDdAsync] reponse: ", response)
    // return JSON.stringify(response)
    return response
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
        console.log(" PESTO REDUCER requestMongoDdAsync loading")
      })
      .addCase(requestMongoDdAsync.fulfilled, (state, action) => {
        state.status = "idle"
        console.log(API_URL + " fetch fulfilled, payload: ", action.payload)
        // state.value = JSON.parse(action.payload)
        // state.value = action.payload
      })
      .addCase(requestMongoDdAsync.rejected, (state) => {
        state.status = "failed"
        console.log("requestMongoDdAsync failed")
      })
  },
})

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectInput = (state: RootState) => state.mongodb.value

export default mongodbSlice.reducer

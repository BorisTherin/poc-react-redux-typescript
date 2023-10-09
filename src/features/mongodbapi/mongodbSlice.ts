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
const API_BASE_URL = `http://${API_HOST}:${API_PORT}`

type ApiHeader = {
  Accept: string
  "Content-Type": string
}
type ApiRequest = {
  url: string
  method: string
  data?: object
  headers?: ApiHeader
}
const API_LIST_ALL_ENTITY: ApiRequest = {
  url: `${API_BASE_URL}/pesto-project`,
  method: "GET",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
}
const API_CREATE_CONTENT_TYPE: ApiRequest = {
  url: `${API_BASE_URL}/pesto-project`,
  method: "POST",
  data: {
    name: "astroproject1",
    description:
      "un premier projet pesto sur une base de projet astro, mon site portfolio",
    git_ssh_uri: "git@github.com:3forges/poc-redux-thunk.git",
  },
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
}

//const API_GET_PROJECT_BY_NAME: ApiRequest = {}
//const API_GET_PROJECT_BY_URI: ApiRequest = {}
//const API_UPDATE_FROM_PROJECT_ID: ApiRequest = {}

/*
  req:
    url: 
      /pesto-project 
      /pesto-project/name 
      /pesto-project/uri 
      /pesto-content-type 
      /pesto-content-type/project 
      /pesto-content
    method: GET PUT DELETE POST
    header: 'Accept: application/json' 'Content-Type: application/json'
    data: {}
*/

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

export interface MongoDbState {
  value: PestoContentTypeData
  status: "idle" | "loading" | "failed"
}

const initialState: MongoDbState = {
  value: {
    _id: 0,
    title: "",
    description: "placeholder",
    identifier: "",
    createdAt: "",
  },
  status: "idle",
}

type postInputValueType = {
  inputValue: object
}

/*
{ "name" : "astroproject2", "description" : "mon site portfoli2o", "git_ssh_uri" : "git@github.com:3forges/poc-redux-thunk2.git" }
*/

async function getPestoContentTypes(
  req: ApiRequest,
): Promise<GetPestoContentTypesResponse | String> {
  try {
    console.log(req.method)
    // Apply REQUEST req
    // 👇️ const data: GetPestoContentTypesResponse
    const { data, status } = await axios<GetPestoContentTypesResponse>(req)
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

/*
export async function fetchPestoApi(req: ApiRequest) {
  const results = await getPestoContentTypes(req)
  return JSON.stringify(results, null, 4)
}
*/

export const requestMongoDdAsync = createAsyncThunk(
  "mongodb/request",
  async () => {
    //const response = await fetchPestoApi(API_LIST_ALL_ENTITY)
    const response = await getPestoContentTypes(API_LIST_ALL_ENTITY)
    console.log(" >>>>>>>>>>> [requestMongoDdAsync] reponse: ", response)
    return JSON.stringify(response, null, 4)
  },
)

export const createContentTypeAsync = createAsyncThunk(
  "mongodb/create",
  async (data: postInputValueType) => {
    API_CREATE_CONTENT_TYPE.data = data.inputValue
    console.log("data: ", API_CREATE_CONTENT_TYPE.data)
    const response = await getPestoContentTypes(API_CREATE_CONTENT_TYPE)
    console.log(" >>>>>>>>>>> [requestMongoDdAsync] reponse: ", response)
    return response
  },
)

export const mongodbSlice = createSlice({
  name: "mongodb",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    /* EMPTY */
  },
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
        console.log(
          " PESTO REDUCER " +
            API_LIST_ALL_ENTITY.url +
            " fetch fulfilled, payload: ",
          action.payload,
        )
        state.value = JSON.parse(action.payload)
      })
      .addCase(requestMongoDdAsync.rejected, (state) => {
        state.status = "failed"
        console.log(" PESTO REDUCER requestMongoDdAsync failed")
      })
      .addCase(createContentTypeAsync.fulfilled, (state, action) => {
        console.log(" PESTO REDUCER createContentTypeAsync succed")
      })
  },
})

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectInput = (state: RootState) => state.mongodb.value

export default mongodbSlice.reducer

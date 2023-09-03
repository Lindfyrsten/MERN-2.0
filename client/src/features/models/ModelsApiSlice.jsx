import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const modelsAdapter = createEntityAdapter({});
const initialState = modelsAdapter.getInitialState({});

export default function ModelsList() {
  return <h1>ModelsList</h1>;
}

export const modelsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getModels: builder.query({
      query: () => "/models",
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (responseData) => {
        const loadedModels = responseData.map((model) => {
          model.id = model._id;
          return model;
        });
        return modelsAdapter.setAll(initialState, loadedModels);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Model", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Model", id })),
          ];
        } else return [{ type: "Model", id: "LIST" }];
      },
    }),
    addNewModel: builder.mutation({
      query: (initialModelData) => ({
        url: "/models",
        method: "POST",
        body: {
          ...initialModelData,
        },
      }),
      invalidatesTags: [{ type: "Model", id: "LIST" }],
    }),
    updateModel: builder.mutation({
      query: (initialModelData) => ({
        url: "/models",
        method: "PATCH",
        body: {
          ...initialModelData,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Model", id: arg.id }],
    }),
    deleteModel: builder.mutation({
      query: ({ id }) => ({
        url: `/models`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Model", id: arg.id }],
    }),
  }),
});

export const {
  useGetModelsQuery,
  useAddNewModelMutation,
  useUpdateModelMutation,
  useDeleteModelMutation,
} = modelsApiSlice;

// returns the query result object
export const selectModelsResult = modelsApiSlice.endpoints.getModels.select();

// creates memoized selector
const selectModelsData = createSelector(
  selectModelsResult,
  (modelsResult) => modelsResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllModels,
  selectById: selectModelById,
  selectIds: selectModelIds,
  // Pass in a selector that returns the models slice of state
} = modelsAdapter.getSelectors(
  (state) => selectModelsData(state) ?? initialState
);

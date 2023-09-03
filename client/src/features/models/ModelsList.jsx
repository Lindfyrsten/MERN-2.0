import React from "react";

import { useGetModelsQuery } from "./ModelsApiSlice";
import Model from "./Model";

function ModelsList() {
  const {
    data: models,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetModelsQuery(undefined, {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });
  let content;

  if (isLoading) content = <div>Loading...</div>;

  if (isError) {
    content = <p className="errmsg">{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids } = models;

    const tableContent = ids?.length
      ? ids.map((modelId) => <Model key={modelId} modelId={modelId} />)
      : null;

    content = (
      <table className="table table--models">
        <thead className="table__thead">
          <tr>
            <th scope="col" className="table__th model__modelname">
              Model name
            </th>
            <th scope="col" className="table__th model__roles">
              Price
            </th>
            <th scope="col" className="table__th model__roles">
              Active Bookings
            </th>
            <th scope="col" className="table__th model__edit">
              Edit
            </th>
          </tr>
        </thead>
        <tbody>{tableContent}</tbody>
      </table>
    );
  }

  return content;
}

export default ModelsList;

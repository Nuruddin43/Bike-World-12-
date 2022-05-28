import React from "react"

import { useQuery } from "react-query"
import { useParams } from "react-router-dom"
import Loading from "../Shared/Loading"

const Payment = () => {
  const { id } = useParams()
  const url = `http://localhost:5000/order/${id}`
  const { data: order, isLoading } = useQuery(["booking", id], () =>
    fetch(url, {
      method: "GET",
    }).then((res) => res.json())
  )
  if (isLoading) {
    return <Loading></Loading>
  }
  return (
    <div>
      <div class="card w-50 max-w-md bg-base-100 shadow-xl my-12 ">
        <div class="card-body ">
          <p className="text-2xl text-success">Hello, {order.name}</p>
          <h2 class="text-3xl">Please Pay for {order.product}</h2>
          <p>
            Delivered pick point at
            <span className="text-purple-500 pl-2">{order.address}</span>
          </p>
          <p>Please Pay ${order.price}</p>
        </div>
      </div>
      <div class="card flex-shrink-0 w-50 max-w-md shadow-2xl bg-base-100">
        <div class="card-body"></div>
      </div>
    </div>
  )
}

export default Payment
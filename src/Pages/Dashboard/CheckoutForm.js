// import { async } from "@firebase/util"
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js"
import React, { useState, useEffect } from "react"

const CheckoutForm = ({ order }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [cardError, setCardError] = useState("")
  const [success, setSuccess] = useState("")
  const [transactionId, setTransactionId] = useState("")
  const [clientSecret, setClientSecret] = useState("")
  const { price, email, name } = order

  useEffect(() => {
    fetch("http://localhost:5000/create-payment-intent", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ price }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.clientSecret) {
          setClientSecret(data.clientSecret)
        }
      })
  }, [price])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!stripe || !elements) {
      return
    }
    const card = elements.getElement(CardElement)

    if (card === null) {
      return
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    })

    setCardError(error || "")
    setSuccess("")
    // if (error) {
    //   console.log(error.message)
    // } else {
    //   setCardError("")
    // }
    // confirm card payment
    const { paymentIntent, error: intentError } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            name: name,
            email: email,
          },
        },
      })

    if (intentError) {
      setCardError(intentError)
    } else {
      setCardError("")
      setTransactionId(paymentIntent.id)
      console.log(paymentIntent)
      setSuccess("Congrats! Your Payment is Completed")
    }
  }
  return (
    <>
      <form onSubmit={handleSubmit}>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
        <button
          className="btn btn-sm btn-success"
          type="submit"
          disabled={!stripe || !clientSecret}
        >
          Pay
        </button>
      </form>
      {cardError && <p className="text-red-500">{cardError}</p>}
      {success && (
        <div className="text-green-500">
          <p>{success}</p>
          <p>
            Your transactionId:{" "}
            <span className="text-orange-500 font-bold">{transactionId} </span>
          </p>
        </div>
      )}
    </>
  )
}

export default CheckoutForm
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import * as config from '../config/config'
interface OrderHistoryInterface {
    order_id: string;
    products: productInterface[],
    customer_info: {
        member_id: string,
        firstname: string,
        lastname: string,
        phone: string,
        address: string,
    }
    date_buys: string,
    date_complete: string | null,
    total_amount: number,
    transaction_comfirm: string,
    status: string
}
interface productInterface {
    product_id: string;
    product_name: string;
    product_image: string;
    amount: number;
    price: number;
}

const Orderhistory = (prop: { jwt_token: string }) => {
    const [orderHistory, setOrderHistory] = useState<OrderHistoryInterface[]>([])

    useEffect(() => {
        let apiOrderHistory = config.getApiEndpoint("farmerorder", "GET")
        axios.get(apiOrderHistory, {
            headers: {
                "Authorization": `Bearer ${prop.jwt_token}`
            }
        }).then((res) => {
            console.log(res.data);

            setOrderHistory(res.data)
        }
        ).catch((err) => {
            console.log(err)
        })
    }, [])
    return (
        <div>
            {orderHistory.map((order, index) => {
                return (
                    <div key={index}>
                        <h3>Order ID: {order.order_id}</h3>
                        <h3>Customer: {order.customer_info.firstname} {order.customer_info.lastname}</h3>
                        <h3>Phone: {order.customer_info.phone}</h3>
                        <h3>Address: {order.customer_info.address}</h3>
                        <h3>Date: {order.date_buys}</h3>
                        <h3>Total: {order.total_amount}</h3>
                        <h3>Status: {order.status}</h3>
                        <h3>Transaction: {order.transaction_comfirm}</h3>
                        <h3>Complete: {order.date_complete ? order.date_complete : ''}</h3>
                        <h3>Product</h3>
                        {/* {order.products.map((product, index) => {
                            return (
                                <div key={index}>
                                    <img src={`${config.getApiEndpoint(
                                        `getimage/${product.product_image.split("/").pop()}`,
                                        "get"
                                    )}`} />
                                    <h4>{product.product_name}</h4>
                                    <h4>Amount: {product.amount}</h4>
                                    <h4>Price: {product.price}</h4>
                                </div>
                            )
                        })} */}
                    </div>
                )
            })}
        </div>
    )
}

export default Orderhistory

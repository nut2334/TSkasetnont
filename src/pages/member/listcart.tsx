import React, { useEffect } from 'react'
import { Cart } from "../../App";
import { Button, Divider, Typography } from '@mui/material';
import axios from 'axios';
import * as config from "../../config/config";

const ListCart = (
    prop:{
        cartList: Cart[];
        jwt_token: string;
    }
) => {
    const apiCheckOut = config.getApiEndpoint("checkout", "POST");

  return (
    <div>{
        prop.cartList.map((cart, index) => {
            return (
                <div key={index}>
                   <Typography>{cart.product_name}</Typography>
                    <Typography>{cart.price}</Typography>
                    <Typography>{cart.amount}</Typography>
                    <Divider />
                </div>
            )
        }  
        )
        }
        <Button
        onClick={() => {
            console.log(prop.cartList);
            axios.post(apiCheckOut, prop.cartList.map((cart) => {
                return {product_id: cart.product_id, amount: cart.amount}
            }), {
                headers: {
                    Authorization: `Bearer ${prop.jwt_token}`
                }
            }
                );
        }
        }
        
        >ชำระเงิน</Button>
        </div>
  )
}

export default ListCart
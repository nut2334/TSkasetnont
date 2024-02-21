import React from 'react'
import { useParams } from 'react-router-dom'

const Reserve = () => {
const { productid } = useParams<{ productid: string }>();
  return (
    <div>reserve</div>
  )
}

export default Reserve
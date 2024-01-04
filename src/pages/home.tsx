import React from 'react'

const Home = (prop: { jwt_token: string }) => {
    return (
        <div>
            {prop.jwt_token}
        </div>
    )
}

export default Home

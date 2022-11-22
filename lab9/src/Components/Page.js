import React from 'react'

function Page({ currentPage, currentPokemons }) {
    return (
        <div>
            <h2>
                Page number {currentPage}
            </h2>
            {
                currentPokemons.map((item) => {
                    return <div>{item.name.english} id is {item.id}</div>
                })
            }
        </div>
    )
}

export default Page

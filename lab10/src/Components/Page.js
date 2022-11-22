import React from 'react'
import Pokemon from './Pokemon'

function Page({ currentPage, currentPokemons }) {
    return (
        <div>
            <h2>
                Page number {currentPage}
            </h2>
            {
                currentPokemons.map((item) => {
                    return <div>
                        <div>
                            {item.name.english} id is {item.id}
                        </div>
                        <div>
                            <Pokemon pokemon={item} />
                        </div>
                    </div>
                })
            }
        </div >
    )
}

export default Page

import React from 'react'

function Pagination({ numPages, currentPage, setCurrentPage }) {
    const pageNum = [];
    for (let i = 1; i <= numPages; i++) {
        pageNum.push(i);
    }
    const previousPage = () => {
        if (currentPage !== 1) {
            setCurrentPage(currentPage - 1);
        }
    }
    const nextPage = () => {
        if (currentPage !== numPages) {
            setCurrentPage(currentPage + 1);
        }
    }

    return (
        <div>
            <button onClick={previousPage}>Prev</button>
            {
                pageNum.map((num) => {
                    return <>
                        <button onClick={() => { setCurrentPage(num) }}>{num}</button>
                    </>
                })
            }
            <button onClick={nextPage}>Prev</button>
        </div>
    )
}

export default Pagination
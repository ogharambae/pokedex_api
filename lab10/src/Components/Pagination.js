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
            {(currentPage !== 1) && <button onClick={previousPage}>Prev</button>}
            {
                pageNum.map((num) => {
                    if (num < currentPage + 6 && num > currentPage - 5) {
                        return <>
                            <button onClick={() => { setCurrentPage(num) }} className={(num === currentPage) ? "currentPageBtn" : ""} >{num}</button>
                        </>
                    }
                    return <></>
                })
            }
            {(currentPage !== numPages) && <button onClick={nextPage}>Next</button>}
        </div>
    )
}

export default Pagination

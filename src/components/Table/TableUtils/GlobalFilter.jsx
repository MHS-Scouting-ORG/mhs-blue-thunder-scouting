import React from 'react';
import tableStyles from "../Table.module.css";

const GlobalFilter = ({filter, set}) => { //search bar
 return (
    <div className={tableStyles.FilterDiv}>
     <span>
         <input placeholder='Search' className={tableStyles.Filter} value={filter || ''} onChange={e => set(e.target.value)}/>
     </span>
    </div>
 );
}

export default GlobalFilter;
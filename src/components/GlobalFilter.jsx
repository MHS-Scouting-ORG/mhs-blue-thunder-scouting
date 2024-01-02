import React from 'react';

const GlobalFilter = ({filter, set}) => { //search bar
 return (
    <div style= {{textAlign: 'left', fontSize: '20px'}}>
     <span>
         Search: {' '}
         <input value={filter || ''} onChange={e => set(e.target.value)}/>
     </span>
    </div>
 );
}

export default GlobalFilter;
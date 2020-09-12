import React, { useState } from "react";

function Menu({ instruments, selectInstrument }) {
    const [open, toggleOpen] = useState(false)

    return (
        <div className="Menu">
            <button onClick={() => toggleOpen(!open)}>Menu</button>
            {open ? Object.keys(instruments).map((ele) => (
                <Option key={ele} name={ele} selectInstrument={selectInstrument}/>
            )) : <></>}
        </div>
    );
}

function Option(data) {
  return (
        <button onClick={() => data.selectInstrument(data.name)}>{data.name}</button>
    );
}
export default Menu;

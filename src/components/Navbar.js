import React from 'react';
import { Menu, MenuItem} from "semantic-ui-react";

function Navbar(){
  return(
    <header>
      <Menu secondary>
      <MenuItem>
        <div className="inline">
        <img src="./images/logo_carved_white.webp" alt="carved" height="30" />
        </div>
      </MenuItem>
      </Menu>  
    </header>
  );
}

export default Navbar;

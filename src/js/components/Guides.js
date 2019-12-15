import React, { Component } from "react";
import * as d3 from 'd3';

import Guide from './Guide';
class Guides extends Component {
    constructor(props) {
        super(props);
        
    }
    componentDidMount(){
   
    }
    
   
    render() {
        const listItems = this.props.guides.map((d, i) => {
                return <Guide 
                    key={i} 
                    stroke={d} 
            />
            }
      
            
        );
        
        return (
            <g>
                {listItems}
            </g>
        );
        
    }
}
export default Guides;
import React, { Component } from "react";
import * as d3 from 'd3';

import Line from './Line';
class Lines extends Component {
    constructor(props) {
        super(props);
        
    }
    componentDidMount(){
   
    }
    
   
    render() {
        // console.log('YOO')
        const listItems = this.props.lines.map((d, i) => {
                return <Line 
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
export default Lines;
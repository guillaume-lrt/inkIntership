import React, { Component } from "react";
import * as d3 from 'd3';
import shallowCompare from 'react-addons-shallow-compare';

class Guide extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount(){
        // console.log(this.props.stroke)

        var line = d3.line()
        var that = this;
        // d3.select('#'+that.props.stroke.id)
        //     .attr("x1", that.props.stroke['data'][0][0])
        //     .attr('x2', that.props.stroke['data'][1][0])
        //     .attr('y1', that.props.stroke['data'][0][1])
        //     .attr('y2', that.props.stroke['data'][1][1])
        //     .attr('stroke', 'black')
        //     .attr('stroke-width', '2')

        d3.select('#'+that.props.stroke.id)
            .attr("d", line(that.props.stroke['data']))
            .attr('fill', 'none')
            .attr('stroke', 'red')
            .attr('stroke-width', '2')
    }
    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

   
    render() {
        return (
             <path id={this.props.stroke.id}>
            
             </path>
        );
        
    }
}
export default Guide;
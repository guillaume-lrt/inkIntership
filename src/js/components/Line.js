import React, { Component } from "react";
import * as d3 from 'd3';
import shallowCompare from 'react-addons-shallow-compare';

class Line extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount(){
        // console.log(this.props.stroke)

        var line = d3.line()
        var that = this;
        d3.select('#'+that.props.stroke.id)
            .attr("d", line(that.props.stroke['data']))
            .attr('fill', 'none')
            .attr('stroke', 'black')
            .attr('stroke-width', '2')

 
    }
    shouldComponentUpdate(nextProps, nextState) {
        // console.log(this.props.stroke, nextProps.stroke)
        return shallowCompare(this, nextProps, nextState);
    }
    componentDidUpdate(){
        // console.log('HELLO')
        var line = d3.line()
        var that = this;
        d3.select('#'+that.props.stroke.id)
            .attr("d", line(that.props.stroke['data']))
            .attr('fill', 'none')
            .attr('stroke', 'black')
            .attr('stroke-width', '2')
    }
    

   
    render() {
        return (
            <path id={this.props.stroke.id}>
            
            </path>
        );
        
    }
}
export default Line;
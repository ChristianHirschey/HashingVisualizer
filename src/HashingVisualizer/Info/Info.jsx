import React, {Component} from 'react';
import './Info.css'

export default class InfoPanel extends Component {

    constructor(props) {
      super(props);
      this.state = {
        info: props.info,
        isEmpty: props.isEmpty
      }
    }
  
    setNotEmpty() {
      this.setState({isEmpty: false});
    }
  
    render() {
        if(this.state.isEmpty){
            return <p>This panel will be used to display the logic behind hashing and its collision resolution techniques!</p>;
        }
        return (
            <div>
                {this.state.info}
            </div>
        );
    }

    componentDidUpdate(prevProps) {
        if (prevProps.info !== this.props.info || prevProps.isEmpty !== this.props.isEmpty) {
            this.setState({ info: this.props.info, isEmpty: this.props.isEmpty });
        }
    }
}

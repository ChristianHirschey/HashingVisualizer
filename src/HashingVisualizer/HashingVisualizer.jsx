import React from "react";
import './HashingVisualizer.css';
import InfoPanel from "./Info/Info";


export default class HashingVisualizer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            array: [],
            grid: [],
            collisionResolution: "linear",
            hash1: 10, // size of table
            hash2: 7 // largest prime smaller than table size
        };

        this.handleDropdownChange = this.handleDropdownChange.bind(this);
        this.handleHash1Change = this.handleHash1Change.bind(this);
        this.handleHash2Change = this.handleHash2Change.bind(this);
    }

    handleDropdownChange(e) {
        this.setState({collisionResolution: e.target.value});
    }

    handleHash1Change(e) {
        this.setState({hash1: e.target.value});
    }

    handleHash2Change(e) {
        this.setState({hash2: e.target.value});
    }

    componentDidMount() {
        this.resetArray();
        this.setState({isEmpty: true});
    }

    resetArray() {
        const array = [];
        const grid = getInitialGrid();
        const info = [];
        for (let i = 0; i < 10; i++) {
            array.push(randomIntFromInterval(0, 99)); // generates random ints from 0 to 99
        }
        this.setState({array, grid, info});
    }

    insertElement() {
        const {array} = this.state;
        if(array.length > 0) { // ensure there is still a value left in queue
            let element = array.shift(); // remove the first element from the array
            this.setState({array: array}); // update the state with the new array
            this.insert(element);
        }
        else alert("No more values left in queue!")
    }

    resolveCollision(value, index, grid) {
        let count = 1; // count starts at 1 for others
        if(this.state.collisionResolution === "double") {
            count = 0; // count starts at 0 for double hashing
        }

        let info = [];

        const startingVal = index;
        const hash1 = index % this.state.hash1; // default 10 for table size
        const hash2 = this.state.hash2 - (index % this.state.hash2); // default 7 for largest prime < table size
        while(count < 10) { // 10 for table size
            if(this.state.collisionResolution === "linear") { // LINEAR PROBING
                let previous = index;
                index = (index + 1); // increment index
                if(index >= 10) {
                    index = index % 10; // mod 10 to remove out of bounds values
                    info.push(<div><p>Collision {count}: Index + 1 was out of bounds, tried inserting at beginning index 0</p></div>);
                } else {
                    info.push(<div><p>Collision {count}: Tried inserting at index {previous} + 1 (index {index})</p></div>);
                }
                
                count++;
            } else if(this.state.collisionResolution === "quad") { // QUADRATIC PROBING
                index = (startingVal + (count ** 2)); // increment index by 1, then 4, then 9, etc.
                if(index >= 10) {
                    index = index % 10; // mod 10 to remove out of bounds values
                    info.push(<div><p>Collision {count}: Index {startingVal} + {count ** 2} was out of bounds, tried inserting at index {index}</p></div>);
                } else {
                    info.push(<div><p>Collision {count}: Tried inserting at index {startingVal} + {count ** 2} (index {index})</p></div>);
                }
                
                count++;
            } else if(this.state.collisionResolution === "double") { // DOUBLE HASHING
                let previous = index;
                index = (hash1 + (count * hash2));
                if(index >= 10) {
                    index = index % 10; // mod 10 to remove out of bounds values
                    info.push(<div><p>Collision {count+1}: Index {previous} + {hash2} was out of bounds, tried inserting at index {index}</p></div>);
                } else {
                    info.push(<div><p>Collision {count+1}: Tried inserting at index {previous} + {hash2} (index {index})</p></div>);
                }

                count++;
            }

            if(grid[index] === "") {
                grid[index] = value;
                this.setState({grid});

                info.push(<div><p> Inserted {value} at index {index}</p></div>);
                break;
            } else if(count === 10) {
                info.push(<div><p>Failed to insert; Value could not be accommodated in table</p></div>);
            }
        }
        this.setState({info: info, isEmpty: false})
    }

    setKey(key) {
        return key % this.state.hash1;
    }

    insert(value) {
        const {grid} = this.state;
        const index = this.setKey(value);
        if(grid[index] === "") {
            grid[index] = value;
            this.setState({grid});
            
            let info = (<div><p> Inserted {value} at index {index} with no collisions</p></div>);
            this.setState({info: info, isEmpty: false});
        }
        else this.resolveCollision(value, index, grid);
    }

    render() { 
        //  FIXME: Add descriptions/animations of hashing process
        const {array, grid} = this.state;

        return (
            <div className="array">
                <div className="array-container">
                    {array.map((value, idx) => (
                        <div className="array-bar" key={idx}>
                            {value}
                        </div>
                    ))}
                </div>  
                <div className="button-container">
                    <button className="button" onClick={() => this.resetArray()}>Reset Queue</button>
                    <button className="button" onClick={() => this.insertElement()}>Insert Element</button>
                </div>
                <div className="dropdown-container">
                    <select value={this.state.collisionResolution}
                    onChange={this.handleDropdownChange}>
                        <option className="dropdown-option" value="linear">Linear Probing</option>
                        <option className="dropdown-option" value="quad">Quadratic Probing</option>
                        <option className="dropdown-option" value="double">Double Hashing</option>
                    </select>
                </div>
                <div className="info-panel">
                    <InfoPanel info={this.state.info} isEmpty={this.state.isEmpty} />
                </div>
                <div className="grid-container">
                    {grid.map((value, idx) => (
                        <div className="grid-box" key={idx}>
                            {value}
                        </div>
                    ))}
                </div>
                <div className="hash">
                    <div className="hash-line">
                    <label className="text-label" htmlFor="hash1">Hash 1: Key % </label>
                    <input className="input" type="text" id="hash1" placeholder="10" 
                    value={this.state.hash1} onChange={this.handleHash1Change}></input>
                    </div>

                    {this.state.collisionResolution === "double" && (
                        <div className="hash-line">
                            <div className="hash2-output">
                                Hash 2: {this.state.hash2} - (key % {this.state.hash2})
                            </div>
                            
                            <br />

                            <input className="input" type="text" id="hash2" placeholder="7" 
                            value={this.state.hash2} onChange={this.handleHash2Change}></input>
                        </div>
                    )}
                </div>
            </div>
        )
    }
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const getInitialGrid = () => {
    const grid = [];
    for (let col = 0; col < 10; col++) {
      grid.push("");
    }
    return grid;
  };
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
            hash2: 7, // largest prime smaller than table size
            customValues: "" // custom values input
        };

        this.handleDropdownChange = this.handleDropdownChange.bind(this);
        this.handleHash1Change = this.handleHash1Change.bind(this);
        this.handleHash2Change = this.handleHash2Change.bind(this);
        this.handleCustomValuesChange = this.handleCustomValuesChange.bind(this);
        this.loadCustomValues = this.loadCustomValues.bind(this);
        this.updateTableSize = this.updateTableSize.bind(this);
    }

    handleDropdownChange(e) {
        this.setState({collisionResolution: e.target.value});
    }

    handleHash1Change(e) {
        const value = e.target.value;
        if (value === "" || (!isNaN(value) && parseInt(value) > 0)) {
            this.setState({hash1: value});
        }
    }

    handleCustomValuesChange(e) {
        this.setState({customValues: e.target.value});
    }

    updateTableSize() {
        const tableSize = parseInt(this.state.hash1) || 10;
        const grid = getInitialGrid(tableSize);
        const info = [];
        const isEmpty = true;
        this.setState({grid, info, isEmpty, hash1: tableSize});
    }

    loadCustomValues() {
        const {customValues, hash1} = this.state;
        if (!customValues.trim()) {
            alert("Please enter comma-separated values!");
            return;
        }
        
        const values = customValues.split(',').map(v => v.trim()).filter(v => v !== '');
        const array = [];
        
        for (let val of values) {
            const num = parseInt(val);
            if (!isNaN(num)) {
                array.push(num);
            }
        }
        
        if (array.length === 0) {
            alert("No valid numbers found!");
            return;
        }
        
        const tableSize = parseInt(hash1) || 10;
        const grid = getInitialGrid(tableSize);
        const info = [];
        const isEmpty = true;
        this.setState({array, grid, info, isEmpty, customValues: ""});
    }

    handleHash2Change(e) {
        this.setState({hash2: e.target.value});
    }

    componentDidMount() {
        this.resetArray();
        this.setState({isEmpty: true});
    }

    resetArray() {
        const tableSize = parseInt(this.state.hash1) || 10;
        const array = [];
        const grid = getInitialGrid(tableSize);
        const info = [];
        const isEmpty = true;
        for (let i = 0; i < tableSize; i++) {
            array.push(randomIntFromInterval(0, 99)); // generates random ints from 0 to 99
        }
        this.setState({array, grid, info, isEmpty});
    }

    insertElement() {
        if(this.state.array.length > 0) { // ensure there is still a value left in queue
            let element;
            this.setState((prevState) => {
                const newArray = [...prevState.array];
                element = newArray.shift();
                return {array: newArray};
            }, () => {
                // Use callback after setState completes
                this.insert(element);
            });
        }
        else alert("No more values left in queue!")
    }

    resolveCollision(value, index, grid) {
        const tableSize = parseInt(this.state.hash1) || 10;
        let count = 1; // count starts at 1 for linear & quadratic probing
        if(this.state.collisionResolution === "double") {
            count = 0; // count starts at 0 for double hashing
        }

        let info = [];
        info.push(<div><p>Value {value} is assigned to key {index} via ({value} % {tableSize})</p></div>);

        const startingVal = index;
        const hash1 = index % tableSize;
        const hash2 = this.state.hash2 - (index % this.state.hash2); // default 7 for largest prime < table size
        while(count < tableSize) {
            if(this.state.collisionResolution === "linear") { // LINEAR PROBING
                let previous = index;
                index = (index + 1); // increment index
                if(index >= tableSize) {
                    index = index % tableSize; // mod tableSize to remove out of bounds values
                    info.push(<div><p>Collision {count}: Index {previous} + 1 was out of bounds, tried inserting at beginning index 0</p></div>);
                } else {
                    info.push(<div><p>Collision {count}: Tried inserting at index {previous} + 1 (index {index})</p></div>);
                }
                
                count++;
            } else if(this.state.collisionResolution === "quad") { // QUADRATIC PROBING
                index = (startingVal + (count ** 2)); // increment index by 1, then 4, then 9, etc.
                if(index >= tableSize) {
                    index = index % tableSize; // mod tableSize to remove out of bounds values
                    info.push(<div><p>Collision {count}: Index {startingVal} + {count ** 2} was out of bounds, tried inserting at index {index}</p></div>);
                } else {
                    info.push(<div><p>Collision {count}: Tried inserting at index {startingVal} + {count ** 2} (index {index})</p></div>);
                }
                
                count++;
            } else if(this.state.collisionResolution === "double") { // DOUBLE HASHING
                let previous = index;
                index = (hash1 + (count * hash2));
                if(index >= tableSize) {
                    index = index % tableSize; // mod tableSize to remove out of bounds values
                    info.push(<div><p>Collision {count+1}: Index {previous} + {hash2} was out of bounds, tried inserting at index {index}</p></div>);
                } else {
                    info.push(<div><p>Collision {count+1}: Tried inserting at index {previous} + {hash2} (index {index})</p></div>);
                }

                count++;
            }

            if(grid[index] === "") {
                this.setState((prevState) => {
                    const newGrid = [...prevState.grid];
                    newGrid[index] = value;
                    return {grid: newGrid};
                });

                info.push(<div><p> Inserted {value} at index {index}</p></div>);
                break;
            } else if(count === tableSize) {
                info.push(<div><p>Failed to insert; value could not be accommodated in table</p></div>);
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
        let info = [];

        if(grid[index] === "") {
            grid[index] = value;
            this.setState({grid});
            
            info.push(<div><p>Value {value} is assigned to key {index} via ({value} % {this.state.hash1})</p></div>);
            info.push(<div><p>Inserted {value} at index {index} with no collisions</p></div>);
            this.setState({info: info, isEmpty: false});
        }
        else this.resolveCollision(value, index, grid);
    }

    render() { 
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
                <div className="custom-input-container">
                    <input 
                        className="custom-values-input" 
                        type="text" 
                        placeholder="Enter values (comma-separated, e.g., 5,12,23,8)" 
                        value={this.state.customValues}
                        onChange={this.handleCustomValuesChange}
                    />
                    <button className="button-small" onClick={this.loadCustomValues}>Load Custom Values</button>
                </div>
                <div className="button-container">
                    <button className="button" onClick={() => this.resetArray()}>Generate Random Queue</button>
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
                <div className="grid-container">
                    {grid.map((value, idx) => (
                        <div className="grid-box" key={idx}>
                            {value}
                        </div>
                    ))}
                </div>
                <div className="hash">
                    <div className="hash-line">
                    <label className="text-label" htmlFor="hash1">Table Size: </label>
                    <input className="input" type="text" id="hash1" placeholder="10" 
                    value={this.state.hash1} onChange={this.handleHash1Change}></input>
                    <button className="button-small" onClick={this.updateTableSize}>Update Size</button>
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
                <div className="info-panel">
                    <InfoPanel info={this.state.info} isEmpty={this.state.isEmpty} />
                </div>
            </div>
        )
    }
}

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const getInitialGrid = (size = 10) => {
    const grid = [];
    for (let col = 0; col < size; col++) {
      grid.push("");
    }
    return grid;
  };
import React from "react";
import './HashingVisualizer.css';


export default class HashingVisualizer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            array: [],
            grid: []
        };

        this.handleDropdownChange = this.handleDropdownChange.bind(this);
    }

    handleDropdownChange(e) {
        this.setState({collisionResolution: e.target.value});
    }

    componentDidMount() {
        this.resetArray();
    }

    resetArray() {
        const array = [];
        const grid = getInitialGrid();
        for (let i = 0; i < 10; i++) {
            array.push(randomIntFromInterval(0, 99)); // generates random ints from 0 to 99
        }
        this.setState({array, grid});
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

    resolveCollision(value, index, grid) { // change to allow different collision resolution methods
        let count = 0;
        const startingVal = index;
        const hash1 = index % 10; // 10 is table size
        const hash2 = 7 - (index % 7); // 7 is largest prime smaller than table size
        while(true) { // FIXME: Add dropdown for different coll res techniques
            if(this.state.collisionResolution === "linear") { // LINEAR PROBING
                index = (index + 1) % 10; // increment index and mod 10 to remove out of bounds values
            } else if(this.state.collisionResolution === "quad") { // QUADRATIC PROBING
                count++; // count needs to be 1 before checking for quadratic
                index = (startingVal + (count ** 2)) % 10; // increment index by 1, then 4, then 9, etc.
            } else if(this.state.collisionResolution === "double") { // DOUBLE HASHING
                index = (hash1 + (count * hash2)) % 10;
                count++;
            }
           
            if(grid[index] === "") {
                grid[index] = value;
                this.setState({grid});
                break;
            }
        }
    }

    setKey(key) {
        return key % 10;
    }

    insert(value) {
        const {grid} = this.state;
        const index = this.setKey(value);
        if(grid[index] === "") {
            grid[index] = value;
            this.setState({grid});
        }
        else this.resolveCollision(value, index, grid);
    }

    render() { 
        /*  FIXME: Add current hash function to top left and way to change hash number
            Add choices of collision resolution (dropdown top right default linear probing)
            Add descriptions/animations of hashing process
        */
        const {array, grid} = this.state;

        return (
            <div className="array">
                <h2>Queue: </h2>
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
                        <option value="linear">Linear Probing</option>
                        <option value="quad">Quadratic Probing</option>
                        <option value="double">Double Hashing</option>
                    </select>
                </div>
                <div className="grid-container">
                    {grid.map((value, idx) => (
                        <div className="grid-box" key={idx}>
                            {value}
                        </div>
                    ))}
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
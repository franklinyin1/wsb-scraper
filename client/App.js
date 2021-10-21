import React from "react";
import { connect } from "react-redux";
import { fetchStocks } from "./store/stocks";

class App extends React.Component {
  componentDidMount() {
    this.props.loadStocks();
  }

  render() {
    const stocks = this.props.stocks;
    let rows = [
      [
        <td key={`cell${0}-1`}>Ticker</td>,
        <td key={`cell${0}-2`}>Company Name</td>,
        <td key={`cell${0}-3`}>References</td>,
        <td key={`cell${0}-4`}>Sentiment</td>,
        <td key={`cell${0}-5`}>Average Sentiment (Min: -1 (Bearish); Max: 1 (Bullish) </td>,
      ],
    ];
    for (let i = 1; i <= stocks.length; i++) {
      let rowID = `row${i}`;
      let cell = [];
      cell.push(<td key={`cell${i}-1`}>{stocks[i-1].ticker}</td>);
      cell.push(<td key={`cell${i}-2`}>{stocks[i-1].companyName}</td>);
      cell.push(<td key={`cell${i}-3`}>{stocks[i-1].references}</td>);
      cell.push(<td key={`cell${i}-4`}>{stocks[i-1].sentiment.toFixed(2)}</td>);
      cell.push(
        <td key={`cell${i}-5`}>{stocks[i-1].avgSentiment.toFixed(2)}</td>
      );
      rows.push(
        <tr key={i} id={rowID}>
          {cell}
        </tr>
      );
    }
    return (
      <React.Fragment>
        <h2>r/WallStreetBets Stock References</h2>
        <div className="row">
          <div className="col s12 board">
            <table id="simple-board">
              <tbody>{rows}</tbody>
            </table>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapState = (state) => {
  return {
    stocks: state.stocks,
  };
};

const mapDispatch = (dispatch) => {
  return {
    loadStocks: () => dispatch(fetchStocks()),
  };
};

export default connect(mapState, mapDispatch)(App);

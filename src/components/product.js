import React, { Component } from "react";
import { getProductJson, getProductJsonItem } from "../services/productService";

class Product extends Component {
  state = {
    items: [],
    isLoading: false,
    error: null
  };

  componentDidMount() {
    try {
      const items = getProductJson();
      console.log(items);
      this.setState({ items });
    } catch (error) {
      this.setState({
        error,
        isLoading: false
      });
    }
  }

  async handleDetails(anObjectMappedKey) {
    // save orginalItems
    const originalItems = this.state.items;

    try {
      const items = await getProductJsonItem(anObjectMappedKey);
      this.setState({ items });
    } catch (ex) {
      if (ex.response && ex.response.status === 404) console.log(ex);

      // back saved Items to items
      this.setState({ items: originalItems });
    }
  }

  getRows() {
    if (this.state.items) {
      return (
        <div className="card-deck card-deck--mod">
          {this.state.items.map((anObjectMapped, index) => (
            <div className="card card--mod" key={anObjectMapped.id}>
              <img
                className="card-img-top h-100"
                src={
                  process.env.React_APP_API_URL +
                  anObjectMapped["product-photo"]
                }
                alt={anObjectMapped["product-photo"]}
              />
              <div className="card-body">
                <h5 className="card-title"> {anObjectMapped.label}</h5>
                <p className="card-text"> {anObjectMapped.price}</p>
                <button
                  className="sl-btn m-2"
                  onClick={() => this.handleDetails(anObjectMapped.id)}
                >
                  show only me
                </button>
              </div>
            </div>
          ))}
        </div>
      );
    } else {
      return <p>data is not available</p>;
    }
  }
  render() {
    const { isLoading, error } = this.state;

    if (error) {
      return <p>{error.message}</p>;
    }

    if (isLoading) {
      return <p>Loading ...</p>;
    }
    return <div className="row">{this.getRows()}</div>;
  }
}

export default Product;

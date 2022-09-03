import React from "react";
import { Button } from "antd";
import { useDispatch } from "react-redux";

//Import Item CSS
import "./Items.css";

function Items({ item }) {
  const dispatch = useDispatch();
  function addTocart() {
    dispatch({ type: "addToCart", payload: { ...item, quantity: 1 } });
  }
  return (
    <div className="itemsbodySec">
      <div className="itemImage">
        <img src={item.imageUrl} alt="" width={100} height={100} />
      </div>
      <p className="itemName">{item.name}</p>
      <p className="priceItm">
        <b>Price : </b>₹ {item.price}
      </p>
      <Button onClick={() => addTocart()} className="addTocart">Add To Cart</Button>
    </div>
  );
}

export default Items;
